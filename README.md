# TableCRM Product Card Creator

Удобный модуль создания карточки товара для маркетплейса TableCRM с генерацией описаний и SEO через нейросеть. Реализован на **Next.js 14 (App Router, TypeScript)**, **Tailwind CSS** и кастомных компонентах в стиле **shadcn/ui**.

## Стек

- **Next.js 14** (App Router, SSR)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Zod** + **react-hook-form** (валидация формы)

## Возможности

- Форма создания карточки товара с полями:
  - название, тип, артикул, цена, кэшбэк;
  - краткое и полное описание;
  - категория и глобальная категория;
  - SEO title / description / keywords;
  - адрес и координаты.
- Кнопка **«AI из названия»**:
  - по названию генерирует краткое и полное описание;
  - предлагает SEO‑поля;
  - подбирает категорию (ID).
- Индикатор **готовности карточки** (процент заполнения ключевых полей).
- **Превью карточки товара** и **SEO‑сниппета** (правая колонка).
- Отправка данных в **TableCRM** через серверный API‑роут.

## Структура проекта

Корень монорепозитория: `c:\Users\1\Desktop\Новая папка`

- **Фронтенд** (Next.js, Vercel): `./`
  - `app/`
    - `layout.tsx` — общий layout (sidebar, header).
    - `globals.css` — Tailwind и базовые стили.
    - `page.tsx` — главная страница с кнопкой перехода на форму.
    - `products/new/page.tsx` — страница формы создания товара.
  - `components/`
    - `product-form.tsx` — основная форма с AI‑кнопкой и шагами.
    - `product-preview.tsx` — превью карточки товара и SEO‑сниппета.
    - `ui/button.tsx`, `ui/input.tsx`, `ui/textarea.tsx` — базовые UI‑компоненты.
  - `lib/`
    - `schemas.ts` — Zod‑схема `productSchema` и тип `ProductFormValues`.
    - `utils.ts` — утилита `cn` для стилей.

- **Бэкенд** (Node/Express, Railway): `./backend`
  - `backend/server.js` — HTTP‑сервер с REST‑роутами:
    - `POST /api/product` — создаёт товар в TableCRM.
    - `POST /api/ai/generate-from-name` — mock‑генерация описаний и SEO по названию.
  - `backend/package.json` — настройки и зависимости бэкенда.

## Локальный запуск

### 1. Бэкенд (Railway‑совместимый сервер)

1. Перейти в папку бэкенда:

```bash
cd "c:\Users\1\Desktop\Новая папка\backend"
```

2. Установить зависимости:

```bash
npm install
```

3. Создать файл `.env` (опционально локально, обязательно на Railway) и указать токен:

```env
TABLECRM_TOKEN=af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77
```

4. Запустить сервер:

```bash
npm start
```

По умолчанию бэкенд поднимется на `http://localhost:3001`.

### 2. Фронтенд (Next.js)

1. В корне проекта:

```bash
cd "c:\Users\1\Desktop\Новая папка"
npm install
```

2. Создать `.env.local` и прописать URL бэкенда:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

3. Запустить dev‑сервер фронта:

```bash
npm run dev
```

4. Открыть в браузере:

- Главная: `http://localhost:3000/`
- Форма: `http://localhost:3000/products/new`

## Деплой: фронт на Vercel, бэк на Railway

### Бэкенд на Railway

1. В Railway создайте новый проект **Node.js** и подключите репозиторий (укажите корень `/backend` как рабочую директорию, если нужно).
2. В настройках проекта Railway:
   - Убедитесь, что команда запуска — `npm start`.
   - В **Variables** добавьте:

```text
TABLECRM_TOKEN=af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77
```

3. После деплоя запомните публичный URL сервиса, например:

```text
https://tablecrm-backend.up.railway.app
```

### Фронтенд на Vercel

1. В Vercel создайте новый проект и укажите репозиторий; корень — корень фронта (та же папка `Новая папка`, но без `backend` как отдельного проекта).
2. В **Environment Variables** Vercel добавьте:

```text
NEXT_PUBLIC_BACKEND_URL=https://tablecrm-backend.up.railway.app
```

3. Запустите деплой.

После успешного деплоя:

- Форма будет доступна по адресу вида:
  - `https://<frontend-project>.vercel.app/products/new`

## Как это работает

- **Фронтенд (Vercel)**:
  - `ProductForm` собирает данные, валидирует их через Zod и отправляет их на бэкенд по адресу `${NEXT_PUBLIC_BACKEND_URL}/api/product`.
  - Кнопка AI отправляет название на `${NEXT_PUBLIC_BACKEND_URL}/api/ai/generate-from-name`, подставляет сгенерированные значения в форму.
  - `ProductPreview` в реальном времени показывает, как будет выглядеть карточка и SEO‑сниппет.

- **Бэкенд (Railway)**:
  - `POST /api/product` принимает данные формы и пересылает их в TableCRM API с использованием `TABLECRM_TOKEN`.
  - `POST /api/ai/generate-from-name` генерирует (mock) описания, SEO и категорию по названию товара.

## Дальнейшие улучшения

- Подключить реальный AI‑провайдер (OpenAI, YandexGPT и т.п.) вместо mock‑ответа.
- Добавить автосохранение черновика в `localStorage`.
- Реализовать многошаговый wizard (шаги по разделам формы).
- Сделать выбор категории не по ID, а по справочнику с удобным поиском.

