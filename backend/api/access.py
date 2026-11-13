"""Who may do what with each model, written by Shikshya from the app's plan. Do not edit: the tables below are the one
place the server reads a role's rights from, and the build checks every view against them. A user's role comes from
the database row on every request, never from a request body or a token. An unknown role or model gets no access;
another person's row answers 404."""
import inspect
from typing import Any, Callable, Dict, List, Optional

from django.db import IntegrityError, transaction
from django.db.models import Q, QuerySet
from django.http import Http404
from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.request import Request

VISITOR = 'visitor'
SUPERUSER = 'superuser'
READS_ALL = ('read', 'post')
READS_OWN = ('own', 'read_own')
WRITES_OWN = ('own', 'post')
ROLE_FIELD = 'role'
ROLES = ('patient', 'doctor', 'receptionist')
DEFAULT_ROLE = 'patient'
STAFF_ROLES = ('doctor', 'receptionist')
# model -> who -> level: manage, read, post (read all, write own), own, read_own, create, none
ACCESS = {'DoctorProfile': {'patient': 'read', 'doctor': 'own', 'receptionist': 'read', 'visitor': 'read'},
 'PatientProfile': {'patient': 'own', 'doctor': 'read', 'receptionist': 'read', 'visitor': 'none'},
 'Service': {'patient': 'read', 'doctor': 'read', 'receptionist': 'read', 'visitor': 'read'},
 'ClinicHour': {'patient': 'read', 'doctor': 'read', 'receptionist': 'read', 'visitor': 'read'},
 'Appointment': {'patient': 'own', 'doctor': 'own', 'receptionist': 'manage', 'visitor': 'none'},
 'VisitNote': {'patient': 'read_own', 'doctor': 'own', 'receptionist': 'none', 'visitor': 'none'},
 'Prescription': {'patient': 'read_own', 'doctor': 'own', 'receptionist': 'none', 'visitor': 'none'},
 'Bill': {'patient': 'read_own', 'doctor': 'none', 'receptionist': 'none', 'visitor': 'none'},
 'Document': {'patient': 'own', 'doctor': 'read', 'receptionist': 'none', 'visitor': 'none'}}
# model -> role -> the lookups from a row to the signed-in user: what 'own' means for the role
OWNERS = {'DoctorProfile': {'doctor': ('user',)},
 'PatientProfile': {'patient': ('user',)},
 'Appointment': {'patient': ('patient',), 'doctor': ('doctor',)},
 'VisitNote': {'patient': ('patient',), 'doctor': ('doctor',)},
 'Prescription': {'patient': ('patient',), 'doctor': ('doctor',)},
 'Bill': {'patient': ('patient',)},
 'Document': {'patient': ('patient',)}}
# model -> role -> the link the server sets to the signed-in user on a new row
OWNER_FIELDS = {'DoctorProfile': {'doctor': 'user'},
 'PatientProfile': {'patient': 'user'},
 'Appointment': {'patient': 'patient', 'doctor': 'doctor'},
 'VisitNote': {'doctor': 'doctor'},
 'Prescription': {'doctor': 'doctor'},
 'Document': {'patient': 'patient'}}
# model -> link -> the parent link it is copied from (a note's patient is its appointment's)
COPIED = {'VisitNote': {'doctor': 'appointment', 'patient': 'appointment'},
 'Prescription': {'doctor': 'appointment', 'patient': 'appointment'},
 'Bill': {'patient': 'appointment'}}
# model -> link -> the role the linked user must have
PEOPLE = {'Appointment': {'patient': 'patient', 'doctor': 'doctor'},
 'VisitNote': {'doctor': 'doctor', 'patient': 'patient'},
 'Prescription': {'doctor': 'doctor', 'patient': 'patient'},
 'Bill': {'patient': 'patient'},
 'Document': {'patient': 'patient'}}
# model -> link -> the model it points to: a row the caller must be able to read
LINKS = {'VisitNote': {'appointment': 'Appointment'},
 'Prescription': {'appointment': 'Appointment'},
 'Bill': {'appointment': 'Appointment'}}
# model -> the fields only staff roles set: money, paid marks, the status of a paid record
FROZEN = {}
# model -> frozen field -> the value a new row starts with
DEFAULTS = {}
# model -> (status field, starting value, the values a non-staff role may move it to)
STATUS = {'Appointment': ('status', 'requested', ('cancelled',))}
# the models whose own rows a role may delete; a record with a status is cancelled
DELETE_OWN = ('Service', 'ClinicHour', 'VisitNote', 'Prescription', 'Document')


def role_of(user: Any) -> str:
    """The signed-in user's role from the database row; 'visitor' when nobody is signed in, '' for an unknown role. A
    user with a staff role keeps that role whatever their flags say. A user flagged is_staff without one counts as the
    first staff role (the app's staff account), or manages everything when the plan names no staff role."""
    if user is None or not getattr(user, 'is_authenticated', False):
        return VISITOR
    if getattr(user, 'is_superuser', False):
        return SUPERUSER
    role = getattr(user, ROLE_FIELD, None) if ROLE_FIELD else None
    if role in STAFF_ROLES:
        return role
    if getattr(user, 'is_staff', False):
        return STAFF_ROLES[0] if STAFF_ROLES else SUPERUSER
    if ROLE_FIELD:
        return role if role in ROLES else ''
    return DEFAULT_ROLE


def level_for(user: Any, model: str) -> str:
    """What the user may do with a model; an unknown role or model gets 'none'."""
    who = role_of(user)
    if who == SUPERUSER:
        return 'manage'
    return ACCESS.get(model, {}).get(who, 'none')


def allowed(user: Any, model: str, method: str, action: Optional[str] = None) -> bool:
    """True when the user's level on the model covers this kind of request."""
    level = level_for(user, model)
    if level == 'manage':
        return True
    if method in permissions.SAFE_METHODS:
        return level in READS_ALL or level in READS_OWN
    if method == 'POST' and action in (None, 'create'):
        return level in ('post', 'own', 'create')
    if method == 'DELETE':
        return level in WRITES_OWN and model in DELETE_OWN
    return level in WRITES_OWN


def scope(user: Any, model: str, queryset: QuerySet, write: bool = False) -> QuerySet:
    """The rows of the queryset the user may read (write=True: change). Never more rows than it was given."""
    level = level_for(user, model)
    if level == 'manage' or (level in READS_ALL and not write):
        return queryset
    if (level in READS_OWN and not write) or (level in WRITES_OWN and write):
        mine: Optional[Q] = None
        for path in OWNERS.get(model, {}).get(role_of(user), ()):
            mine = Q(**{path: user}) if mine is None else mine | Q(**{path: user})
        if mine is None:
            return queryset.none()
        return queryset.filter(pk__in=queryset.model._default_manager.filter(mine).values('pk'))
    return queryset.none()


def model_of(view: Any) -> str:
    """The plan model a view serves: its access_model, or its queryset's model."""
    name = getattr(view, 'access_model', '')
    if name:
        return name
    queryset = getattr(view, 'queryset', None)
    return queryset.model.__name__ if queryset is not None else ''


class AccessPermission(permissions.BasePermission):
    """The plan's access table on a view: the request against the caller's level, then the row against their rows."""
    message = 'You do not have access to this.'

    def has_permission(self, request: Request, view: Any) -> bool:
        return allowed(request.user, model_of(view), request.method, getattr(view, 'action', None))

    def has_object_permission(self, request: Request, view: Any, obj: Any) -> bool:
        name = type(obj).__name__
        write = request.method not in permissions.SAFE_METHODS
        return name in ACCESS and scope(request.user, name, type(obj)._default_manager.filter(pk=obj.pk), write).exists()


def _attname(instance: Any, field: str) -> str:
    return instance._meta.get_field(field).attname


def owner_row(user: Any, model: Any, field: str) -> Any:
    """What a model's owner link holds for this user: the user, or the user's own row of the profile it points to."""
    related = model._meta.get_field(field).related_model
    if isinstance(user, related):
        return user
    for link in related._meta.get_fields():
        if getattr(link, 'one_to_one', False) and link.concrete and isinstance(user, link.related_model):
            row = related._default_manager.filter(**{link.name: user}).first()
            if row is not None:
                return row
    raise PermissionDenied('Your account has no profile for this yet.')


def snapshot(model: str, instance: Any) -> Dict[str, Any]:
    """The server-owned values of a row before an update."""
    names = set(OWNER_FIELDS.get(model, {}).values()) | set(COPIED.get(model, {})) | set(LINKS.get(model, {}))
    names |= set(PEOPLE.get(model, {})) | set(FROZEN.get(model, ()))
    if model in STATUS:
        names.add(STATUS[model][0])
    return {_attname(instance, n): getattr(instance, _attname(instance, n)) for n in names}


def settle(user: Any, model: str, instance: Any, before: Optional[Dict[str, Any]] = None) -> List[str]:
    """Put the server's own values on a row the view just saved and refuse links the caller cannot reach. Returns the
    fields it changed; raises PermissionDenied or ValidationError, which rolls the write back."""
    who = role_of(user)
    created = before is None
    old = before or {}
    for field, role in PEOPLE.get(model, {}).items():
        att = _attname(instance, field)
        if getattr(instance, att) is not None and (created or old.get(att) != getattr(instance, att)):
            if getattr(getattr(instance, field), ROLE_FIELD, None) != role:
                raise ValidationError({field: ['Choose a %s.' % role.replace('_', ' ')]})
    if who == SUPERUSER or ACCESS.get(model, {}).get(who) == 'manage':
        return []
    changed: List[str] = []

    def put(att: str, value: Any) -> None:
        if getattr(instance, att) != value:
            setattr(instance, att, value)
            changed.append(att)

    for field, target in LINKS.get(model, {}).items():
        att = _attname(instance, field)
        value = getattr(instance, att)
        if value is None or (not created and old.get(att) == value):
            continue
        related = instance._meta.get_field(field).related_model
        if not scope(user, target, related._default_manager.filter(pk=value)).exists():
            raise PermissionDenied('You cannot use that %s.' % field.replace('_', ' '))
    for field, parent in COPIED.get(model, {}).items():
        source = getattr(instance, parent, None)
        if source is not None:
            put(_attname(instance, field), getattr(source, _attname(source, field)))
    owner = OWNER_FIELDS.get(model, {}).get(who)
    if owner:
        att = _attname(instance, owner)
        put(att, owner_row(user, type(instance), owner).pk if created else old.get(att))
    if who not in STAFF_ROLES:
        defaults = DEFAULTS.get(model, {})
        for field in FROZEN.get(model, ()):
            att = _attname(instance, field)
            if not created:
                put(att, old.get(att))
            elif field in defaults:
                put(att, defaults[field])
        if model in STATUS and STATUS[model][0] not in FROZEN.get(model, ()):
            field, start, cancel = STATUS[model]
            if created:
                put(field, start)
            elif getattr(instance, field) != old.get(field) and getattr(instance, field) not in cancel:
                put(field, old.get(field))
    if changed:
        instance.save(update_fields=changed)
    return changed


def _request(view: Any) -> Any:
    return getattr(view, 'request', None)


def _narrow(view: Any, queryset: QuerySet) -> QuerySet:
    """The view's rows narrowed to the caller's rows; no rows when there is no request to read a caller from."""
    request = _request(view)
    if request is None:
        return queryset.none()
    return scope(request.user, model_of(view), queryset, request.method not in permissions.SAFE_METHODS)


def _owner_link(view: Any) -> str:
    """The link the server fills for this caller on the view's model, '' for a caller who manages the model."""
    user, model = view.request.user, model_of(view)
    return '' if level_for(user, model) == 'manage' else OWNER_FIELDS.get(model, {}).get(role_of(user), '')


def _create(view: Any, serializer: Any, save: Callable[[Any], None]) -> None:
    """Run the view's own save in one transaction with the server's values: the owner goes in before, the rest after."""
    user, model = view.request.user, model_of(view)
    owner = _owner_link(view)
    target = getattr(getattr(serializer, 'Meta', None), 'model', None)
    if owner and target is not None and isinstance(serializer.validated_data, dict):
        serializer.validated_data[owner] = owner_row(user, target, owner)
    try:
        with transaction.atomic():
            save(serializer)
            saved = serializer.instance
            for row in saved if isinstance(saved, (list, tuple)) else [saved]:
                settle(user, model, row)
    except IntegrityError:
        raise ValidationError({'detail': ['This record already exists or is missing a required value.']})


def _update(view: Any, serializer: Any, save: Callable[[Any], None]) -> None:
    user, model = view.request.user, model_of(view)
    before = snapshot(model, serializer.instance)
    try:
        with transaction.atomic():
            save(serializer)
            settle(user, model, serializer.instance, before)
    except IntegrityError:
        raise ValidationError({'detail': ['This record already exists or is missing a required value.']})


def _reachable(view: Any, obj: Any) -> Any:
    """The row a view's own get_object() found, or 404 when it is a plan row the caller cannot reach."""
    if type(obj).__name__ in ACCESS and not AccessPermission().has_object_permission(view.request, view, obj):
        raise Http404
    return obj


def _with_table(found: List[Any]) -> List[Any]:
    return [AccessPermission()] + [p for p in found if not isinstance(p, AccessPermission)]


def _guarded(name: str, own: Callable[..., Any]) -> Callable[..., Any]:
    """A view's own method with the access table around it, so writing the method in a view never takes the table off."""
    if name == 'get_queryset':
        def method(self: Any) -> QuerySet:
            return _narrow(self, own(self))
    elif name == 'perform_create':
        def method(self: Any, serializer: Any) -> None:  # type: ignore[misc]
            _create(self, serializer, lambda s: own(self, s))
    elif name == 'perform_update':
        def method(self: Any, serializer: Any) -> None:  # type: ignore[misc]
            _update(self, serializer, lambda s: own(self, s))
    elif name == 'get_object':
        def method(self: Any) -> Any:  # type: ignore[misc]
            return _reachable(self, own(self))
    else:
        def method(self: Any) -> List[Any]:  # type: ignore[misc]
            return _with_table(own(self))
    method.__name__, method.__doc__ = name, own.__doc__
    method._access_guarded = True  # type: ignore[attr-defined]
    return method


GUARDED_METHODS = ('get_queryset', 'perform_create', 'perform_update', 'get_object', 'get_permissions')


class AccessMixin:
    """The first base of every view over a plan model. The view's rows are narrowed to the caller's rows (another
    person's row answers 404), the access table is always among its permissions, and a create or an update runs in one
    transaction with the server's own values put back after the view saves. A view that writes one of these methods
    itself gets the same treatment: the table goes around the view's own method."""
    access_model = ''
    permission_classes = [AccessPermission]

    def __init_subclass__(cls, **kwargs: Any) -> None:
        super().__init_subclass__(**kwargs)
        for name in GUARDED_METHODS:
            own = cls.__dict__.get(name)
            if inspect.isfunction(own) and not getattr(own, '_access_guarded', False):
                setattr(cls, name, _guarded(name, own))

    def get_permissions(self) -> List[Any]:
        return _with_table(super().get_permissions())  # type: ignore[misc]

    def get_queryset(self) -> QuerySet:
        return _narrow(self, super().get_queryset())  # type: ignore[misc]

    def get_object(self) -> Any:
        return _reachable(self, super().get_object())  # type: ignore[misc]

    def get_serializer(self, *args: Any, **kwargs: Any) -> Any:
        serializer = super().get_serializer(*args, **kwargs)  # type: ignore[misc]
        owner = _owner_link(self) if _request(self) is not None else ''
        for field in getattr(serializer, 'fields', {}).values() if owner else ():
            if field.source == owner and not field.read_only:
                field.required = False
        return serializer

    def perform_create(self, serializer: Any) -> None:
        _create(self, serializer, super().perform_create)  # type: ignore[misc]

    def perform_update(self, serializer: Any) -> None:
        _update(self, serializer, super().perform_update)  # type: ignore[misc]
