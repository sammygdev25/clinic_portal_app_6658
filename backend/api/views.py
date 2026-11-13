"""Views aggregator — explicit imports from domain view files."""
from .views_auth import CustomAuthToken, LogoutAllView, LogoutView, ProfileView, RegisterView  # noqa: F401
from .views_billing import BillViewSet  # noqa: F401
from .views_core import ClinicHourViewSet, DoctorProfileViewSet, PatientProfileViewSet, ServiceViewSet  # noqa: F401
from .views_documents import DocumentViewSet  # noqa: F401
from .views_medical_records import PrescriptionViewSet, VisitNoteViewSet  # noqa: F401
from .views_scheduling import AppointmentViewSet  # noqa: F401
