// import type { Organization } from '@prisma/client'
import React, { type HTMLAttributes } from "react";
import { prisma } from "@/server/db";
import Link from "next/link";
import { NewOrgButton } from "@/app/_components/organization/CreateForm";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

const CategoryLink = ({
  category,
  slug,
  className,
  divClassName,
  iconClassName,
}: {
  category: string;
  slug: string;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  divClassName?: HTMLAttributes<HTMLDivElement>["className"];
  iconClassName?: HTMLAttributes<HTMLDivElement>["className"];
}) => (
  <Link href={`/orgs/${slug}`} className={className}>
    <div
      className={twMerge(
        `flex h-24 cursor-pointer flex-row gap-2 items-center justify-center rounded bg-white text-2xl font-bold text-stone-600 shadow transition-all hover:scale-105 hover:text-rose-600 hover:shadow-lg`,
        divClassName
      )}
    >
      {category}
      <Link href={`orgs/${slug}/map`} className="font-light text-sm flex flex-col  gap-1 text-stone-500 hover:text-rose-500">
        <FontAwesomeIcon className={twMerge("w-6 -my-2", iconClassName)} icon={faMapLocationDot} />

      </Link>
    </div>
  </Link>
);

async function OrganizationPage() {
  const categories = await prisma.category.findMany({});

  return (
    <div className=" bg-stone-50">
      <h1 className="w-full pb-6 text-center text-2xl font-bold text-stone-500 sm:text-4xl">
        Choose a Category
      </h1>
      <div className="grid w-full grid-cols-1 items-center justify-center gap-4 px-6 pb-32 md:grid-cols-2 lg:grid-cols-3">
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
          iconClassName=" text-rose-200 hover:text-white"
          category="All Organizations"
          slug="all"
        />
        <NewOrgButton className=" col-span-full" />
      </div>
    </div>
  );
}

export default OrganizationPage;
