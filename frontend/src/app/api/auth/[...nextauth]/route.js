import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Keycloak',
      credentials: {
        username: { label: 'Usuário', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const tokenUrl = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`

        const params = new URLSearchParams({
          grant_type: 'password',
          client_id: process.env.KEYCLOAK_CLIENT_ID,
          username: credentials.username,
          password: credentials.password,
          scope: 'openid profile email',
        })
        if (process.env.KEYCLOAK_CLIENT_SECRET) {
          params.set('client_secret', process.env.KEYCLOAK_CLIENT_SECRET)
        }

        const res = await fetch(tokenUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params,
        })

        if (!res.ok) return null

        const tokens = await res.json()

        const payload = JSON.parse(
          Buffer.from(tokens.access_token.split('.')[1], 'base64url').toString()
        )

        return {
          id: payload.sub,
          name: payload.name || payload.preferred_username,
          email: payload.email,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
