import React from "react";
import { SearchComponent } from "./SearchComponent";
import { fetchAllOrgs } from "../_components/organization/utils/fetchAllOrgs";

export type OrganizationSearchListProps = 
  Awaited<ReturnType<typeof fetchAllOrgs>>

  export type OrganizationSearchProps = Pick<OrganizationSearchListProps[number], "categories" | "tags" | "category" | "description" | "name">
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
