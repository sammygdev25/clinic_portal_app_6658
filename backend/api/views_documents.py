from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from api.models import Document
from api.serializers_documents import DocumentSerializer
from api.access import AccessMixin, AccessPermission  # Shikshya's access table


class DocumentViewSet(AccessMixin, viewsets.ModelViewSet):
    access_model = 'Document'
    queryset = Document.objects.all().order_by('-uploaded_at')
    serializer_class = DocumentSerializer
    permission_classes = [AccessPermission]
    filterset_fields = ['patient', 'uploaded_by', 'doc_type']
    search_fields = ['doc_type']
    ordering_fields = ['uploaded_at', 'updated_at']

    def get_queryset(self):
        queryset = Document.objects.all().order_by('-uploaded_at')
        user = self.request.user
        if not user.is_authenticated:
            return queryset.none()
        role = getattr(user, 'role', None)
        if role == 'patient':
            return queryset.filter(patient=user)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        role = getattr(user, 'role', None)
        if role == 'patient':
            serializer.save(patient=user, uploaded_by=user)
        else:
            serializer.save(uploaded_by=user)