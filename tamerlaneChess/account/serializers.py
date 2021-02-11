from django.contrib import auth
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str,  smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode



from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "firstname",
            "lastname",
            
        )

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(max_length=70, min_length=6, write_only=True)

    class Meta: 
        model = User
        fields = (
            'email',
            "username",
            'firstname',
            'lastname',
            'password'
        )

    def validate(self, attrs):
        email = attrs.get('email', '')
        username = attrs.get('username', '')
        firstname = attrs.get('firstname', '')
        lastname = attrs.get('lastname', '')

        return attrs
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class EmailVerificationSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=500)

    class Meta:
        model = User
        fields = ('token',)


class LoginSerializer(TokenObtainPairSerializer):
  
    password = serializers.CharField(max_length=64, write_only=True)
    email = serializers.EmailField(max_length=100)
    tokens = serializers.CharField(max_length=64, read_only=True)

    # class Meta: 
    #     model = User
    #     fields = (
    #         'password',
    #         'email',
    #         # 'firstname',
    #         # 'lastname',
    #         # 'tokens',
    #     )

  
    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')

        user = auth.authenticate(email=email, password=password)
        if not user:
            raise AuthenticationFailed('Kullanıcı bulunamadı! Bilgileri doğru girdiğinizden emin olun! Hesabınız yoksa kayıt olun')
        if not user.is_verified:
            raise AuthenticationFailed('Hesabınız aktif değil! Mail adresinize gelen doprulama linkinden aktif edebilirsiniz!')
        if not user.is_active:
            raise AuthenticationFailed('Bu hesap silinmiş!')
     
        return {
            'email': user.email,
            'tokens': user.tokens()
        }
    
    
    
    @classmethod
    def get_tokens(cls, user):
        user = User.objects.get(email=user['email'])
        token = super(LoginSerializer, cls).get_token(user)
        token['email'] = user.email
        return token



class ResetPasswordByEmailSerializer(serializers.Serializer):

    email = serializers.EmailField(max_length=100)
    class Meta:
        fields = ('email',)
    

class SetNewPasswordSerializer(serializers.Serializer):

    password = serializers.CharField(max_length=68, write_only=True)
    token = serializers.CharField(write_only=True)
    uidb64 = serializers.CharField(write_only=True)


    class Meta:
        fields = ('password', 'token', 'uidb64')
    
    def validate(self, attrs):

        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('Reset linki geçerli değil')

            user.set_password(password)
            user.save()
            return user
        except Exception as e:
            raise AuthenticationFailed('Reset linki geçerli değil', 401)
        
        