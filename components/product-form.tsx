"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { productSchema, type ProductFormValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductPreview } from "@/components/product-preview";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export function ProductForm() {
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      type: "product",
      cashback_type: "lcard_cashback",
      chatting_percent: 0,
      marketplace_price: 0,
      unit: 116,
      category: 2477,
      global_category_id: 127
    }
  });

  const values = watch();

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Ошибка при создании товара");
      }
      alert("Товар успешно создан в TableCRM (проверьте демо-кабинет).");
    } catch (e: any) {
      alert(e?.message ?? "Не удалось создать товар");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateFromName = async () => {
    const name = values.name;
    if (!name) {
      alert("Сначала введите название товара");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/generate-from-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      if (!res.ok) {
        throw new Error("Не удалось сгенерировать поля");
      }
      const data = await res.json();
      setValue("description_short", data.description_short ?? "");
      setValue("description_long", data.description_long ?? "");
      setValue("seo_title", data.seo_title ?? "");
      setValue("seo_description", data.seo_description ?? "");
      setValue("seo_keywords", data.seo_keywords ?? []);
      if (data.category) setValue("category", data.category);
    } catch (e: any) {
      alert(e?.message ?? "Ошибка генерации полей");
    } finally {
      setAiLoading(false);
    }
  };

  const completionPercent = (() => {
    const required: (keyof ProductFormValues)[] = [
      "name",
      "description_short",
      "description_long",
      "code",
      "marketplace_price",
      "category"
    ];
    const filled = required.filter((key) => {
      const v = values[key];
      if (typeof v === "number") return !Number.isNaN(v) && v > 0;
      return Boolean(v && String(v).trim().length > 0);
    }).length;
    return Math.round((filled / required.length) * 100);
  })();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/70 p-4 md:p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Готовность карточки
            </div>
            <div className="text-lg font-semibold text-slate-50">
              {completionPercent}% заполнено
            </div>
          </div>
          <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-sky-500 transition-all"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">
            1. Основная информация
          </h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Название товара
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Например, Кофеварка Philips HD1234"
                  {...register("name")}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateFromName}
                  disabled={aiLoading}
                >
                  {aiLoading ? "Генерация..." : "AI из названия"}
                </Button>
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.name.message}
                </p>
              )}
              <p className="mt-1 text-[11px] text-slate-500">
                Введите максимально понятное название — мы сгенерируем описание,
                SEO и предложим категорию.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Тип
                </label>
                <select
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900 px-3 text-sm text-slate-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  {...register("type")}
                >
                  <option value="product">Товар</option>
                  <option value="service">Услуга</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Артикул
                </label>
                <Input placeholder="Уникальный код товара" {...register("code")} />
                {errors.code && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.code.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Цена, ₽
                </label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  {...register("marketplace_price", { valueAsNumber: true })}
                />
                {errors.marketplace_price && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.marketplace_price.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Кэшбэк, %
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  {...register("chatting_percent", { valueAsNumber: true })}
                />
                {errors.chatting_percent && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.chatting_percent.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-200">
            2. Описание товара
          </h2>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Краткое описание
            </label>
            <Textarea
              rows={3}
              placeholder="Пара предложений, почему товар стоит купить..."
              {...register("description_short")}
            />
            {errors.description_short && (
              <p className="mt-1 text-xs text-red-400">
                {errors.description_short.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Полное описание
            </label>
            <Textarea
              rows={6}
              placeholder="Расскажите подробно о характеристиках, сценариях использования, комплектации, гарантии..."
              {...register("description_long")}
            />
            {errors.description_long && (
              <p className="mt-1 text-xs text-red-400">
                {errors.description_long.message}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-200">
            3. Категория и SEO
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Категория (ID)
              </label>
              <Input
                type="number"
                {...register("category", { valueAsNumber: true })}
              />
              {errors.category && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.category.message}
                </p>
              )}
              <p className="mt-1 text-[11px] text-slate-500">
                Можно оставить рекомендованное значение, предложенное AI.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Глобальная категория (ID)
              </label>
              <Input
                type="number"
                {...register("global_category_id", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              SEO заголовок
            </label>
            <Input
              placeholder="Как товар будет выглядеть в заголовке поисковой выдачи"
              {...register("seo_title")}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              SEO описание
            </label>
            <Textarea
              rows={3}
              placeholder="Короткое и продающее описание для поисковой выдачи..."
              {...register("seo_description")}
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-200">
            4. Адрес и координаты (опционально)
          </h2>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Адрес
            </label>
            <Input
              placeholder="улица Зайцева 8, Казань, Россия"
              {...register("address")}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Широта
              </label>
              <Input
                type="number"
                step="0.000001"
                {...register("latitude", { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Долгота
              </label>
              <Input
                type="number"
                step="0.000001"
                {...register("longitude", { valueAsNumber: true })}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Сохраняем..." : "Создать товар"}
          </Button>
        </div>
      </form>

      <ProductPreview values={values} />
    </div>
  );
}

