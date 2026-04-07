export function clearAuthAndRedirectToLogin(router: { replace: (href: string) => void }) {
  try {
    sessionStorage.removeItem("auth")
  } catch {
    /* ignore */
  }
  router.replace("/login")
}
