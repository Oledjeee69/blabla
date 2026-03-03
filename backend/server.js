const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*"
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "tablecrm-backend" });
});

app.post("/api/ai/generate-from-name", (req, res) => {
  const { name } = req.body || {};
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Поле name обязательно" });
  }

  const description_short = `Краткое описание для товара «${name}». Основные преимущества и ключевые характеристики.`;
  const description_long = `Подробное описание товара «${name}». Расскажите о ключевых характеристиках, преимуществах, материалах, гарантии и вариантах использования.`;
  const seo_title = `${name} — купить по выгодной цене`;
  const seo_description = `Купите ${name} с быстрой доставкой. Характеристики, описание, отзывы покупателей и актуальная цена.`;
  const seo_keywords = [name, "купить", "цена", "отзывы", "характеристики"];
  const category = 2477;

  res.json({
    description_short,
    description_long,
    seo_title,
    seo_description,
    seo_keywords,
    category
  });
});

app.post("/api/product", async (req, res) => {
  const token = process.env.TABLECRM_TOKEN;
  if (!token) {
    return res
      .status(500)
      .json({ error: "TABLECRM_TOKEN не настроен на бэкенде" });
  }

  const body = req.body;
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Некорректное тело запроса" });
  }

  try {
    const crmRes = await fetch(
      `https://app.tablecrm.com/api/v1/nomenclature/?token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([body])
      }
    );

    const text = await crmRes.text();

    if (!crmRes.ok) {
      return res
        .status(400)
        .json({ error: "Ошибка TableCRM", details: text });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    res.json(data);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Ошибка при обращении к TableCRM", details: e.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

