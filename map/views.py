from typing import Any, Dict, Optional
from django.db.models import Sum

from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.core.serializers import serialize
from django.forms.models import BaseModelForm
from django.http.response import HttpResponse
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView, DeleteView, UpdateView

from map.forms import PatchCreateForm, PatchUpdateForm
from map.models import FlyerPatch

# Create your views here.


def populate_highlight(pk, ctx):
    print("Hello World!")

    obj = FlyerPatch.objects.get(pk=pk)
    p = obj.shape.centroid
    ctx['object'] = obj
    ctx['x'] = p.x
    ctx['y'] = p.y
    ctx['extent'] = obj.shape.extent


def index(request):
    """show the map and tiles"""

    highlightPk = request.GET.get('id', None)
    ctx = {
        'total': FlyerPatch.objects.all().aggregate(s=Sum('flyer_count'))['s'],
    }

    if highlightPk is not None:
        populate_highlight(highlightPk, ctx)

    return render(request, 'map/map_view.html', ctx)


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


class PatchDeleteView(UserIsOwnerMixin, DeleteView):
    model = FlyerPatch

    success_url = reverse_lazy("map:index")

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        ctx = super().get_context_data(**kwargs)
        populate_highlight(ctx['object'].pk, ctx)
        return ctx


delete_patch = PatchDeleteView.as_view()


class PatchUpdateView(UserIsOwnerMixin, UpdateView):
    model = FlyerPatch
    form_class = PatchUpdateForm

    template_name = "map/flyerpatch_update.html"

    success_url = reverse_lazy("map:index")

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        ctx = super().get_context_data(**kwargs)
        populate_highlight(ctx['object'].pk, ctx)
        return ctx


update_patch = PatchUpdateView.as_view()


def find_patches(request):

    return HttpResponse(serialize('geojson', FlyerPatch.objects.all()))
