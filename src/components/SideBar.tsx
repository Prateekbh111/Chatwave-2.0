import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import LogoutButton from "./LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import PendingRequests from "./PendingRequests";
import AddFriend from "./AddFriend";
import { redisClient } from "@/lib/redis";
import FriendsList from "./FriendsList";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Session } from "next-auth";

export default async function Sidebar({ session }: { session: Session }) {
	const friendRequests = await redisClient.smembers<FriendRequest[]>(
		`user:${session?.user.id}:friendRequests`
	);

	const friends: Friend[] = await redisClient.smembers(
		`user:${session!.user.id}:friends`
	);

	return (
		<Sheet>
			<SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
				<Menu />
				<span className="sr-only">Menu</span>
			</SheetTrigger>
			<SheetContent side={"left"} className="w-64 h-full">
				<SheetTitle></SheetTitle>
				<div className="bg-background border-r p-6 flex flex-col justify-between h-full w-full">
					<div>
						<div className="flex items-center gap-3 mb-6">
							<Avatar className="w-10 h-10">
								{/* <AvatarImage src={session?.user.image!} /> */}
								<AvatarFallback>{session?.user.name![0]}</AvatarFallback>
							</Avatar>
							<div>
								<div className="font-medium">{session?.user.name}</div>
								<div className="text-sm text-muted-foreground">Online</div>
							</div>
						</div>
						<nav className="space-y-2">
							<AddFriend />
							<PendingRequests
								friendRequests={friendRequests}
								session={session!}
							/>

							<FriendsList friends={friends} session={session!} />
						</nav>
					</div>
					<div className="flex items-center gap-2">
						<LogoutButton />
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
