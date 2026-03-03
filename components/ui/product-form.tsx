"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Save, Image as ImageIcon, MapPin, Tag } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Временно убираем импорты, которые могут вызывать ошибки
// import { productSchema, type ProductFormValues } from "@/lib/validations";
// import { AIBadge } from "./AIBadge";
// import { CategorySelect } from "./CategorySelect";
// import { useAutosave } from "@/hooks/useAutosave";

// Временная заглушка для схемы
const productSchema = null;
type ProductFormValues = any;

const defaultValues: Partial<ProductFormValues> = {
  type: "product",
  unit: 116,
  cashback_type: "lcard_cashback",
  global_category_id: 127,
  chatting_percent: 4,
  seo_keywords: [],
};

export function ProductForm() {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [aiGeneratedFields, setAiGeneratedFields] = useState<Set<string>>(new Set());
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const form = useForm<ProductFormValues>({
    // resolver: zodResolver(productSchema),
    defaultValues,
  });

  const { watch, setValue, getValues, formState } = form;
  const watchedValues = watch();

  // Заглушка для автосохранения
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSaveStatus("saving");
      localStorage.setItem("product-draft", JSON.stringify(watchedValues));
      setTimeout(() => setSaveStatus("saved"), 500);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [watchedValues]);

  // Загрузка черновика
  useEffect(() => {
    const draft = localStorage.getItem("product-draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        form.reset(parsed);
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, [form]);

  // Заглушка для AI генерации
  const generateWithAI = async (field: string) => {
    setIsGenerating(field);
    setTimeout(() => {
      if (field === "description_short") {
        setValue("description_short", "Это краткое описание товара, сгенерированное AI", { shouldDirty: true });
      } else if (field === "description_long") {
        setValue("description_long", "Это подробное описание товара с характеристиками и преимуществами, созданное нейросетью для привлечения покупателей.", { shouldDirty: true });
      }
      setAiGeneratedFields((prev) => new Set(prev).add(field));
      setIsGenerating(null);
    }, 1500);
  };

  const onSubmit = async (data: ProductFormValues) => {
    setSaveStatus("saving");
    
    try {
      // Временно убираем реальный API запрос
      console.log("Saving data:", data);
      setSaveStatus("saved");
      localStorage.removeItem("product-draft");
      alert("Товар успешно создан! (демо-режим)");
    } catch (error) {
      setSaveStatus("idle");
      alert("Ошибка при сохранении");
    }
  };

  // Dropzone для изображений
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 5,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
        {/* Статус сохранения */}
        <div className="flex justify-end items-center gap-2 text-sm text-muted-foreground">
          {saveStatus === "saving" && (
            <>
              <Skeleton className="h-4 w-4 rounded-full" />
              <span>Сохранение...</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Save className="h-4 w-4 text-green-500" />
              <span className="text-green-500">Сохранено</span>
            </>
          )}
        </div>

        {/* Основная информация */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Основная информация
            </CardTitle>
            <CardDescription>
              Заполните базовую информацию о товаре.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Название товара */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название товара *</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="Например: Смартфон Xiaomi Redmi Note 12" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => generateWithAI("description_short")}
                      disabled={isGenerating !== null || !field.value}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormDescription>
                    Введите название и нажмите на ✨ для автозаполнения
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Краткое описание */}
            <FormField
              control={form.control}
              name="description_short"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Краткое описание</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Textarea 
                        placeholder="Краткое и продающее описание товара" 
                        className="min-h-[80px]"
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    {aiGeneratedFields.has("description_short") && (
                      <Badge variant="outline" className="absolute top-2 right-2 bg-purple-50">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Полное описание */}
            <FormField
              control={form.control}
              name="description_long"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Полное описание</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Textarea 
                        placeholder="Подробное описание с характеристиками" 
                        className="min-h-[120px]"
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => generateWithAI("description_long")}
                      disabled={isGenerating !== null}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      Улучшить текст
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Артикул */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Артикул (SKU)</FormLabel>
                  <FormControl>
                    <Input placeholder="Например: XM-RN12-128" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Категория и цена */}
        <Card>
          <CardHeader>
            <CardTitle>Категория и цена</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ID категории" 
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="marketplace_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1000" 
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chatting_percent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Процент за общение (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="4" 
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cashback_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип кэшбэка</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип кэшбэка" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lcard_cashback">Кэшбэк картой лояльности</SelectItem>
                      <SelectItem value="none">Без кэшбэка</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Кнопка отправки */}
        <div className="sticky bottom-4 flex justify-end">
          <Button 
            type="submit" 
            size="lg"
            className="shadow-lg"
          >
            {saveStatus === "saving" ? "Сохранение..." : "Создать карточку товара"}
          </Button>
        </div>
      </form>
    </Form>
  );
}