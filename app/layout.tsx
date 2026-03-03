import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Создание карточки товара | TableCRM",
  description: "Удобная форма создания карточки товара с AI-подсказками"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_#0ea5e933,_transparent_55%),radial-gradient(circle_at_bottom,_#22c55e22,_transparent_55%)]" />
        <div className="relative flex min-h-screen">
          <aside className="hidden border-r border-slate-800/70 bg-slate-950/80 px-6 py-6 backdrop-blur md:flex md:w-64 md:flex-col">
            <div className="mb-8 text-xl font-semibold tracking-tight">
              TableCRM
              <span className="ml-1 text-sm font-normal text-slate-400">
                marketplace
              </span>
            </div>
            <nav className="space-y-2 text-sm text-slate-300">
              <div className="rounded-md bg-slate-800/60 px-3 py-2 font-medium text-slate-50">
                Номенклатура
              </div>
              <div className="rounded-md px-3 py-2 text-slate-400">
                Заказы
              </div>
              <div className="rounded-md px-3 py-2 text-slate-400">
                Настройки
              </div>
            </nav>
          </aside>
          <div className="flex min-h-screen flex-1 flex-col">
            <header className="flex items-center justify-between border-b border-slate-800/70 bg-slate-950/80 px-4 py-3 backdrop-blur md:px-6">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-200">
                  Создание карточки товара
                </span>
                <span className="text-xs text-slate-400">
                  Заполните форму, мы поможем с описанием и SEO
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Demo seller · RU
              </div>
            </header>
            <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

