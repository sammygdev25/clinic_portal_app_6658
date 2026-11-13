from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from api.models import DoctorProfile, PatientProfile, Service, ClinicHour
from api.serializers_core import (
    DoctorProfileSerializer,
    PatientProfileSerializer,
    ServiceSerializer,
    ClinicHourSerializer,
)
from api.access import AccessMixin, AccessPermission  # Shikshya's access table


class DoctorProfileViewSet(AccessMixin, viewsets.ModelViewSet):
    access_model = 'DoctorProfile'
    queryset = DoctorProfile.objects.all().order_by('specialty')
    serializer_class = DoctorProfileSerializer
    permission_classes = [AccessPermission]
    filterset_fields = ['user', 'specialty']
    search_fields = ['specialty', 'bio', 'user__username', 'user__first_name', 'user__last_name']
    ordering_fields = ['specialty', 'created_at']


class PatientProfileViewSet(AccessMixin, viewsets.ModelViewSet):
    access_model = 'PatientProfile'
    queryset = PatientProfile.objects.all().order_by('-created_at')
    serializer_class = PatientProfileSerializer
    permission_classes = [AccessPermission]
    filterset_fields = ['user']
    search_fields = ['phone', 'address', 'insurance_provider', 'user__username']
    ordering_fields = ['created_at', 'updated_at']


class ServiceViewSet(AccessMixin, viewsets.ModelViewSet):
    access_model = 'Service'
    queryset = Service.objects.all().order_by('name')
    serializer_class = ServiceSerializer
    permission_classes = [AccessPermission]
    filterset_fields = []
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']


class ClinicHourViewSet(AccessMixin, viewsets.ModelViewSet):
    access_model = 'ClinicHour'
    queryset = ClinicHour.objects.all().order_by('day_of_week')
    serializer_class = ClinicHourSerializer
    permission_classes = [AccessPermission]
    filterset_fields = ['day_of_week']
    search_fields = ['day_of_week']
    ordering_fields = ['day_of_week', 'open_time', 'close_time']