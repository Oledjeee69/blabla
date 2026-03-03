import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">
        Конструктор карточки товара
      </h1>
      <p className="max-w-xl text-sm text-slate-300">
        Перейдите к созданию новой карточки товара для маркетплейса TableCRM.
        Мы поможем с описанием, SEO и категорией с помощью AI.
      </p>
      <Link
        href="/products/new"
        className="inline-flex items-center rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-400"
      >
        Создать карточку товара
      </Link>
    </div>
  );
}

