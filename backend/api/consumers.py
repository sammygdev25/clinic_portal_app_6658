"""Websocket consumers, written by Shikshya. Every socket needs a signed-in user: connect from the browser with
new WebSocket(url, ['token', token]) (api/ws_auth.py). A consumer the app adds extends SignedInSocket and answers
allowed() with its own rule; it never accepts a socket itself."""
import json
import re
from typing import Any, Optional, Tuple

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.apps import apps

from api.ws_auth import PROTOCOL

ROOM_RE = re.compile(r'^([a-z][a-z0-9_]{0,62})_([0-9]{1,18})$')


class SignedInSocket(AsyncWebsocketConsumer):
    """A socket only a signed-in user opens, and only when allowed() says yes; anyone else is turned away."""

    async def connect(self) -> None:
        user = self.scope.get('user')
        if user is None or not getattr(user, 'is_authenticated', False) or not await self.allowed(user):
            await self.close()
            return
        await self.joined(user)
        offered = self.scope.get('subprotocols') or []
        await self.accept(subprotocol=PROTOCOL if PROTOCOL in offered else None)

    async def allowed(self, user: Any) -> bool:
        return True

    async def joined(self, user: Any) -> None:
        """Join the channel groups the socket listens to."""


class NotificationConsumer(SignedInSocket):
    """The signed-in user's own notifications, pushed by the server with
    channel_layer.group_send('user_<id>', {'type': 'notification_message', 'message': {...}}). Clients only listen."""

    async def joined(self, user: Any) -> None:
        self.group_name = 'user_%s' % user.pk
        await self.channel_layer.group_add(self.group_name, self.channel_name)

    async def disconnect(self, close_code: int) -> None:
        if getattr(self, 'group_name', None):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data: Optional[str] = None, bytes_data: Optional[bytes] = None) -> None:
        """Notifications come from the server only; what a client sends is dropped."""

    async def notification_message(self, event: dict) -> None:
        await self.send(text_data=json.dumps(event['message']))


def room_row(room_id: str) -> Optional[Tuple[str, int]]:
    """The row a room is about: 'appointment_12' -> ('Appointment', 12); None for any other name."""
    found = ROOM_RE.match(room_id or '')
    if not found:
        return None
    for model in apps.get_app_config('api').get_models():
        if re.sub(r'(?<=.)(?=[A-Z])', '_', model.__name__).lower() == found.group(1):
            return model.__name__, int(found.group(2))
    return None


@database_sync_to_async
def can_read(user: Any, room_id: str) -> bool:
    """True when the access table lets the user read the row the room is about."""
    row = room_row(room_id)
    if row is None:
        return False
    try:
        from api import access
    except ImportError:
        return False
    model = apps.get_model('api', row[0])
    return access.scope(user, row[0], model._default_manager.filter(pk=row[1])).exists()


class RoomConsumer(SignedInSocket):
    """A room about one row: ws/room/<model>_<id>/ (appointment_12, order_5). It opens for a user the access table lets
    read that row. What a member sends goes to the room with the sender the server knows, never one the client names."""

    async def allowed(self, user: Any) -> bool:
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        return await can_read(user, self.room_id)

    async def joined(self, user: Any) -> None:
        self.room_group = 'room_%s' % self.room_id
        await self.channel_layer.group_add(self.room_group, self.channel_name)

    async def disconnect(self, close_code: int) -> None:
        if getattr(self, 'room_group', None):
            await self.channel_layer.group_discard(self.room_group, self.channel_name)

    async def receive(self, text_data: Optional[str] = None, bytes_data: Optional[bytes] = None) -> None:
        try:
            data = json.loads(text_data or '')
        except ValueError:
            return
        if isinstance(data, dict):
            await self.channel_layer.group_send(
                self.room_group, {'type': 'room_event', 'data': data, 'sender': self.scope['user'].pk})

    async def room_event(self, event: dict) -> None:
        await self.send(text_data=json.dumps({'sender': event.get('sender'), 'data': event.get('data')}))
