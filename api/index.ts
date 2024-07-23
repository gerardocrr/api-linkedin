import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { jobData } from "../lib/fetch";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://job-aligner-ai.vercel.app"],
  })
);

app.get("/", (c) => {
  return c.json({
    message: "Welcome to the unofficial Linkedin API!",
    github: "https://github.com/gerardocrr/api-linkedin",
  });
});

app.get("/jobs/:id", async (c) => {
  const id = c.req.param("id");
  const data = await jobData(id);
  return c.json(data);
});

export default handle(app);
