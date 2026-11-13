from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from api.models import Bill
from api.serializers_billing import BillSerializer
from api.access import AccessMixin, AccessPermission  # Shikshya's access table


class BillViewSet(AccessMixin, viewsets.ModelViewSet):
    access_model = 'Bill'
    queryset = Bill.objects.all().order_by('-created_at')
    serializer_class = BillSerializer
    permission_classes = [AccessPermission]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['patient', 'appointment', 'status']
    search_fields = ['status']
    ordering_fields = ['created_at', 'due_date', 'amount']

    def get_queryset(self):
        qs = Bill.objects.all().order_by('-created_at')
        user = self.request.user
        if not user.is_authenticated:
            return qs.none()
        if getattr(user, 'role', None) == 'patient':
            return qs.filter(patient=user)
        return qs

    def perform_create(self, serializer):
        serializer.save()