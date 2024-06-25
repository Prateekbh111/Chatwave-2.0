import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="flex flex-col flex-1">
			<div className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Skeleton className="w-9 h-9" />
				</div>
				<div className="flex items-center gap-3">
					<Skeleton className="w-8 h-8 rounded-full" />
					<Skeleton className="h-4 w-20" />
				</div>
				<div className="flex items-center gap-4">
					<Skeleton className="w-9 h-9" />
				</div>
			</div>
			<div className="flex-1 overflow-auto p-6 space-y-4">
				<div className="flex items-start gap-4">
					<Skeleton className="w-8 h-8 rounded-full" />
					<div className="bg-muted rounded-lg p-4 max-w-[70%]">
						<Skeleton className="h-4 w-40" />
					</div>
				</div>
				<div className="flex items-start gap-4 justify-end">
					<div className="bg-primary rounded-lg p-4 text-primary-foreground max-w-[70%]">
						<Skeleton className="h-4 w-40" />
					</div>
					<Skeleton className="w-8 h-8 rounded-full" />
				</div>
				<div className="flex items-start gap-4">
					<Skeleton className="w-8 h-8 rounded-full" />
					<div className="bg-muted rounded-lg p-4 max-w-[70%]">
						<Skeleton className="h-4 w-80" />
						<Skeleton className="h-4 w-60 mt-2" />
					</div>
				</div>
				<div className="flex items-start gap-4 justify-end">
					<div className="bg-primary rounded-lg p-4 text-primary-foreground max-w-[70%]">
						<Skeleton className="h-4 w-40" />
					</div>
					<Skeleton className="w-8 h-8 rounded-full" />
				</div>
			</div>
			<div className="bg-background border-t border-border px-6 py-4 flex items-center gap-2">
				<Skeleton className="h-20 w-full" />
				<Skeleton className="w-10 h-10" />
			</div>
		</div>
	);
}
