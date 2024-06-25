import { NextRequest, NextResponse } from "next/server";
// export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request });
	const url = request.nextUrl;
	console.log("url: ", url.pathname);
	if (token) {
		if (url.pathname.startsWith("/login") || url.pathname === "/") {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}
	if (
		!token &&
		(url.pathname.startsWith("/dashboard") || url.pathname === "/")
	) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/login", "/", "/dashboard/:path*"],
};
