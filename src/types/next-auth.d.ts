// import "next-auth";
// import { DefaultSession } from "next-auth";

// declare module "next-auth" {
// 	interface User {
// 		id?: string;
// 	}
// 	interface Session {
// 		user: {
// 			id?: string;
// 		} & DefaultSession["user"];
// 	}
// }

// declare module "next-auth/jwt" {
// 	interface JWT {
// 		id?: string;
// 	}
// }

import NextAuth from "next-auth";
import { User } from "@prisma/client";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			id?: string;
		} & User;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id?: string;
	}
}
