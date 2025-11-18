export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("chuno_token");
    localStorage.removeItem("chuno_roles");
    localStorage.removeItem("chuno_email");
  }
}
