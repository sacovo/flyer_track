from django.contrib.auth import get_user_model
from django.contrib.gis.db import models
from django.utils import timezone

# Create your models here.


class FlyerPatch(models.Model):
    owner = models.ForeignKey(get_user_model(), models.CASCADE)
    shape = models.PolygonField()

    flyer_count = models.IntegerField()
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'Patch: [{",".join(str(x) for x in self.shape.envelope.extent)}]'
