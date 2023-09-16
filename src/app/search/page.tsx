import { prisma } from "@/server/db";
import React from "react";
import { OrganizationCard } from "../_components/DisplayCard/server";
import { Return } from "@prisma/client/runtime/library";
import { SearchComponent } from "./SearchComponent";
import { fetchAllOrgs } from "../_components/organization/utils/fetchAllOrgs";

export type OrganizationSearchProps = Awaited<ReturnType<typeof fetchAllOrgs>>;

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
