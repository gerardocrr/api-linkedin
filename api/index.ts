import { Hono } from "hono";
import { handle } from "hono/vercel";
import * as cheerio from "cheerio";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

async function jobData(id: string) {
  const response = await fetch(`https://www.linkedin.com/jobs/view/${id}/`);
  const html = await response.text();

  const $ = cheerio.load(html);
  const title = $("h1.top-card-layout__title").text();
  const company = $("a.topcard__org-name-link").text().trim();
  const location = $("span.topcard__flavor--bullet").text().trim();
  const postedTimeAgo = $("span.posted-time-ago__text").text().trim();
  const description = $("div.show-more-less-html__markup").text().trim();
  const jobCriteria: string[] = [];
  $("span.description__job-criteria-text").each((index, element) => {
    jobCriteria.push($(element).text().trim());
  });
  const [seniorityLevel, employmentType, jobFunction, industries] = jobCriteria;

  return {
    id: id,
    title: title,
    company: company,
    location: location,
    postedTimeAgo: postedTimeAgo,
    jobCriteria: {
      seniorityLevel: seniorityLevel,
      employmentType: employmentType,
      jobFunction: jobFunction,
      industries: industries,
    },
    description: description,
  };
}

app.get("/", (c) => {
  return c.json({ message: "Welcome to the unofficial Linkedin API!" });
});

app.get("/jobs/:id", async (c) => {
  const id = c.req.param("id");
  const data = await jobData(id);
  return c.json(data);
});

export default handle(app);
