from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    RegisterView,
    VerifyEmail,
    LoginAPIView,
    RequestResetPasswordByEmailView,
    PasswordResetConfirmToken,
    SetNewPasswordView,
)


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('email-verify/', VerifyEmail.as_view(), name='verify-email'),
    path('password-reset-request/', RequestResetPasswordByEmailView.as_view(), name='reset-password'),
    path('password-reset-confirm/', SetNewPasswordView.as_view(), name='reset-password-complete'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]
