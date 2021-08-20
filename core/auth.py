from django.contrib.auth import get_user_model


def get_user_by_username(id):
    User = get_user_model()
    user, created = User.objects.update_or_create(username=id['preferred_username'],
                                                  defaults={
                                                      'first_name': id['given_name'],
                                                      'last_name': id['family_name'],
                                                      'email': id['email'],
                                                  })
    user.backend = 'django.contrib.auth.backends.ModelBackend'
    return user
