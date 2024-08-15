"use client";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FriendDeleteButton({ id }: { id: string }) {
	const router = useRouter();
	async function handleDelete() {
		try {
			await axios.post<ApiResponse>("/api/deleteFriend", { id });
			router.replace("/dashboard");
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			console.log(axiosError);
		}
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className="hover:text-white hover:bg-red-700 transition-all ease-in-out">
					<Trash2 />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to delete this friend?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. Your friend will be permanently
						removed from your account.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>
						Delete Friend
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
