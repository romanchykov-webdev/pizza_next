import { getUserSession } from "@/lib/get-user-session";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

interface Props {
	className?: string;
}

export default async function ProfilePage({ className }: Props) {
	//
	const session = await getUserSession();

	if (!session) {
		return redirect("/not-auth");
	}

	//
	return <div className={cn("", className)}>Your profile ${session.name}</div>;
}
