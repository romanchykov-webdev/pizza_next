import { NextRequest, NextResponse } from "next/server";

// export async function GET() {
//   // Реализация GET запроса
//   return NextResponse.json({});
// }

export async function POST(req: NextRequest) {
	// Временная заглушка - возвращаем пустой ответ
	const res = req;
	return NextResponse.json({ success: true });
}
