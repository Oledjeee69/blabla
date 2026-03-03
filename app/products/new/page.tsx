import { ProductForm } from "@/components/ui/product-form";

export default function NewProductPage() {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Новая карточка товара
          </h1>
          <p className="text-sm text-slate-400">
            Заполните основные поля, затем воспользуйтесь нейросетью для
            генерации описаний, SEO и категории.
          </p>
        </div>
        <ProductForm />
      </section>
    </div>
  );
}

