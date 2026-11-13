// Who counts as staff on this app's pages, from the plan like backend/api/permissions.py (generated). Hiding a
// page is for the person using the app; the server checks staff on every request.
export const STAFF_ROLES: readonly string[] = ["doctor", "receptionist"];

export function homeFor(_role: string | null | undefined): string {
  return '/';
}
