interface User {
	name: string;
	email: string;
	image: string;
	id: string;
}

interface FriendRequest {
	senderId: string;
	senderName: string;
	senderEmail: string;
	senderImage: string;
}
interface Friend {
	id: string;
	name: string;
	email: string;
	image: string;
}

interface Message {
	id: string;
	senderId: string;
	message: string;
	timestamp: number;
}
