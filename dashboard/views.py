from django.shortcuts import render
from django.conf import settings
from social_django.models import UserSocialAuth

import json


def index_view(request):
    # API calls from js needs that key
    backend = {'apiId': settings.SOCIAL_AUTH_VK_OAUTH2_KEY}

    # If loggen in, send user's token too
    if request.user.is_authenticated:
        # This table stores relations between internal and external (vk) users
        vk_association = UserSocialAuth.objects.filter(provider='vk-oauth2',
                                                       user=request.user)[0]
        backend.update(access_token=vk_association.extra_data['access_token'])

    return render(request, 'dashboard/index.html', {'backend':
                                                    json.dumps(backend)})
