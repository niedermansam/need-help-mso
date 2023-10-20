import { BackButton } from "@/components/BackButton";
import { SearchComponent } from "@/app/search/SearchComponent";
import { prisma } from "@/server/db";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { ORGANIZATION_SELECT, PROGRAM_SELECT } from "@/components/organization/utils/fetchAllOrgs";
import { MapLink } from "@/components/organization/CategorySection";



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
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          website: true,
          phone: true,
          email: true,
          tags: { select: { tag: true } },
          exclusiveToCommunities: {
            select: { name: true, id: true },
          },
          helpfulToCommunities: {
            select: { name: true, id: true },
          },
          programs: {
            where: {
              categoryMeta: {
                slug: params.category,
              },
            },
            select:  PROGRAM_SELECT,
          },
          categories: {
            select: { category: true },
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
      <h1 className="mb-6 flex items-center gap-2 text-4xl font-bold text-stone-700">
        <BackButton /> {category.category}{" "}
        <MapLink slug={category.slug} />
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
