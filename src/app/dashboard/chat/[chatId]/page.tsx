import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from "@/components/SideBar";
import MessagingInterface from "@/components/MessagingInterface";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import FriendDeleteButton from "@/components/FriendDeleteButton";

interface PageProps {
	params: {
		chatId: string;
	};
}

export default async function Page({ params }: PageProps) {
	const { chatId } = params;
	const session = await getServerSession(authOptions);
	if (!session) return notFound();
	const user = session.user;
	const [userId1, userId2] = chatId.split("--");

	if (user.id !== userId1 && user.id !== userId2) return notFound();

	const anotherUserId = user.id === userId1 ? userId2 : userId1;
	const anotherUser: User = (await prisma.user.findUnique({
		where: {
			id: anotherUserId,
		},
	}))!;

	const chat = await prisma.chat.findFirst({
		where: {
			user1Id: userId1,
			user2Id: userId2,
		},
		select: {
			messages: true,
		},
	});

	return (
		<div className="flex flex-col flex-1">
			<header className="bg-foreground text-primary-foreground py-4 px-6 flex items-center justify-between">
				<Sidebar session={session} />
				<div className="flex md:flex-row flex-col items-center justify-center gap-3">
					<Avatar className="w-8 h-8">
						<AvatarImage src="/" />
						<AvatarFallback className="text-foreground">
							{anotherUser?.name![0].toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className="font-medium">{anotherUser?.name!}</div>
					</div>
				</div>
				<div>{/* <FriendDeleteButton id={anotherUserId} /> */}</div>
			</header>
			<MessagingInterface
				session={session}
				chatId={chatId}
				prevMessages={chat?.messages ? chat?.messages : []}
				anotherUser={anotherUser}
			/>
		</div>
	);
}
