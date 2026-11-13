"""The app's ASGI entry, written by Shikshya: HTTP through Django; websockets signed in with the app's token
(api/ws_auth.py) and routed by api/routing.py."""
import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter  # noqa: E402

import api.routing  # noqa: E402
from api.ws_auth import TokenAuthMiddleware  # noqa: E402

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': TokenAuthMiddleware(URLRouter(api.routing.websocket_urlpatterns)),
})
