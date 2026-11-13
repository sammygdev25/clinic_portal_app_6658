from rest_framework import serializers
from api.models import Document
from api.picture_field import PictureField, StoredFileField


class DocumentSerializer(serializers.ModelSerializer):
    file = StoredFileField(required=False)
    patient_name = serializers.CharField(source='patient.username', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)

    class Meta:
        model = Document
        fields = [
            'id',
            'patient',
            'uploaded_by',
            'patient_name',
            'uploaded_by_name',
            'doc_type',
            'file',
            'uploaded_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'uploaded_by', 'uploaded_at', 'updated_at']