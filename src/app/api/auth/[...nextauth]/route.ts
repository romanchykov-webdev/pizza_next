import { compare } from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "../../../../../prisma/prisma-client";

//
export const authOptions = {
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_ID || "",
			clientSecret: process.env.GITHUB_SECRET || "",
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				// если credentials нет, то возвращаем null
				if (!credentials) {
					return null;
				}

				// создаем значение для поиска пользователя
				const value = {
					email: credentials.email,
				};

				// ищем пользователя в базе данных
				const findUser = await prisma.user.findFirst({
					where: value,
				});

				// если пользователь не найден, то возвращаем null
				if (!findUser) {
					return null;
				}

				// проверяем пароль
				const isPasswordValid = await compare(credentials.password, findUser.password);

				// если пароль не валид, то возвращаем null
				if (!isPasswordValid) {
					return null;
				}

				// если пользователь не верифицирован, то возвращаем null
				if (!findUser.verified) {
					return null;
				}

				//
				return {
					id: String(findUser.id),
					email: findUser.email,
					name: findUser.fullName,
					role: findUser.role,
				};
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token }) {
			//
			const findUser = await prisma.user.findFirst({
				where: { email: token.email },
			});

			//
			if (findUser) {
				token.id = String(findUser.id);
				token.email = findUser.email;
				token.fullName = findUser.fullName;
				token.role = findUser.role;
			}
			return token;
		},

		//
		session({ session, token }) {
			//
			if (session?.user) {
				session.user.id = token.id;
				session.user.role = token.role;
			}
			return session;
		},
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
