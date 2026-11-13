from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q

from api.models import Appointment
from api.serializers_scheduling import AppointmentSerializer
from api.access import AccessMixin, AccessPermission  # Shikshya's access table


class AppointmentViewSet(AccessMixin, viewsets.ModelViewSet):
    access_model = 'Appointment'
    queryset = Appointment.objects.all().order_by('-scheduled_at')
    serializer_class = AppointmentSerializer
    permission_classes = [AccessPermission]
    filterset_fields = ['patient', 'doctor', 'status']
    search_fields = ['reason', 'status']
    ordering_fields = ['scheduled_at', 'created_at', 'status']

    def get_queryset(self):
        queryset = Appointment.objects.all().order_by('-scheduled_at')
        user = self.request.user
        if not user.is_authenticated:
            return queryset.none()

        role = getattr(user, 'role', '')
        if role == 'doctor':
            queryset = queryset.filter(doctor=user)
        elif role == 'patient':
            queryset = queryset.filter(patient=user)
        # receptionist / staff / admin see everything

        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        date_param = self.request.query_params.get('date')
        if date_param:
            queryset = queryset.filter(scheduled_at__date=date_param)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        role = getattr(user, 'role', '')
        if role == 'patient':
            serializer.save(patient=user)
        else:
            serializer.save()

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'confirmed'
        appointment.save()
        return Response(AppointmentSerializer(appointment).data)

    @action(detail=True, methods=['post'])
    def check_in(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'checked_in'
        appointment.save()
        return Response(AppointmentSerializer(appointment).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'completed'
        appointment.save()
        return Response(AppointmentSerializer(appointment).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'cancelled'
        appointment.save()
        return Response(AppointmentSerializer(appointment).data)

    @action(detail=True, methods=['post'])
    def reschedule(self, request, pk=None):
        appointment = self.get_object()
        scheduled_at = request.data.get('scheduled_at')
        if not scheduled_at:
            return Response(
                {'detail': 'scheduled_at is required.'},
                status=400
            )
        appointment.scheduled_at = scheduled_at
        appointment.status = 'requested'
        appointment.save()
        return Response(AppointmentSerializer(appointment).data)

    @action(detail=False, methods=['get'])
    def today(self, request):
        from django.utils import timezone
        today = timezone.localdate()
        queryset = self.get_queryset().filter(scheduled_at__date=today)
        serializer = AppointmentSerializer(queryset, many=True)
        return Response(serializer.data)