# Generated by Django 3.1.6 on 2021-02-21 12:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0004_auto_20210208_1759'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='current_fen',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
    ]