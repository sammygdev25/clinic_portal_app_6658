from rest_framework import serializers

from api.models import Bill, Appointment


class AppointmentBriefSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.username', read_only=True)
    doctor_name = serializers.CharField(source='doctor.username', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'doctor', 'patient_name', 'doctor_name',
            'scheduled_at', 'status', 'reason',
        ]
        read_only_fields = fields


class BillSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.username', read_only=True)
    appointment_detail = AppointmentBriefSerializer(source='appointment', read_only=True)

    class Meta:
        model = Bill
        fields = [
            'id', 'patient', 'patient_name', 'appointment', 'appointment_detail',
            'amount', 'status', 'due_date', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'patient_name', 'appointment_detail', 'created_at', 'updated_at']