"use client";
import { Toaster } from "./ui/toaster";

export default function ToastProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Toaster />
			{children}
		</>
	);
}
