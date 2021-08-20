from typing import Optional

from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.core.serializers import serialize
from django.forms.models import BaseModelForm
from django.http.response import HttpResponse
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView, DeleteView, UpdateView

from map.forms import PatchCreateForm
from map.models import FlyerPatch

# Create your views here.


def index(request):
    """show the map and tiles"""
    return render(request, 'map/map_view.html', {})


class UserIsOwnerMixin(LoginRequiredMixin, UserPassesTestMixin):
    def test_func(self) -> Optional[bool]:
        return self.request.user == self.get_object().owner


class PatchCreateView(CreateView, LoginRequiredMixin):
    model = FlyerPatch

    form_class = PatchCreateForm
    success_url = reverse_lazy("map:index")

    def form_valid(self, form: BaseModelForm) -> HttpResponse:
        form.instance.owner = self.request.user
        return super().form_valid(form)


create_patch = PatchCreateView.as_view()


class PatchDeleteView(DeleteView, UserIsOwnerMixin):
    model = FlyerPatch


delete_patch = PatchDeleteView.as_view()


class PatchUpdateView(UpdateView, UserIsOwnerMixin):
    model = FlyerPatch

    def test_func(self) -> Optional[bool]:
        return self.request.user == self.get_object().owner


update_patch = PatchUpdateView.as_view()


def find_patches(request):

    return HttpResponse(serialize('geojson', FlyerPatch.objects.all()))
