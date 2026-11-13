"""Websocket sign-in, written by Shikshya. A browser cannot send headers on a websocket, so the app's token rides in the
socket's protocol list: new WebSocket(url, ['token', token]). It never goes in the URL, which servers log. A missing or
wrong token leaves the socket anonymous, and every consumer refuses an anonymous socket (api/consumers.py)."""
from typing import Any, List, Optional

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser

PROTOCOL = 'token'


def offered_token(scope: dict) -> Optional[str]:
    """The token a socket offers as the protocol after 'token', or None."""
    offered: List[str] = list(scope.get('subprotocols') or [])
    if len(offered) >= 2 and offered[0] == PROTOCOL and offered[1]:
        return offered[1]
    return None


@database_sync_to_async
def user_for(token: str) -> Any:
    """The user a token belongs to, checked the way every API request checks it; anonymous when it is not valid."""
    from knox.auth import TokenAuthentication
    from rest_framework.exceptions import AuthenticationFailed
    try:
        user, _ = TokenAuthentication().authenticate_credentials(token.encode('utf-8'))
    except AuthenticationFailed:
        return AnonymousUser()
    return user


class TokenAuthMiddleware(BaseMiddleware):
    """Puts the token's user on the socket's scope, or an anonymous user."""

    async def __call__(self, scope: dict, receive: Any, send: Any) -> Any:
        token = offered_token(scope)
        scope = dict(scope, user=await user_for(token) if token else AnonymousUser())
        return await super().__call__(scope, receive, send)
