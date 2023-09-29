"use client";
import React, { useEffect, useState } from "react";
import type { OrganizationSearchListProps, OrganizationSearchProps } from "./page";
import { OrganizationCard } from "../_components/DisplayCard/server";
import { useRouter, useSearchParams } from "next/navigation";

export const SearchBar = ({
  searchInput,
  setSearchInput,
}: {
  searchOptions: OrganizationSearchListProps;
  searchInput: string;
  setSearchInput: (searchInput: string) => void;
}) => {
  return (
    <input
      type="text"
      className="w-full rounded-md border border-gray-300 p-2"
      placeholder="Search..."
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
    />
  );
};

export const PageButtons = ({
  setPage,
  page,
  maxPage,
}: {
  setPage: (page: number) => void;
  page: number;
  maxPage: number;
}) => {
  return (
    <div className="flex justify-center">
      <button
        className="m-2 rounded-md bg-gray-200 p-2"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      <span className="m-2 p-2">
        Page {page} of {maxPage}
      </span>
      <button
        className="m-2 rounded-md bg-gray-200 p-2"
        onClick={() => setPage(page + 1)}
        disabled={page === maxPage}
      >
        Next
      </button>
    </div>
  );
};

export const SearchResults = ({
  searchOptions,
  searchTerm,
}: {
  searchOptions: OrganizationSearchListProps;
  searchTerm: string;
}) => {
  const pageLength = 10;
  const [page, setPage] = useState(1);

  const maxPage = Math.ceil(searchOptions.length / pageLength);

  const start = (page - 1) * pageLength;
  const end = page * pageLength;

  const pageOptions = searchOptions.slice(start, end);

  return (
    <>
      {pageOptions.map((org) => (
        <OrganizationCard org={org} key={org.id} showDescription={true} search={searchTerm} />
      ))}
      <PageButtons setPage={setPage} page={page} maxPage={maxPage} />
    </>
  );
};


const filterOrganization = (org: OrganizationSearchProps, searchTerm: string) => {
  const nameMatch = org.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  const descriptionMatch = org.description
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const tagMatch = org.tags.some((tag) =>
    tag.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const categoryMatch = org.categories.some((category) =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const programMatch = org.programs.some((program) => {
    const nameMatch = program.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const descriptionMatch = program.description && program.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const tagMatch = program.tags.some((tag) =>
      tag.tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const categoryMatch = program.category
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return nameMatch || descriptionMatch || tagMatch || categoryMatch ;
  });

  return nameMatch || descriptionMatch || tagMatch || categoryMatch || programMatch;
}

export const programHasSearchTerm = (program: OrganizationSearchProps["programs"][0], searchTerm: string | undefined) => {
  if (!searchTerm) {
    return false;
  }
  const nameMatch = program.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  const descriptionMatch = program.description && program.description
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const tagMatch = program.tags.some((tag) =>
    tag.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const categoryMatch = program.category
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  return nameMatch || descriptionMatch || tagMatch || categoryMatch;
}


export const SearchComponent = ({
  searchOptions,
}: {
  searchOptions: OrganizationSearchListProps;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchQuery = searchParams?.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [displayOrgs, setDisplayOrgs] = useState(searchOptions);

  useEffect(() => {
    if (searchTerm === "") {
      setDisplayOrgs(searchOptions);
      return;
    }

    router.replace(`?q=${searchTerm}`);

    setDisplayOrgs(
      searchOptions.filter((org) => {
        return filterOrganization(org, searchTerm);
      })
    );
  }, [searchTerm, searchOptions, router]);

  return (
    <div>
      <SearchBar
        searchOptions={searchOptions}
        searchInput={searchTerm}
        setSearchInput={setSearchTerm}
      />
      <SearchResults searchOptions={displayOrgs} searchTerm={searchTerm} />
    </div>
  );
};
