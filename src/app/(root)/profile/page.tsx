import { ProfileForm } from "@/components/shared";
import { getUserSession } from "@/lib/get-user-session";
import { redirect } from "next/navigation";
import { prisma } from "../../../../prisma/prisma-client";

interface Props {
	className?: string;
}

export default async function ProfilePage({}: Props) {
	//
	const session = await getUserSession();

	if (!session) {
		return redirect("/not-auth");
	}

	const user = await prisma.user.findFirst({ where: { id: Number(session?.id) } });
	//

	if (!user) {
		return redirect("/");
	}

	return <ProfileForm data={user} />;
}
