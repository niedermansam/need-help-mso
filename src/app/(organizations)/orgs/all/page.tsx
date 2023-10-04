// import type { Organization } from '@prisma/client'
import React from "react";
// import { SITE_URL } from '@/utils/constants'
// import type { Organization } from '@prisma/client'
import { BackButton } from "@/components/BackButton";
import { SearchComponent } from "@/app/search/SearchComponent";
import { fetchAllOrgs } from "@/components/organization/utils/fetchAllOrgs";

async function OrganizationPage() {
  const orgs = await fetchAllOrgs();
  return (
    <div>
      <h1 className="text-4xl font-bold text-stone-700">
        {" "}
        <BackButton /> All Organizations
      </h1>
      <SearchComponent searchOptions={orgs} />
    </div>
  );
}

export default OrganizationPage;
