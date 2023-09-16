// import type { Organization } from '@prisma/client'
import React, { type HTMLAttributes } from "react";
import { prisma } from "@/server/db";
import Link from "next/link";
import { NewOrgButton } from "@/app/_components/organization/CreateForm";
import { twMerge } from "tailwind-merge";

const CategoryLink = ({
  category,
  slug,
  className,
  divClassName
}: {
  category: string;
  slug: string;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  divClassName?: HTMLAttributes<HTMLDivElement>["className"];
}) => (
  <Link
    href={`/orgs/${slug}`}
    className={className}
  >
    <div
      className={twMerge(`text-2xl font-bold text-stone-600 flex h-24 items-center justify-center rounded shadow hover:shadow-lg cursor-pointer hover:scale-105 transition-all hover:text-rose-600 bg-white`, divClassName) }
    >
      {category}
    </div>
  </Link>
);

async function OrganizationPage() {
  const categories = await prisma.category.findMany({});

  return (
    <div className=" bg-stone-50">
      <h1 className="pb-6 w-full text-center text-2xl sm:text-4xl font-bold text-stone-500">
        Choose a Category
      </h1>
      <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-center gap-4 px-6 pb-32">
        {categories.map((category) => (
          <CategoryLink
            key={category.category}
            category={category.category}
            slug={category.slug}
          />
        ))}
        <CategoryLink
          className="col-span-auto"
          divClassName="bg-rose-500 text-white hover:bg-rose-600 hover:text-white"
          category="All Organizations"
          slug="all"
        />
        <NewOrgButton className=" col-span-full"  />
      </div>
    </div>
  );
}

export default OrganizationPage;
