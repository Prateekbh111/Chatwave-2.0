"use client";

import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { Session } from "next-auth";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

export default function MessagingInterface({
	session,
	chatId,
	prevMessages,
	anotherUser,
}: {
	session: Session;
	chatId: string;
	prevMessages: Message[];
	anotherUser: User;
}) {
	const chatRef = useRef<HTMLDivElement>(null);
	const [messages, setMessages] = useState<Message[]>(prevMessages);
	const [inputMessage, setInputMessage] = useState("");

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [messages]);

	useEffect(() => {
		pusherClient.subscribe(toPusherKey(`chat:${chatId}:messages`));

		const messageHandler = (data: Message) => {
			if (data.senderId !== session.user.id) {
				setMessages((prevMessage) => [...prevMessage, data]);
			}
		};

		pusherClient.bind(`messages`, messageHandler);

		return () => {
			pusherClient.unsubscribe(toPusherKey(`chat:${chatId}:messages`));

			pusherClient.unbind(`messages`);
		};
	}, []);

	async function sendMessage() {
		if (inputMessage.trim() === "") return;

		try {
			console.log("Sending message");
			setMessages([
				...messages,
				{
					id: (messages.length + 1).toString(),
					senderId: session?.user.id!,
					message: inputMessage,
					timestamp: Date.now(),
				},
			]);
			setInputMessage("");

			await axios.post<ApiResponse>("/api/sendMessage", {
				message: inputMessage,
				chatId,
			});
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			console.log(axiosError);
		}
	}

	return (
		<>
			<div className="flex-1 overflow-auto p-6 space-y-4" ref={chatRef}>
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex items-start gap-4 mb-1 ${
							message.senderId === session.user.id && "flex-row-reverse"
						}`}
					>
						<Avatar className="w-8 h-8">
							<AvatarImage src="/" />
							<AvatarFallback>
								{message.senderId === session.user.id
									? session.user.name![0].toUpperCase()
									: anotherUser.name![0].toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div
							className={`rounded-lg p-4 max-w-[70%] ${
								message.senderId === session.user.id
									? "bg-foreground text-primary-foreground"
									: "bg-muted"
							}`}
						>
							<p>{message.message}</p>
							<div className="text-xs text-muted-foreground mt-2">
								{new Date(message.timestamp).toLocaleTimeString([], {
									hour: "numeric",
									minute: "2-digit",
								})}
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="bg-background border-t border-border px-6 py-4 flex items-center gap-2">
				<Textarea
					onChange={(e) =>
						setInputMessage((e.target as HTMLTextAreaElement).value)
					}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							sendMessage();
						}
					}}
					value={inputMessage}
					placeholder="Type your message..."
					className="flex-1 resize-none rounded-lg border border-input bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
				/>
				<Button type="submit" onClick={sendMessage}>
					<Send />
					<span className="sr-only">Send</span>
				</Button>
			</div>
		</>
	);
}
