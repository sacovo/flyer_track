from django.urls.conf import path

from map.views import create_patch, delete_patch, find_patches, index, update_patch

app_name = "map"

urlpatterns = [
    path("", index, name="index"),
    path("patches/", find_patches, name="find_patches"),
    path("create/", create_patch, name="create_patch"),
    path("update/<int:pk>/", update_patch, name="update_patch"),
    path("delete/<int:pk>/", delete_patch, name="delete_patch"),
]
