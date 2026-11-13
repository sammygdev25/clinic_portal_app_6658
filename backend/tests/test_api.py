import pytest

pytestmark = pytest.mark.django_db


class TestDoctorProfileViewSet:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/doctors/")
        assert response.status_code == 200
    def test_create_unauthenticated(self, api_client):
        response = api_client.post("/api/api/doctors/", {})
        assert response.status_code in (400, 401, 403)


class TestPatientProfileViewSet:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/patients/")
        assert response.status_code == 200
    def test_create_unauthenticated(self, api_client):
        response = api_client.post("/api/api/patients/", {})
        assert response.status_code in (400, 401, 403)


class TestServiceViewSet:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/services/")
        assert response.status_code == 200
    def test_create_unauthenticated(self, api_client):
        response = api_client.post("/api/api/services/", {})
        assert response.status_code in (400, 401, 403)


class TestClinicHourViewSet:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/clinic-hours/")
        assert response.status_code == 200
    def test_create_unauthenticated(self, api_client):
        response = api_client.post("/api/api/clinic-hours/", {})
        assert response.status_code in (400, 401, 403)


class TestAppointmentViewSet:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/appointments/")
        assert response.status_code == 200
    def test_create_unauthenticated(self, api_client):
        response = api_client.post("/api/api/appointments/", {})
        assert response.status_code in (400, 401, 403)


class TestVisitNoteViewSet:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/visit-notes/")
        assert response.status_code == 200
    def test_create_unauthenticated(self, api_client):
        response = api_client.post("/api/api/visit-notes/", {})
        assert response.status_code in (400, 401, 403)


class TestPrescriptionViewSet:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/prescriptions/")
        assert response.status_code == 200
    def test_create_unauthenticated(self, api_client):
        response = api_client.post("/api/api/prescriptions/", {})
        assert response.status_code in (400, 401, 403)


class TestBillViewSet:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/bills/")
        assert response.status_code == 200
    def test_create_unauthenticated(self, api_client):
        response = api_client.post("/api/api/bills/", {})
        assert response.status_code in (400, 401, 403)


class TestDocumentViewSet:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/documents/")
        assert response.status_code == 200
    def test_create_unauthenticated(self, api_client):
        response = api_client.post("/api/api/documents/", {})
        assert response.status_code in (400, 401, 403)
