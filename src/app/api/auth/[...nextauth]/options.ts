import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { type AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
	session: {
		strategy: "jwt",
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			profile(profile) {
				console.log(profile);
				return {
					id: profile.sub,
					//TODO: figure out the last name coming as undefined
					name: `${profile.given_name} ${
						profile.family_name ? profile.family_name : ""
					}`,
					email: profile.email,
					image: profile.picture,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token }) {
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.sub!;
			}
			return session;
		},
	},
	pages: {
		signIn: "/sign-in",
	},

	secret: process.env.NEXTAUTH_SECRET,
};

// callbacks: {
// 	async jwt({ token, user }) {
// 		const dbUser = await redisClient.get<User>(`user:${token.id}`);
// 		if (!dbUser) {
// 			if (user) {
// 				token.id = user.id;
// 			}
// 			return token;
// 		}
// 		return {
// 			id: dbUser.id,
// 			name: dbUser.name,
// 			email: dbUser.email,
// 			picture: dbUser.image,
// 		};
// 	},
// 	async session({ session, token }) {
// 		if (token) {
// 			session.user.id = token.id;
// 		}
// 		return session;
// 	},
// },
