import type { ProductFormValues } from "@/lib/schemas";

type Props = {
  values: Partial<ProductFormValues>;
};

export function ProductPreview({ values }: Props) {
  const {
    name,
    marketplace_price,
    description_short,
    seo_title,
    seo_description
  } = values;

  const formattedPrice =
    typeof marketplace_price === "number"
      ? new Intl.NumberFormat("ru-RU", {
          style: "currency",
          currency: "RUB",
          maximumFractionDigits: 0
        }).format(marketplace_price)
      : "—";

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div>
        <h2 className="text-sm font-medium text-slate-200">
          Превью карточки товара
        </h2>
        <p className="text-xs text-slate-500">
          Так товар будет выглядеть в маркетплейсе и поисковой выдаче.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
        <div className="flex gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-slate-800 text-[10px] text-slate-400">
            Фото
          </div>
          <div className="flex-1 space-y-1">
            <div className="text-sm font-medium text-slate-50">
              {name || "Название товара"}
            </div>
            <div className="text-xs text-slate-400 line-clamp-2">
              {description_short ||
                "Краткое описание товара, основные преимущества и ключевые характеристики."}
            </div>
            <div className="text-sm font-semibold text-sky-400">
              {formattedPrice}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
        <div className="mb-1 text-xs font-medium text-slate-400">
          Превью сниппета в поиске
        </div>
        <div className="text-sm font-semibold text-sky-400">
          {seo_title || name || "SEO заголовок товара"}
        </div>
        <div className="text-xs text-slate-300">
          {seo_description ||
            description_short ||
            "Описание, которое увидит покупатель в поисковой выдаче. Кратко и по делу, с ключевыми словами."}
        </div>
        <div className="mt-2 text-[10px] text-slate-500">
          {typeof marketplace_price === "number" ? formattedPrice : "Цена по запросу"}
          {" · "}
          {name || "Название магазина"}
        </div>
      </div>
    </div>
  );
}

