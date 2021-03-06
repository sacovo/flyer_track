from django.contrib.auth import get_user_model
from django.contrib.gis.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

# Create your models here.


class FlyerPatch(models.Model):
    owner = models.ForeignKey(get_user_model(), models.CASCADE, verbose_name=_("Eigentümer*in"))
    shape = models.PolygonField(verbose_name=_("Bereich"))

    flyer_count = models.IntegerField(verbose_name=_("Anzahl Untersetzer"), default=50)
    date = models.DateTimeField(default=timezone.now, verbose_name=_("Datum"))

    confirmed = models.BooleanField(verbose_name=_("Status"),
                                    default=False,
                                    help_text=_("Wurden die Flyer bereits verteilt?"))

    def __str__(self):
        return f'Patch: [{",".join(str(x) for x in self.shape.envelope.extent)}]'
