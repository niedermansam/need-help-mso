"use client";
import React, { useEffect, useState } from "react";
import type { OrganizationSearchListProps, OrganizationSearchProps } from "./page";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchResults } from "./SearchResults";
import { organizationIsInSearch } from "./organizationIsInSearch";
import { SearchBar, SearchOptionsBar, SearchOptionsPopover } from "./SearchBar";

import { TagSelectSection } from "./TagSelectSection";

export const OrganizationSearchPage = ({
  searchOptions,
  availableTags,
  OrgCard,
  resultsPerPage,
}: {
  searchOptions: OrganizationSearchListProps;
  availableTags: Set<string>;
  OrgCard?: (org: OrganizationSearchListProps[number]) => JSX.Element;
  resultsPerPage?: number;
}) => {
 
  // const router = useRouter();
  const searchParams = useSearchParams();

  const searchQuery = searchParams?.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [displayOrgs, setDisplayOrgs] = useState(searchOptions);
  const [orgInclude, setOrgInclude] = useState({
    name: true,
    description: true,
    tags: false,
    categories: true,
    programs: true,
  });

  const [programInclude, setProgramInclude] = useState({
    name: true,
    description: false,
    tags: false,
    category: true,
  });

  const [tagOptions, setTagOptions] = useState({
    selected: new Set<string>(),
    hidden: new Set<string>(),
  });

  const [visibleTags, setVisibleTags] = useState(availableTags);

  useEffect(() => {
    const newDisplayOrgs = searchOptions.filter((org) => {
      return organizationIsInSearch(
        org,
        searchTerm,
        orgInclude,
        programInclude,
        tagOptions
      );
    });

    const allTagsArr = newDisplayOrgs.flatMap((org) => {
      const programTags = org.programs.flatMap((program) =>
        program.tags.map((tag) => tag.tag)
      );
      return [...org.tags.map((tag) => tag.tag), ...programTags];
    });

    const allTags = new Set(allTagsArr);

    const newVisibleTags = new Set([...allTags]);

    setVisibleTags(newVisibleTags);

    setDisplayOrgs(newDisplayOrgs);

    // if (searchTerm === "") {
    //   router.replace("?");
    //   return;
    // } else {
    //   router.replace(`?q=${searchTerm}`);
    // }
  }, [
    searchTerm,
    searchOptions,
    // router,
    orgInclude,
    programInclude,
    tagOptions,
  ]);

  return (
    <div>
      <div id="top" className="grid grid-cols-[1fr_auto] gap-2">
        <SearchBar
          searchOptions={searchOptions}
          searchInput={searchTerm}
          setSearchInput={setSearchTerm}
        />
        <SearchOptionsPopover
          orgInclude={orgInclude}
          setOrgInclude={setOrgInclude}
          programInclude={programInclude}
          setProgramInclude={setProgramInclude}
        />
      </div>
      <TagSelectSection
        tags={visibleTags}
        tagOptions={tagOptions}
        setTagOptions={setTagOptions}
      />
      <SearchResults
        searchOptions={displayOrgs}
        searchTerm={searchTerm}
        programInclude={programInclude}
        orgInclude={orgInclude}
        favoriteTags={tagOptions.selected}
        hiddenTags={tagOptions.hidden}
        OrgCard={OrgCard}
        resultsPerPage={resultsPerPage}
      />
    </div>
  );
};
