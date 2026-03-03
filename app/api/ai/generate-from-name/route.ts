import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { error: "Поле name обязательно" },
      { status: 400 }
    );
  }

  // Здесь можно подключить реальный AI (OpenAI и т.д.).
  // Пока используется простая заглушка.
  const description_short = `Краткое описание для товара «${name}». Основные преимущества и ключевые характеристики.`;
  const description_long = `Подробное описание товара «${name}». Расскажите о ключевых характеристиках, преимуществах, материалах, гарантии и вариантах использования, чтобы покупателю было проще принять решение.`;
  const seo_title = `${name} — купить по выгодной цене`;
  const seo_description = `Купите ${name} с быстрой доставкой. Характеристики, описание, отзывы покупателей и актуальная цена.`;
  const seo_keywords = [name, "купить", "цена", "отзывы", "характеристики"];
  const category = 2477;

  return NextResponse.json({
    description_short,
    description_long,
    seo_title,
    seo_description,
    seo_keywords,
    category
  });
}

