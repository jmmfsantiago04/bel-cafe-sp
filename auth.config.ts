import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl
      const isLoggedIn = !!auth?.user
      const isLoginPage = pathname === "/admin/login"
      const isAdminRoute = pathname.startsWith("/admin")

      if (isAdminRoute && !isLoginPage) {
        return isLoggedIn
      }

      return true
    },
  },
} satisfies NextAuthConfig
