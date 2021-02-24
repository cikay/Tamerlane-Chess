from django.db import models
from account.models import User



class Game(models.Model):

    BLACK = "b"
    WHITE = "w"
    STALEMATE = "s"
    GOING_ON = "g"
    STATUS = [
        (BLACK, "BLACK"),
        (WHITE, "WHITE"),
        (STALEMATE, "STALEMATE"),
        (GOING_ON, "GOING_ON")
    ]

    black_player = models.ForeignKey(User, on_delete=models.CASCADE, related_name="black_player")
    white_player = models.ForeignKey(User, on_delete=models.CASCADE, related_name="white_player")
    moves = models.JSONField(default=dict, blank=True, null=True)
    current_fen = models.CharField(max_length=300, blank=True, null=True)
    # result = models.CharField(max_length=2, choices=STATUS, default=GOING_ON, blank=True)


    def __str__(self):
        return f"{self.white_player.username}-{self.black_player.username}"