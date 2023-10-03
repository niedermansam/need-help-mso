"use client";
import React, { type Dispatch, type SetStateAction } from "react";
import type { ProgramData } from "./getOrgData";
import { ProgramCard } from "@/components/DisplayCard/server";
import { twMerge } from "tailwind-merge";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
// import { useSearchParams, useRouter } from 'next/navigation'

const FirstPageButton = () => {
  const currentPage = parseInt(useSearchParams().get("page") || "") || 0;
  const category = useSearchParams().get("category");
  const pathname = usePathname();

  return (
    <Link
      href={{
        pathname,
        query: category && { category },
      }}
      className={twMerge(
        `mb-2 mr-2 rounded-md bg-stone-400 px-2 py-2 text-sm font-medium text-stone-600 shadow-sm `,
        currentPage !== 0 &&
          `bg-stone-300 hover:bg-rose-600 hover:text-white focus:ring-rose-500`
      )}
      aria-disabled={currentPage === 0}
      replace
      scroll={false}
    >
      &laquo;
    </Link>
  );
};

const LastPageButton = ({ lastPage }: { lastPage: number }) => {
  const currentPage = parseInt(useSearchParams().get("page") || "") || 0;
  const category = useSearchParams().get("category");
  const pathname = usePathname();

  const query: Partial<Record<"page" | "category", string | number>> = {
    page: lastPage,
  };
  if (category) query.category = category;

  return (
    <Link
      href={{
        pathname,
        query,
      }}
      className={twMerge(
        `mb-2 mr-2 rounded-md bg-stone-400 px-2 py-2 text-sm font-medium text-stone-600 shadow-sm `,
        currentPage !== lastPage &&
          `bg-stone-300 hover:bg-rose-600 hover:text-white focus:ring-rose-500`
      )}
      aria-disabled={currentPage === lastPage}
      replace
      scroll={false}
    >
      &raquo;
    </Link>
  );
};

const NextPageButton = ({ lastPage }: { lastPage: number }) => {
  const currentPage = parseInt(useSearchParams().get("page") || "") || 0;
  const category = useSearchParams().get("category");
  const pathname = usePathname();

  const query: Partial<Record<"page" | "category", string | number>> = {
    page: lastPage,
  };
  if (category) query.category = category;

  return (
    <Link
      className={twMerge(
        `mb-2 mr-2 rounded-md bg-stone-400 px-2 py-2 text-sm font-medium text-stone-600 shadow-sm `,
        currentPage !== lastPage &&
          `bg-stone-300 hover:bg-rose-600 hover:text-white focus:ring-rose-500`
      )}
      href={{
        pathname,
        query,
      }}
      replace
      scroll={false}
      aria-disabled={currentPage === lastPage}
    >
      &rsaquo;
    </Link>
  );
};

const NumberedPageButton = ({
  pageNumber,
}: {
  pageNumber: number;
}) => {
  const currentPage = parseInt(useSearchParams().get("page") || "") || 0;
  const category = useSearchParams().get("category");
  const pathname = usePathname();

  const query: Partial<Record<"page" | "category", string | number>> = {
    page: pageNumber -1,
  };
  if (category) query.category = category;

  return (
    <Link
      className={twMerge(
        `mb-2 mr-2 rounded-md bg-stone-400 px-2 py-2 text-sm font-medium text-stone-600 shadow-sm `,
        currentPage === pageNumber -1 &&
          `bg-rose-300 text-rose-800 font-bold`,
        currentPage !== pageNumber -1 &&
          `bg-stone-300 hover:bg-rose-600 hover:text-white focus:ring-rose-500`
      )
        
    }
      href={{
        pathname,
        query,
      }}
      aria-disabled={currentPage === pageNumber}
      replace
      scroll={false}
    >
      {pageNumber}
    </Link>
  );
}

const PreviousPageButton = () => {
  const currentPage = parseInt(useSearchParams().get("page") || "") || 0;
  const category = useSearchParams().get("category");
  const pathname = usePathname();

  const query: Partial<Record<"page" | "category", string | number>> = {
    page: currentPage - 1,
  };
  if (category) query.category = category;

  return (
    <Link
      className={twMerge(
        `mb-2 mr-2 rounded-md bg-stone-400 px-2 py-2 text-sm font-medium text-stone-600 shadow-sm `,
        currentPage !== 0 &&
          `bg-stone-300 hover:bg-rose-600 hover:text-white focus:ring-rose-500`
      )}
      href={{
        pathname,
        query,
      }}
      aria-disabled={currentPage === 0}
      replace
      scroll={false}
    >
      &lsaquo;
    </Link>
  );
}

function PaginatedProgramList({
  programs,
  organization,
}: {
  programs: ProgramData;
  organization: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    website: string | null;
  };
}) {
  const currentPage = parseInt(useSearchParams().get("page") || "") || 0;
  const programsPerPage = 5;

  const indexOfLastProgram = (currentPage + 1) * programsPerPage;
  const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
  const currentPrograms = programs.slice(
    indexOfFirstProgram,
    indexOfLastProgram
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(programs.length / programsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div>
        <ul className="list-inside list-disc">
          {currentPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={{ ...program, organization }}
            />
          ))}
        </ul>
      </div>
      {pageNumbers.length >= 2 && (
        <div className="mb-4 flex flex-row flex-wrap">
          {pageNumbers.length >= 3 && <FirstPageButton />}
          <PreviousPageButton />

          {pageNumbers.map((pageNumber) => ( <NumberedPageButton pageNumber={pageNumber} key={pageNumber} />
          ))}

          <NextPageButton lastPage={pageNumbers.length - 1} />
          {pageNumbers.length >= 3 && (
            <LastPageButton lastPage={pageNumbers.length - 1} />
          )}
        </div>
      )}
    </>
  );
}

const CategoryButton = ({
  category,
}: {
  category:
    | {
        category: string;
        slug: string;
      }
    | undefined;
}) => {
  const pathname = usePathname();

  const currentCategory = useSearchParams().get("category");

  const url = new URL(pathname, window.location.origin);

  if (category?.slug) url.searchParams.set("category", category.slug);

  if (!category) {
    // Handle All Programs Button
    return (
      <Link
        className={twMerge(
          `hover:text-bold mb-2 mr-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-2 font-medium text-rose-500 shadow-sm hover:bg-rose-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2`,
          currentCategory === null &&
            `bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500`
        )}
        href={{
          pathname: url.pathname,
        }}
        replace
      >
        All Programs
      </Link>
    );
  }

  return (
    <Link
      key={category.slug}
      className={twMerge(
        `hover:text-bold mb-2 mr-2 rounded-md border border-rose-200 bg-rose-50 px-4 py-2 font-medium text-rose-500 shadow-sm hover:bg-rose-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2`,
        currentCategory === category.slug &&
          `bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500`
      )}
      href={{
        pathname: url.pathname,
        query: { category: category.slug },
      }}
      replace
    >
      {category.category}
    </Link>
  );
};

function ProgramSection({
  programs,
  organization,
}: {
  programs: ProgramData;
  organization: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    website: string | null;
  };
}) {
  //const router  = useRouter()
  // const searchParams = useSearchParams()

  //const category = searchParams?.get('category')
  //const page = parseInt( searchParams?.get('page') || '0')

  const categoryMap = new Map<string, Record<"category" | "slug", string>>();

  programs.forEach((program) => {
    categoryMap.set(program.categoryMeta.slug, {
      category: program.category,
      slug: program.categoryMeta.slug,
    });
  });

  const categories = programs.map((program) => program.categoryMeta.slug);

  const uniqueCategories = [...new Set(categories)];

  const currentCategory = useSearchParams().get("category");


  return (
    <div>
      {programs.length > 0 && (
        <div className="mx-6">
          <h2 className="mb-4 mt-12 text-3xl font-bold text-stone-500">
            Programs
          </h2>
          {uniqueCategories.length > 1 && (
            <div className="mb-4 flex flex-row flex-wrap">
              <CategoryButton category={undefined} />

              {uniqueCategories.map((category) => (
                <CategoryButton
                  key={category}
                  category={categoryMap.get(category)}
                />
              ))}
            </div>
          )}
          <PaginatedProgramList
            programs={
              !currentCategory
                ? programs
                : programs.filter(
                    (program) =>
                      program.categoryMeta.slug === currentCategory ||
                      currentCategory === "All Categories"
                  )
            }
            organization={organization}
          />
        </div>
      )}
    </div>
  );
}

export default ProgramSection;
