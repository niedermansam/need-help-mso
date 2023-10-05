import React, { type HTMLAttributes } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export const MapLink = ({
  slug,
  className,
}: {
  slug: string;
  className?: HTMLAttributes<HTMLDivElement>["className"];
}) => (
  <Link href={`/orgs/${slug}/map`} className={className}>
    <div className="flex gap-1 text-sm items-center border px-2 py-1 rounded font-semibold text-stone-500 hover:text-white hover:bg-rose-500 hover:border-rose-500">
      View&nbsp;Map
    </div>
  </Link>
);

const CategoryLink = ({
  category,
  slug,
  className,
  divClassName,
  mapLinkClassName,
}: {
  category: string;
  slug: string;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  divClassName?: HTMLAttributes<HTMLDivElement>["className"];
  mapLinkClassName?: HTMLAttributes<HTMLDivElement>["className"];
}) => (
  <Link href={`/orgs/${slug}`} className={className}>
    <div
      className={twMerge(
        `flex h-24 cursor-pointer flex-col lg:flex-row items-center justify-center gap-2 rounded bg-white text-2xl font-bold text-stone-600 shadow  hover:text-rose-600 hover:shadow-lg`,
        divClassName
      )}
    >
      <h2 className="w-fit text-center">{category}</h2>
      <MapLink slug={slug} className={mapLinkClassName} />
    </div>
  </Link>
);

export const CategorySection = ({
  categoryList,
}: {
  categoryList: Record<"category" | "slug", string>[];
}) => {
  return (
    <div className=" grid w-full grid-cols-1 items-center auto-rows-auto justify-center gap-4 pt-4 pb-32 md:grid-cols-2 lg:grid-cols-3">
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
        mapLinkClassName=" text-rose-200 hover:text-white"
        category="All Organizations"
        slug="all"
      />
    </div>
  );
};
