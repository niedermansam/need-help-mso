'use client';
import React, { useState } from "react";
import { fetchAllOrgs } from "@/components/organization/utils/fetchAllOrgs";
import { OrganizationSearchPage } from "../search/SearchPage";
import { AdminOrgCard } from "./AdminOrgCard";

export const AdminOrgPage = ({
  orgs,
  tags,
}: {
  orgs: Awaited<ReturnType<typeof fetchAllOrgs>>;
  tags: Set<string>;
}) => {
  const [showVerifiedOrgs, setShowVerifiedOrgs] = useState(false);

  const [displayOrgs, setDisplayOrgs] = useState(orgs);

  const handleToggleVerified = () => {
    setShowVerifiedOrgs(!showVerifiedOrgs);
    setDisplayOrgs(
      showVerifiedOrgs
        ? orgs 
        : orgs.filter((org) => !org.adminVerified)
    );
  };


  
  return (<div><div className="flex items-center">
    
        <input type="checkbox" checked={showVerifiedOrgs} onChange={handleToggleVerified} />
        <label className="ml-1 text-sm font-bold tracking-tight text-stone-600"
          onClick={handleToggleVerified}
        >
          Hide Verified Orgs
        </label>
  </div>

      <OrganizationSearchPage
        searchOptions={displayOrgs}
        availableTags={tags}
        OrgCard={AdminOrgCard}
        resultsPerPage={Infinity}
      />
  </div>
  );
};
