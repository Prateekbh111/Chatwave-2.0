"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => signOut({ callbackUrl: "/login" })}
			className="dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white"
		>
			<LogOut />
			<span className="sr-only">Logout</span>
		</Button>
	);
}
