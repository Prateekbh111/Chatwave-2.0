"use client";
import { Button } from "@/components/ui/button";
import { Chrome, Waves } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Page() {
	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br dark:from-black dark:to-neutral-950 from-white to-neutral-200">
			<header className="mb-8 text-center">
				<div className="flex items-center justify-center">
					<Waves className="h-10 w-10 mr-2 dark:text-white text-black" />
					<h1 className="text-3xl font-bold text-black dark:text-white">
						Chatwave
					</h1>
				</div>
				<p className="text-lg text-black dark:text-white">
					Riding the wave of conversation
				</p>
			</header>
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
				<div className="bg-black dark:bg-white p-8 rounded-lg shadow-lg">
					<h2 className="text-2xl font-bold mb-4 text-white dark:text-black">
						Sign In
					</h2>
					<Button
						variant="outline"
						className="w-full"
						onClick={() => signIn("google", { callbackUrl: "/dashboard/" })}
					>
						<Chrome className="mr-2 h-4 w-4" />
						Sign In with Google
					</Button>
				</div>
				<div className="bg-black dark:bg-white p-8 rounded-lg shadow-lg">
					<h2 className="text-2xl font-bold mb-4 text-white dark:text-black">
						Sign Up
					</h2>
					<Button
						variant="outline"
						className="w-full"
						onClick={() => signIn("google", { callbackUrl: "/dashboard/" })}
					>
						<Chrome className="mr-2 h-4 w-4" />
						Sign Up with Google
					</Button>
				</div>
			</div>
		</div>
	);
}
