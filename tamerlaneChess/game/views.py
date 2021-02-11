from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import GameSerializers
from account.models import User

class GameView(generics.GenericAPIView):

    serializer_class = GameSerializers

    def post(self, request):
        # black_player_username = request.data['black_player']
        # data["black_player"] = User.objects.get(username=black_player_username).id
        # white_player_username = request.data['white_player']
        # data["white_player"] = User.objects.get(username=white_player_username).id
        # data["moves"] = []
        print(request.data)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid()
        print(serializer.errors)
        serializer.save()
        return Response("Game created", status=status.HTTP_201_CREATED)
    
    def put(self, request):
        pass