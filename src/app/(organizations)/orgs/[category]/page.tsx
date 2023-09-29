import { BackButton } from "@/app/_components/BackButton";
import { SearchComponent } from "@/app/search/SearchComponent";
import { prisma } from "@/server/db";
import React from "react";

export default async function OrganizationByCategoryPage({
  params,
}: {
  params: { category: string };
}) {

  const categoryName = await prisma.category.findUnique({
    where: {
      slug: params.category,
    },
    select: {
      category: true,
    },
  });

  const category = await prisma.category.findUnique({
    where: { slug: params.category },
    include: {
      allOrganizations: {
        include: {
          tags: true,
          categories: true,
          programs: {
            where: {
              category: {
                equals: categoryName?.category,
              }
            },
            include: {
              tags: true,
              exclusiveToCommunities: true,
            },
          },
        },
      },
    },
  });

  if (!category) {
    return {
      notFound: true,
    };
  }

  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold text-stone-700">
        <BackButton /> {category.category}
      </h1>
      <SearchComponent searchOptions={category.allOrganizations} />
    </div>
  );
}

export async function generateStaticParams() {
  /*
  const slugs = [
    "case-management",
    "clothing",
    "food",
    "health",
    "job-services",
    "legal",
    "misc",
    "recovery",
    "shelter",
    "transportation",
  ];
  */

  const slugsJson = await prisma.category.findMany({
    select: {
      slug: true,
    },
  });

  const slugs = slugsJson.map((x) => x.slug);



  return slugs.map((slug) => {
    return { category: slug };
  });
}
