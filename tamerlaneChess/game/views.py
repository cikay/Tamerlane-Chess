from django.shortcuts import render
from django.http import Http404
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import GameSerializer
from account.models import User
from .models import Game

class GameView(generics.GenericAPIView):

    serializer_class = GameSerializer

    def post(self, request):
        print(request.data)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid()
        print(serializer.errors)
        white_player = User.objects.get(id=request.data['white_player'])
        black_player = User.objects.get(id=request.data['black_player'])
        game = Game(white_player=white_player, black_player=black_player, moves=[])
        game.save()
        print(serializer)
        data = {
            'message': "Game created",
            'id': game.id
        }
        return Response(data, status=status.HTTP_201_CREATED)
    
    def put(self, request, pk, format=None):
        game = self.get_object(pk)
        print("request data", request.data)
        if(request.data['player_color'] == 'b'):
            last_move = game.moves[-1]
            last_move['b'] = request.data['move']
        else:
            game.moves.append({'w':request.data['move']})

        game.save()
        print("game updated moves",game.moves)
        return Response('Hamle kaydedildi', status=status.HTTP_200_OK)
        

    def get_object(self, pk):
        try: 
            return Game.objects.get(pk=pk)
        except Game.DoesNotExist:
            raise Http404