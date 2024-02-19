// import type { Organization } from '@prisma/client'
import React from "react";
// import { SITE_URL } from '@/utils/constants'
// import type { Organization } from '@prisma/client'
import { BackButton } from "@/components/BackButton";
import { SearchPage } from "@/app/search/SearchPage";
import { fetchAllOrgs } from "@/components/organization/utils/fetchAllOrgs";
import { MapLink } from "@/components/organization/CategorySection";

async function OrganizationPage() {
  const orgs = await fetchAllOrgs();

  const tagsArr = orgs.flatMap((org) => {
    const programTags = org.programs.flatMap((program) =>
      program.tags.map((tag) => tag.tag)
    );
    return [...org.tags.map((tag) => tag.tag), ...programTags];
  }).sort(
    (a, b) => a.localeCompare(b)
  
  );

  const tags = new Set(tagsArr);
 

  return (
    <div>
      <h1 className="flex items-center gap-2 text-4xl font-bold  text-stone-700">
        {" "}
        <BackButton /> All Organizations <MapLink slug={"all"} />
      </h1>
      <SearchPage searchOptions={orgs} availableTags={tags} />
    </div>
  );
}

export default OrganizationPage;
