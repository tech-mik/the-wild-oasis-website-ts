import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { createGuest, getGuest } from './lib/data-service'
import { NextAuthConfig } from 'next-auth'

const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user
    },
    async signIn({ user, account, profile }) {
      if (!user) return false
      if (!user?.email || !user?.name) return false

      try {
        const existingGuest = await getGuest(user.email)
        if (!existingGuest) {
          await createGuest({
            email: user.email,
            fullName: user.name,
          })
        }

        return true
      } catch (error) {
        return false
      }
    },
    async session({ session, token }) {
      const guest = await getGuest(session.user.email)

      if (!guest) {
        throw new Error('Guest not found')
      }
      session.user.guestId = guest.id

      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the signout page if there's an error with the guest
      if (url.includes('/auth/error')) {
        return `${baseUrl}/api/auth/signout`
      }
      return baseUrl
    },
  },
  pages: {
    signIn: '/login',
  },
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig)
