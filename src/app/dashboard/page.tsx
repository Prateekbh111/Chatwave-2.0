import Sidebar from "@/components/SideBar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { notFound } from "next/navigation";

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session) notFound();

	// keepTheme();
	return (
		<div className="flex flex-col flex-1">
			<header className="bg-foreground text-primary-foreground py-4 px-6 flex items-center justify-between">
				<Sidebar session={session} />
			</header>
			<div className="flex flex-1 justify-center items-center p-6">
				<h1 className="text-3xl font-bold text-black dark:text-white">
					No chats to show here
				</h1>
			</div>
		</div>
	);
}
