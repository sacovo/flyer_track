from django.contrib.gis import forms

from map.models import FlyerPatch


class PatchCreateForm(forms.ModelForm):
    class Meta:
        model = FlyerPatch
        fields = ['shape', 'flyer_count', 'confirmed']


class PatchUpdateForm(forms.ModelForm):
    class Meta:
        model = FlyerPatch
        fields = ['flyer_count', 'confirmed']
