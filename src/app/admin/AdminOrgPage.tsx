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
        ? orgs.filter((org) => org.adminVerified)
        : orgs.filter((org) => !org.adminVerified)
    );
  };


  
  return (<div>
      <input type="checkbox" checked={showVerifiedOrgs} onChange={handleToggleVerified} />
      <label>Verified</label>

      <OrganizationSearchPage
        searchOptions={displayOrgs}
        availableTags={tags}
        OrgCard={AdminOrgCard}
        resultsPerPage={Infinity}
      />
  </div>
  );
};
