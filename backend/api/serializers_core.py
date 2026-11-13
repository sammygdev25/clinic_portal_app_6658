from django.contrib.auth import get_user_model
from rest_framework import serializers
from api.models import DoctorProfile, PatientProfile, Service, ClinicHour
from api.picture_field import PictureField

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']
        read_only_fields = ['id', 'role']


class DoctorProfileSerializer(serializers.ModelSerializer):
    photo = PictureField(required=False)
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = DoctorProfile
        fields = [
            'id', 'user', 'username', 'first_name', 'last_name', 'email',
            'specialty', 'bio', 'photo', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PatientProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = PatientProfile
        fields = [
            'id', 'user', 'username', 'first_name', 'last_name', 'email',
            'date_of_birth', 'phone', 'address', 'insurance_provider',
            'insurance_policy_number', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ClinicHourSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicHour
        fields = [
            'id', 'day_of_week', 'open_time', 'close_time',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']