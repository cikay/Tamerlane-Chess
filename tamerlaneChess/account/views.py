from django.shortcuts import render, get_object_or_404
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth import authenticate
from django.urls import reverse
from django.conf import settings
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import smart_bytes, smart_str
from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, filters
from rest_framework.authtoken.models import Token
from rest_framework.filters import SearchFilter, OrderingFilter
import jwt
from environs import Env
from .models import User
from .serializers import (
    RegisterSerializer,
    EmailVerificationSerializer,
    LoginSerializer,
    ResetPasswordByEmailSerializer,
    SetNewPasswordSerializer,
    UserSerializer
)

from .utils import get_object_or_none
from django.contrib.auth import views as auth_views
from django.views.generic.list import ListView

class SearchView(generics.ListAPIView):
    serializer_class = UserSerializer
    def get_queryset(self):
        return User.objects.filter(username__startswith=self.kwargs['username'])



class RegisterView(generics.GenericAPIView):

    serializer_class = RegisterSerializer

    def post(self, request):
        print(request.data)
        user = get_object_or_none(User, email=request.data['email'])
        print("user", user)
        if user:
            if user.is_verified:
                return Response('Zaten kayıtlısınız! Giriş sayfasına gidin', status=status.HTTP_409_CONFLICT)
            else:
                """
                    token süresi kontrol edilecek
                """
                return Response('Zaten kayıtlısınız! Ancak mail doğrulaması \
                    yapılmamış.', status=status.HTTP_401_UNAUTHORIZED)
       
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user = User.objects.get(email=request.data['email'])
        token = RefreshToken.for_user(user).access_token
        env = Env()
        Env.read_env()
        FRONTEND_URL = env('FRONTEND_URL')
        verify_link = f"{FRONTEND_URL}/account/email-verify?token={str(token)}"
        subject = "Mail doğrulama"
        to_email = user.email
        params = {
            'verify_link': verify_link,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'base_url': FRONTEND_URL,
        }

        html_content = render_to_string('verify_email.html', params)
        text_content = strip_tags(html_content)
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            to=[user.email],
        )
       
        email.attach_alternative(html_content, 'text/html')
        email.send()
        return Response('Kaydı tamamlamak için mail adresinize gelen linkten doğrulama yapınız!', status=status.HTTP_201_CREATED)


class VerifyEmail(views.APIView):
    serializer_class = EmailVerificationSerializer

    def post(self, request):
        try:
            token = request.data.get('token')
            payload = jwt.decode(token, settings.SECRET_KEY)
            user = User.objects.get(id=payload['user_id'])
            if(user.is_verified):
                return Response({'email': 'Hesabınız zaten aktif'}, status=status.HTTP_200_OK)
            user.is_verified = True
            user.save()
            return Response({'email': 'Hesabınız aktifleştirildi'}, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError as indentifier:
            return Response({'email': 'Aktivasyon linkinin son kullanma tarihi geçmiş'}, status=status.HTTP_400_BAD_REQUEST)

        except jwt.exceptions.DecodeError as indentifier:
            return Response({'email': 'Geçersiz token'}, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    def post(self, request):
        user = User.objects.get(email=request.data['email'])
        if not user.is_verified:
            return Response('Mail doğrulaması yapılmadı. Mal adresinize gelen linkten doğrulama yapınız!', status.HTTP_403_FORBIDDEN)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        response_data = {
            'id': user.id,
            'username': user.username,
            'tokens': serializer.data['tokens']
        }
        return Response(response_data, status.HTTP_200_OK)



class RequestResetPasswordByEmailView(generics.GenericAPIView):
    serializer_class = ResetPasswordByEmailSerializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        user = get_object_or_none(User, email=request.data['email'])
        if not user:
            return Response('Girdiğiniz mail adresi kayıtlı değil! \
                Kayıt ol sayfasından kaydolabilirsiniz.', status=status.HTTP_404_NOT_FOUND)
        
        uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
        token = PasswordResetTokenGenerator().make_token(user)
        env = Env()
        Env.read_env()
        FRONTEND_URL = env('FRONTEND_URL')
        
        relative_link = f"account/password-reset-complete/{uidb64}/{token}"
        password_reset_confirm_link = f"{FRONTEND_URL}/{relative_link}"
        subject = "Şifre sıfırlama"
        params = {
            'password_reset_confirm_link': password_reset_confirm_link,
            'firstname': user.firstname,
            'lastname': user.lastname,
        }
        
        html_content = render_to_string('password_reset_confirm.html', params)
        text_content = strip_tags(html_content)
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            to=[user.email],
        )
        email.attach_alternative(html_content, 'text/html')
        email.send()
        return Response('Yeni şifre oluşturmak için size mail gönderdik!', status=status.HTTP_200_OK)

class PasswordResetConfirmToken(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    def post(self, request):
        uidb64 = request.data['uidb64']
        token = request.data['token']
        id = smart_str(urlsafe_base64_decode(uidb64))
        user = get_object_or_none(User, id=id)
        if not user:
            return Response('Sisteme kayıtlı değilsiniz! Kaydol sayfasından kaydolabilirsiniz!', status=status.HTTP_404_NOT_FOUND) 
        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response('Link geçerli değil. Lütfen yeni bir istekte bulunun!', status=status.HTTP_401_UNAUTHORIZED) 
        
        response_data = {
            'message': 'Link doğrulandı. Şifre oluşturma ekranına yönlendiriliyorsunuz!',
            'redirect_url': 'password-reset-complete'
        }
        return Response(response_data, status=status.HTTP_200_OK)
           

class SetNewPasswordView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def post(self, request):
        print(request.data)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response('Yeni şifre başarıyla oluşturuldu', status=status.HTTP_200_OK)