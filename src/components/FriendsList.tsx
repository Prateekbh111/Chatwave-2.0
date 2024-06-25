"use client";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export default function FriendsList({
	friends,
	session,
}: {
	friends: Friend[];
	session: Session;
}) {
	const router = useRouter();
	const [activeUserId, setActiveUserId] = useState<string>("");
	const [userFriends, setUserFriends] = useState<Friend[]>(friends);

	function handleChatSelect(whomToChatWith: string) {
		setActiveUserId(whomToChatWith);
		const userId = session?.user.id;
		const sortedIds = [userId, whomToChatWith].sort();

		const chatId = `${sortedIds[0]}--${sortedIds[1]}`;
		router.replace(`/dashboard/chat/${chatId}`);
	}

	useEffect(() => {
		pusherClient.subscribe(toPusherKey(`user:${session.user.id}:friends`));

		const friendsHandler = (data: Friend) => {
			setUserFriends((prevFriends) => [...prevFriends, data]);
		};

		pusherClient.bind("friends", friendsHandler);

		return () => {
			pusherClient.unsubscribe(toPusherKey(`user:${session?.user.id}:friends`));

			pusherClient.unbind("friends");
		};
	}, [session]);

	return (
		<>
			<div className="flex items-center px-3 text-xs font-medium text-muted-foreground">
				<Users className="h-5 w-5 mr-2" />
				Friends
			</div>
			{userFriends.length === 0 ? (
				<p className="mx-2 p-2">No friends yet.</p>
			) : (
				<ScrollArea className="h-72 w-full ">
					<ul className="space-y-2 w-11/12">
						{userFriends.map((user) => (
							<li
								key={user.id}
								className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
									activeUserId === user.id && "bg-accent text-accent-foreground"
								}`}
								onClick={() => handleChatSelect(user.id)}
							>
								<Avatar className="w-6 h-6">
									<AvatarImage src="/" />
									<AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
								</Avatar>
								{user.name}
							</li>
						))}
					</ul>
				</ScrollArea>
			)}
		</>
	);
}
