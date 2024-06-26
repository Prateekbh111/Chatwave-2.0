import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import ToastProvider from "@/components/ToastProvider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Chatwave",
	description: "Riding the wave of conversation",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link rel="icon" href="/wave.svg" />
			</head>
			<body className={inter.className}>
				<ToastProvider>
					<AuthProvider>{children}</AuthProvider>
				</ToastProvider>
				<Analytics />
			</body>
		</html>
	);
}
