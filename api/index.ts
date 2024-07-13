import { Hono } from "hono";
import { handle } from "hono/vercel";
import * as cheerio from "cheerio";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

async function datos() {
  const response = await fetch(
    "https://www.linkedin.com/jobs/view/3966977311/"
  );
  const html = await response.text();

  const $ = cheerio.load(html);
  const titulo = $("h1.top-card-layout__title").text();

  return titulo;
}

app.get("/", async (c) => {
  const data = await datos();
  return c.text(data);
});

app.get("/", (c) => {
  return c.json({ message: "Welcome to the unofficial Linkedin API!" });
});

export default handle(app);
