from django.contrib.auth import get_user_model
from rest_framework import serializers
from api.models import DoctorProfile, PatientProfile, Appointment
from api.picture_field import PictureField, StoredFileField

User = get_user_model()


class DoctorProfileSerializer(serializers.ModelSerializer):
    photo = PictureField(required=False)
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = DoctorProfile
        fields = [
            'id', 'user', 'username', 'first_name', 'last_name',
            'specialty', 'bio', 'photo', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PatientProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = PatientProfile
        fields = [
            'id', 'user', 'username', 'first_name', 'last_name',
            'date_of_birth', 'phone', 'address', 'insurance_provider',
            'insurance_policy_number', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    doctor_specialty = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'doctor', 'patient_name', 'doctor_name',
            'doctor_specialty', 'scheduled_at', 'status', 'reason',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_patient_name(self, obj):
        full_name = obj.patient.get_full_name()
        return full_name if full_name else obj.patient.username

    def get_doctor_name(self, obj):
        full_name = obj.doctor.get_full_name()
        return full_name if full_name else obj.doctor.username

    def get_doctor_specialty(self, obj):
        profile = getattr(obj.doctor, 'doctor_profile', None)
        return profile.specialty if profile else ''