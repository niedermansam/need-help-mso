import { kysely } from "@/server/kysely";
import { prisma } from "@/server/prisma";
import React from "react";

export const revalidate = 0;

async function Page() {
  const data = await kysely
    .selectFrom("_ProgramToTag")
    .innerJoin("Program", "_ProgramToTag.A", "Program.id")
    .innerJoin("Category", "Program.category", "Category.category")
    .select(["B as tag", "Category.category", "Category.slug"])
    .distinct()
    .execute();

  const categoryTagMap = new Map<string, Set<string>>();

  for (const { tag, category } of data) {
    const tags = categoryTagMap.get(category) ?? new Set<string>();
    tags.add(tag);
    categoryTagMap.set(category, tags);
  }

  const categoryTags = Array.from(categoryTagMap.entries()).map(
    ([category, tags]) => ({
      category,
      tags: Array.from(tags),
    })
  );

  return (
    <div>
      {categoryTags.map(({ category, tags }) => (
        <div key={category}>
          <h1 className="text-xl">{category}</h1>
          <ul className="mb-12">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Page;
