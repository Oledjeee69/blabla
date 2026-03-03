import { productSchema } from "@/lib/schemas";

export type ProductDto = ReturnType<(typeof productSchema)["parse"]>;

export async function createNomenclatureItem(data: ProductDto) {
  const token = process.env.TABLECRM_TOKEN;
  if (!token) {
    throw new Error("TABLECRM_TOKEN не настроен в переменных окружения");
  }

  const res = await fetch(
    `https://app.tablecrm.com/api/v1/nomenclature/?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([data])
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка TableCRM: ${text}`);
  }

  return res.json();
}

