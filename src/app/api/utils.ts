
export function isHttpError(error: unknown) {
  return typeof error === "object" && error !== null && "status" in error;
}