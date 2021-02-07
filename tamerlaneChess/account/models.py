from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from rest_framework_simplejwt.tokens import RefreshToken

class UserManager(BaseUserManager):

    def create_user(self, email, username, firstname, lastname, password=None):

        if firstname is None:
            raise TypeError('Kullanıcı ismi gerekli')
        if lastname is None:
            raise TypeError('Kullanıcı soy ismi gerekli')
        if email is None:
            raise TypeError('Email gerekli')
        if username is None:
            raise TypeError("username is required")
        user = self.model(
            username=username,
            firstname=firstname,
            lastname=lastname,
            email=self.normalize_email(email),

        )

        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, username, firstname, lastname, password=None):
        user = self.create_user(
            email,
            username,
            firstname,
            lastname,
            password
        )

        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user


class User(AbstractBaseUser):

    email = models.EmailField(max_length=100, unique=True)
    username = models.CharField(max_length=20, unique=True)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ('firstname', 'lastname', "username")

    objects = UserManager()

    def __str__(self):
        return self.email

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }

    @staticmethod
    def has_perm(perm, obj=None):
        return True

    @staticmethod
    def has_module_perms(app_label):
        return True
