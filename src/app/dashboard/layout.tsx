import Sidebar from "@/components/SideBar";

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen">
			{/* <Sidebar /> */}
			{children}
		</div>
	);
}
