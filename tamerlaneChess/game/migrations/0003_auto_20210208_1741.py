# Generated by Django 3.1.6 on 2021-02-08 17:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_auto_20210208_1741'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='moves',
            field=models.JSONField(default='dict'),
        ),
    ]
