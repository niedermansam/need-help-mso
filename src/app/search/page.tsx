import React from "react";
import { OrganizationSearchPage } from "./SearchPage";
import { fetchAllOrgs } from "../../components/organization/utils/fetchAllOrgs";
import type { Program } from "@prisma/client";

export type OrganizationSearchListProps = Awaited<
  ReturnType<typeof fetchAllOrgs>
>;

export type OrganizationSearchProps = Pick<
  OrganizationSearchListProps[number],
  "categories" | "tags" | "category" | "description" | "name"
> & {
  programs: (Pick<Program, "name" | "description" | "category"> & {
    tags: {
      tag: string;
    }[];
  } & {
    exclusiveToCommunities: {
      name: string;
    }[];
  })[];
};
async function Page() {
  const orgs = await fetchAllOrgs();

  const tagsArr = orgs.flatMap((org) => {
    const programTags = org.programs.flatMap((program) =>
      program.tags.map((tag) => tag.tag)
    );
    return [...org.tags.map((tag) => tag.tag), ...programTags];
  });
  const tags = new Set(tagsArr);

  return (
    <div>
      <h1>Search</h1>
      <OrganizationSearchPage searchOptions={orgs} availableTags={tags} />
    </div>
  );
}

export default Page;
