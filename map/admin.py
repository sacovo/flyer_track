from django.contrib import admin

from map.models import FlyerPatch

# Register your models here.


@admin.register(FlyerPatch)
class PatchAdmin(admin.ModelAdmin):
    pass
