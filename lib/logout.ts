export function clearAuthAndRedirectToLogin(router: { replace: (href: string) => void }) {
  try {
    localStorage.removeItem("auth")
  } catch {
    /* ignore */
  }
  router.replace("/")
}
