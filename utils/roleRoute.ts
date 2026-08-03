export const roleRoute = (role: string) => {
  return role === "admin" ? "/admin-dashboard" : "/dashboard";
}