"use client";
import { Check, Clock2, LoaderCircle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import { Session } from "next-auth";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export default function PendingRequests({
	friendRequests,
	session,
}: {
	friendRequests: FriendRequest[];
	session: Session;
}) {
	const { toast } = useToast();
	const [UserFriendRequests, setUserFriendRequests] =
		useState<FriendRequest[]>(friendRequests);
	const [isDenying, setIsDenying] = useState<boolean>(false);
	const [isAccepting, setIsAccepting] = useState<boolean>(false);

	useEffect(() => {
		pusherClient.subscribe(
			toPusherKey(`user:${session.user.id}:friendRequests`)
		);

		const friendRequestHandler = (data: FriendRequest) => {
			console.log("new friend request");
			console.log(data);
			setUserFriendRequests((prevFriendRequest) => [
				...prevFriendRequest,
				data,
			]);
		};
		pusherClient.bind("friendRequests", friendRequestHandler);

		return () => {
			pusherClient.unsubscribe(
				toPusherKey(`user:${session?.user.id}:friendRequests`)
			);

			pusherClient.unbind("friendRequests");
		};
	}, []);

	const handleAcceptRequest = async (requestId: string) => {
		try {
			setIsAccepting(true);

			const response = await axios.post<ApiResponse>(
				"/api/acceptFriendRequest",
				{
					requestId,
				}
			);

			toast({
				title: "Success",
				description: `${response.data.message}`,
			});
			setUserFriendRequests((prevRequests) =>
				prevRequests.filter((request) => request.senderId !== requestId)
			);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request.",
			});
		} finally {
			setIsAccepting(false);
		}
	};

	const handleRejectRequest = async (requestId: string) => {
		try {
			setIsDenying(true);

			const response = await axios.post<ApiResponse>(
				"/api/rejectFriendRequest",
				{
					requestId,
				}
			);
			toast({
				title: "Success",
				description: `${response.data.message}`,
			});
			setUserFriendRequests((prevRequests) =>
				prevRequests.filter((request) => request.senderId !== requestId)
			);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request.",
			});
		} finally {
			setIsDenying(false);
		}
	};

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<div className="flex justify-between items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
					<div className="flex">
						<Clock2 className="h-5 w-5 mr-2" />
						Pending Requests
					</div>
					{UserFriendRequests.length !== 0 && (
						<span className="ml-2 relative flex h-3 w-3">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75"></span>
							<span className="relative inline-flex rounded-full h-3 w-3 bg-foreground"></span>
						</span>
					)}
				</div>
			</DrawerTrigger>
			<DrawerContent className="dark:bg-black">
				<DrawerTitle></DrawerTitle>
				<div className="mx-auto w-full flex justify-center p-4">
					{UserFriendRequests.length === 0 ? (
						<p>No friend requests</p>
					) : (
						<ScrollArea className="h-72 max-w-xl w-full ">
							<ul className="w-full  flex flex-col space-y-1.5 p-6">
								{UserFriendRequests.map((friendRequest) => (
									<li
										key={friendRequest.senderId}
										className="md:flex justify-between items-center p-4 space-y-2 bg-card rounded-lg border "
									>
										<div>
											<p className="text-2xl font-semibold leading-none tracking-tight">
												{friendRequest.senderName}
											</p>
											<p className="text-sm text-muted-foreground">
												{friendRequest.senderEmail}
											</p>
										</div>
										<div className="flex space-x-4">
											<Button
												onClick={() =>
													handleAcceptRequest(friendRequest.senderId)
												}
											>
												{isAccepting ? (
													<>
														<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />{" "}
														Accepting...
													</>
												) : (
													<Check />
												)}
											</Button>
											<Button
												onClick={() =>
													handleRejectRequest(friendRequest.senderId)
												}
											>
												{isDenying ? (
													<>
														<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />{" "}
														Rejecting...
													</>
												) : (
													<X />
												)}
											</Button>
										</div>
									</li>
								))}
							</ul>
						</ScrollArea>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
