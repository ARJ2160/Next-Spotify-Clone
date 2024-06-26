import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { LOGIN_URL } from '../../../lib/spotify';
import spotifyApi from '../../../lib/spotify';

const refreshAcessToken = async (token: any) => {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);
    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: 'RefreshTokenError',
    };
  }
};

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }: any) {
      // Initial Sign In
      if (account && user) {
        return {
          ...token,
          accessToken: account?.access_token,
          refreshToken: account?.refresh_token,
          username: account?.providerAccountId,
          accessTokenExpires: account?.expires_at! * 1000, // handle expire time in milliseconds
        };
      }
      // Return the previous token if access toke has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log('Existing token is still valid');
        return token;
      }
      // If access token has expired, refresh it
      if (Date.now() > token.accessTokenExpires) {
        console.log('Access token Expired');
        return await refreshAcessToken(token);
      }
    },
    async session({ session, token }: any) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
});
