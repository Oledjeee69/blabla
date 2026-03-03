import { NextResponse, type NextRequest } from "next/server";
import { productSchema } from "@/lib/schemas";
import { createNomenclatureItem } from "@/lib/tablecrm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = productSchema.parse(body);
    const data = await createNomenclatureItem(parsed);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Ошибка при создании товара" },
      { status: 400 }
    );
  }
}

