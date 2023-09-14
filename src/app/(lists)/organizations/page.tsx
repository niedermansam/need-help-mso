// import type { Organization } from '@prisma/client'
import React from "react";
import { prisma } from "@/server/db";
import Link from "next/link";

const CategoryLink = ({
  category,
  slug,
}: {
  category: string;
  slug: string;
}) => (
  <div>
    <Link href={`/orgs/${slug}`} className="text-2xl font-bold text-stone-700 my-3">
      {category}
    </Link>
  </div>
);

async function OrganizationPage() {
  const categories = await prisma.category.findMany({});

  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold text-stone-700">
        Explore Organizations by Category
      </h1>
      {categories.map((category) => (
        <CategoryLink
          key={category.category}
          category={category.category}
          slug={category.slug}
        />
      ))}
      <CategoryLink category="All Organizations" slug="all" />
    </div>
  );
}

export default OrganizationPage;
