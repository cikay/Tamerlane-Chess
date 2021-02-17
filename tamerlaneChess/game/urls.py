from django.urls import path
from .views import GameView



urlpatterns = [
    path('online/', GameView.as_view()),
    path('online/<int:pk>', GameView.as_view())
]