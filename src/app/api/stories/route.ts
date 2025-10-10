import { NextRequest, NextResponse } from "next/server";

// export async function GET() {
//   // Реализация GET запроса
//   return NextResponse.json({});
// }

export async function POST(_req: NextRequest) {
	// Временная заглушка - возвращаем пустой ответ
	return NextResponse.json({ success: true });
}
