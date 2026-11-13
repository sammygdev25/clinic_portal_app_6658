from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from api.models import VisitNote, Prescription
from api.serializers_medical_records import VisitNoteSerializer, PrescriptionSerializer
from api.access import AccessMixin, AccessPermission  # Shikshya's access table


class VisitNoteViewSet(AccessMixin, viewsets.ModelViewSet):
    access_model = 'VisitNote'
    serializer_class = VisitNoteSerializer
    permission_classes = [AccessPermission]
    filterset_fields = ['appointment', 'doctor', 'patient']
    search_fields = ['content']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return VisitNote.objects.none()
        if getattr(user, 'role', None) == 'doctor':
            return VisitNote.objects.filter(
                Q(doctor=user) | Q(patient=user)
            ).order_by('-created_at')
        if getattr(user, 'role', None) == 'patient':
            return VisitNote.objects.filter(patient=user).order_by('-created_at')
        return VisitNote.objects.filter(
            Q(doctor=user) | Q(patient=user)
        ).order_by('-created_at')

    def perform_create(self, serializer):
        user = self.request.user
        if getattr(user, 'role', None) != 'doctor':
            raise PermissionDenied('Only doctors may create visit notes.')
        appointment = serializer.validated_data.get('appointment')
        if appointment is not None and appointment.doctor_id != user.id:
            raise PermissionDenied('You may only write notes for your own appointments.')
        serializer.save(doctor=user, patient=appointment.patient if appointment else None)

    def perform_update(self, serializer):
        user = self.request.user
        instance = self.get_object()
        if instance.doctor_id != user.id:
            raise PermissionDenied('You may only edit your own visit notes.')
        serializer.save()


class PrescriptionViewSet(AccessMixin, viewsets.ModelViewSet):
    access_model = 'Prescription'
    serializer_class = PrescriptionSerializer
    permission_classes = [AccessPermission]
    filterset_fields = ['appointment', 'doctor', 'patient']
    search_fields = ['medication', 'dosage', 'instructions']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Prescription.objects.none()
        if getattr(user, 'role', None) == 'doctor':
            return Prescription.objects.filter(
                Q(doctor=user) | Q(patient=user)
            ).order_by('-created_at')
        if getattr(user, 'role', None) == 'patient':
            return Prescription.objects.filter(patient=user).order_by('-created_at')
        return Prescription.objects.filter(
            Q(doctor=user) | Q(patient=user)
        ).order_by('-created_at')

    def perform_create(self, serializer):
        user = self.request.user
        if getattr(user, 'role', None) != 'doctor':
            raise PermissionDenied('Only doctors may create prescriptions.')
        appointment = serializer.validated_data.get('appointment')
        if appointment is not None and appointment.doctor_id != user.id:
            raise PermissionDenied('You may only prescribe for your own appointments.')
        serializer.save(doctor=user, patient=appointment.patient if appointment else None)

    def perform_update(self, serializer):
        user = self.request.user
        instance = self.get_object()
        if instance.doctor_id != user.id:
            raise PermissionDenied('You may only edit your own prescriptions.')
        serializer.save()