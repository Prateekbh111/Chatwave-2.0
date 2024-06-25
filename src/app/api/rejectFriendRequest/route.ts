import { redisClient } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request, res: Response) {
	const session = await getServerSession(authOptions);
	const { requestId } = await req.json();

	if (!session?.user) {
		return Response.json(
			{ success: false, message: "UNAUTHORIZED" },
			{ status: 402 }
		);
	}

	try {
		const requestUserDatajson = await redisClient.get<User>(
			`user:${requestId}`
		);
		const requestUserData: FriendRequest = {
			senderId: requestUserDatajson!.id,
			senderName: requestUserDatajson!.name,
			senderEmail: requestUserDatajson!.email,
			senderImage: requestUserDatajson!.image,
		};

		console.log(session.user.id);
		const numberOfEntryRemoved = await redisClient.srem(
			`user:${session.user.id}:friendRequests`,
			requestUserData
		);
		if (numberOfEntryRemoved == 0) {
			return Response.json(
				{ success: false, message: "Internal Server Error" },
				{ status: 500 }
			);
		}
		return Response.json(
			{ success: true, message: "Friend Request Denied" },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{ success: true, message: "Friend Request Denied" },
			{ status: 200 }
		);
	}
}
