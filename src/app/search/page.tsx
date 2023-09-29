import React from "react";
import { SearchComponent } from "./SearchComponent";
import { fetchAllOrgs } from "../_components/organization/utils/fetchAllOrgs";
import type  { Program } from "@prisma/client";

export type OrganizationSearchListProps = 
  Awaited<ReturnType<typeof fetchAllOrgs>>

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

  return (
    <div>
      <h1>Search</h1>
      <SearchComponent searchOptions={orgs} />
    </div>
  );
}

export default Page;
