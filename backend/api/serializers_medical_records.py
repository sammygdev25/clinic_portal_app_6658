from rest_framework import serializers
from api.models import VisitNote, Prescription, Appointment, PatientProfile, DoctorProfile
from api.picture_field import PictureField, StoredFileField


class AppointmentSerializer(serializers.ModelSerializer):
    patient_username = serializers.CharField(source='patient.username', read_only=True)
    doctor_username = serializers.CharField(source='doctor.username', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'doctor', 'patient_username', 'doctor_username',
            'scheduled_at', 'status', 'reason', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PatientProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = PatientProfile
        fields = [
            'id', 'user', 'username', 'email', 'date_of_birth', 'phone',
            'address', 'insurance_provider', 'insurance_policy_number',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DoctorProfileSerializer(serializers.ModelSerializer):
    photo = PictureField(required=False)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = DoctorProfile
        fields = [
            'id', 'user', 'username', 'specialty', 'bio', 'photo',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class VisitNoteSerializer(serializers.ModelSerializer):
    doctor_username = serializers.CharField(source='doctor.username', read_only=True)
    patient_username = serializers.CharField(source='patient.username', read_only=True)
    doctor_specialty = serializers.CharField(source='doctor.doctor_profile.specialty', read_only=True, default='')

    class Meta:
        model = VisitNote
        fields = [
            'id', 'appointment', 'doctor', 'patient', 'doctor_username',
            'patient_username', 'doctor_specialty', 'content',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'doctor', 'patient', 'created_at', 'updated_at']

    def create(self, validated_data):
        appointment = validated_data['appointment']
        validated_data['doctor'] = appointment.doctor
        validated_data['patient'] = appointment.patient
        return super().create(validated_data)


class PrescriptionSerializer(serializers.ModelSerializer):
    doctor_username = serializers.CharField(source='doctor.username', read_only=True)
    patient_username = serializers.CharField(source='patient.username', read_only=True)

    class Meta:
        model = Prescription
        fields = [
            'id', 'appointment', 'doctor', 'patient', 'doctor_username',
            'patient_username', 'medication', 'dosage', 'instructions',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'doctor', 'patient', 'created_at', 'updated_at']

    def create(self, validated_data):
        appointment = validated_data['appointment']
        validated_data['doctor'] = appointment.doctor
        validated_data['patient'] = appointment.patient
        return super().create(validated_data)