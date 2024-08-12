import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { fetchRedis, redisClient } from "@/lib/redis";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import prisma from "@/lib/prisma";

export async function POST(req: Request, res: Response) {
	const { friendEmail } = await req.json();
	const session = await getServerSession(authOptions);

	if (!session) {
		return Response.json(
			{ success: false, message: "Not Authorized" },
			{ status: 401 }
		);
	}

	//TODO: delete this three line
	const userEmail = session?.user.email;
	console.log("user Email: ", userEmail);
	console.log("friend Email", friendEmail);

	console.log("userId: ", session.user.id);

	if (userEmail === friendEmail) {
		return Response.json(
			{ success: false, message: "Can't send request to yourself." },
			{ status: 400 }
		);
	}

	const userData: FriendRequest = {
		senderId: session.user.id!,
		senderName: session.user.name!,
		senderEmail: session.user.email!,
		senderImage: session.user.image!,
	};

	const userToAdd = await prisma.user.findUnique({
		where: {
			email: friendEmail,
		},
		select: {
			id: true,
		},
	});

	const idToAdd = userToAdd?.id;

	console.log("idToAdd: ", idToAdd);
	if (!idToAdd) {
		return Response.json(
			{ success: false, message: "User with this email does not exits." },
			{ status: 400 }
		);
	}

	const isAlreadyFriendRequested = await prisma.friendRequest.findFirst({
		where: {
			senderId: session.user.id,
			receiverId: idToAdd,
		},
	});

	console.log("isAlreadyFriendRequested: ", isAlreadyFriendRequested);
	if (isAlreadyFriendRequested) {
		return Response.json(
			{ success: false, message: "Already Requested." },
			{ status: 400 }
		);
	}

	const isAlreadyFriend = await prisma.friends.findFirst({
		where: {
			friendOfId: session.user.id,
			friendId: idToAdd,
		},
	});

	console.log("isAlreadyFriend: ", isAlreadyFriend);
	if (isAlreadyFriend) {
		return Response.json(
			{ success: false, message: "Already Friends." },
			{ status: 400 }
		);
	}

	//send friend request
	// await pusherServer.trigger(
	// 	toPusherKey(`user:${idToAdd}:friendRequests`),
	// 	"friendRequests",
	// 	userData
	// );

	await prisma.friendRequest.create({
		data: {
			senderId: session.user.id,
			receiverId: idToAdd,
		},
	});

	return Response.json(
		{
			success: true,
			message: "Friend request sent.",
		},
		{
			status: 200,
		}
	);
}
