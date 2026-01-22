import { db } from "../db";
import {
  alerts,
  categories,
  companies,
  jobs,
  subscriptions,
  users,
} from "../db/schema";
import { faker } from "@faker-js/faker";
import { jobTypeEnum, remoteScopeEnum } from "../db/schema";

async function main() {
  console.log("Seeding database with fake data...");

  // basic categories
  const categorySlugs = [
    ["software-development", "Software Development"],
    ["design", "Design"],
    ["marketing", "Marketing"],
    ["product", "Product"],
    ["customer-support", "Customer Support"],
    ["sales", "Sales"],
    ["devops", "DevOps / SRE"],
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(
      categorySlugs.map(([slug, name]) => ({
        slug,
        name,
        description: `${name} remote jobs`,
      })),
    )
    .returning();

  // companies
  const insertedCompanies = await db
    .insert(companies)
    .values(
      Array.from({ length: 20 }).map(() => ({
        name: faker.company.name(),
        slug: faker.helpers.slugify(faker.company.name()).toLowerCase(),
        logoUrl: faker.image.urlLoremFlickr({ category: "business" }),
        websiteUrl: faker.internet.url(),
        twitterUrl: faker.internet.url(),
        linkedinUrl: faker.internet.url(),
        location: faker.location.city(),
      })),
    )
    .returning();

  // jobs
  const jobTypeValues = [
    "full_time",
    "part_time",
    "freelance",
    "contract",
    "internship",
  ] as const;

  const remoteScopeValues = [
    "worldwide",
    "europe",
    "north_america",
    "latam",
    "asia",
  ] as const;

  await db.insert(jobs).values(
    Array.from({ length: 100 }).map(() => {
      const company =
        insertedCompanies[
        Math.floor(Math.random() * insertedCompanies.length)
        ];
      const category =
        insertedCategories[
        Math.floor(Math.random() * insertedCategories.length)
        ];
      const minSalary = faker.number.int({ min: 40000, max: 80000 });
      const maxSalary = minSalary + faker.number.int({ min: 5000, max: 70000 });
      const title = `${faker.person.jobTitle()} (${faker.helpers.arrayElement([
        "Remote",
        "Remote-friendly",
        "Global",
      ])})`;

      const slug = faker.helpers.slugify(
        `${title}-${faker.string.alphanumeric(6)}`,
      ).toLowerCase();

      return {
        title,
        slug,
        companyId: company.id,
        categoryId: category.id,
        location: faker.helpers.arrayElement([
          "Remote - Worldwide",
          "Remote - Europe",
          "Remote - North America",
          faker.location.country(),
        ]),
        salaryMin: minSalary.toString(),
        salaryMax: maxSalary.toString(),
        salaryCurrency: "USD",
        jobType: faker.helpers.arrayElement(jobTypeValues),
        remoteScope: faker.helpers.arrayElement(remoteScopeValues),
        isFeatured: faker.datatype.boolean(0.25),
        isPublished: true,
        paymentStatus: "paid",
        polarCheckoutId: faker.string.alphanumeric(10),
        applyUrl: faker.internet.url(),
        source: faker.helpers.arrayElement(["internal", "rss", "api"]),
        sourceUrl: faker.internet.url(),
        descriptionHtml: `<p>${faker.lorem.paragraphs(4, "<br/><br/>")}</p>`,
        tags: faker.helpers.arrayElements(
          [
            "JavaScript",
            "TypeScript",
            "React",
            "Node.js",
            "Design",
            "Marketing",
            "Product",
            "DevOps",
            "Remote",
          ],
          { min: 2, max: 6 },
        ),
        postedAt: faker.date.recent({ days: 60 }),
      };
    }),
  );

  console.log("Seed completed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


