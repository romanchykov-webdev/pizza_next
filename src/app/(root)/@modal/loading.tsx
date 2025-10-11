import { Loader2 } from "lucide-react";

export default function LoadingAnyModal() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			{/* <div className="rounded-xl bg-white/80 px-4 py-3 text-sm font-medium">Загрузка…</div> */}
			<Loader2 className="text-yellow-500 animate-spin" size={50} />
		</div>
	);
}
