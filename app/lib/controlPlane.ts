export function getControlPlaneBaseUrl(): string {
  return process.env.CONTROL_PLANE_API_URL ?? "http://localhost:8080";
}
