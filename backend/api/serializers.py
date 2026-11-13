"""Serializers aggregator — explicit imports from domain files."""
from .serializers_auth import LoginSerializer, RegisterSerializer, UserSerializer  # noqa: F401
from .serializers_billing import AppointmentBriefSerializer, BillSerializer  # noqa: F401
from .serializers_core import ClinicHourSerializer, DoctorProfileSerializer, PatientProfileSerializer, ServiceSerializer  # noqa: F401
from .serializers_documents import DocumentSerializer  # noqa: F401
from .serializers_medical_records import AppointmentSerializer, PrescriptionSerializer, VisitNoteSerializer  # noqa: F401
