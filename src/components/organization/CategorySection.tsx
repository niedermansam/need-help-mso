import React, { type HTMLAttributes } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

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
        `flex h-24 cursor-pointer flex-row items-center justify-center gap-2 rounded bg-white text-2xl font-bold text-stone-600 shadow transition-all hover:scale-105 hover:text-rose-600 hover:shadow-lg`,
        divClassName
      )}
    >
      <h2 className="w-fit max-w-[70%] text-center">{category}</h2>
      <Link
        href={`orgs/${slug}/map`}
        className="flex flex-col gap-1 text-sm  font-light text-stone-500 hover:text-rose-500"
      >
        <FontAwesomeIcon
          className={twMerge("-my-2 w-6", iconClassName)}
          icon={faMapLocationDot}
        />
      </Link>
    </div>
  </Link>
);

export const CategorySection = ({
  categoryList,
}: {
  categoryList: Record<"category" | "slug", string>[];
}) => {
  return (
    <div className="grid w-full grid-cols-1 items-center justify-center gap-4 pt-4 pb-32 md:grid-cols-2 lg:grid-cols-3">
      {categoryList.sort((a,b) => {
        if(b.category === "Misc") return -1;
        return a.category.localeCompare(b.category);
      }).map((category) => (
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
    </div>
  );
};
