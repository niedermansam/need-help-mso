"use client";
import React, { useEffect, useRef, useState } from "react";
import type { OrganizationSearchListProps } from "./page";
import { OrganizationCard } from "../../components/DisplayCard/server";
import autoAnimate from "@formkit/auto-animate";
import { Pagination } from "./Pagination";
import { faV } from "@fortawesome/free-solid-svg-icons";

export const SearchResults = ({
  searchOptions,
  searchTerm,
  programInclude,
  orgInclude,
  favoriteTags,
  hiddenTags,
}: {
  favoriteTags: Set<string>;
  hiddenTags: Set<string>;
  searchOptions: OrganizationSearchListProps;
  searchTerm: string;
  programInclude: {
    name: boolean;
    description: boolean;
    tags: boolean;
    category: boolean;
  };
  orgInclude: {
    name: boolean;
    description: boolean;
    tags: boolean;
    categories: boolean;
    programs: boolean;
  };
}) => {
  const pageLength = 10;
  const [page, setPage] = useState(1);
  const parent = useRef(null);
  const [visibleOrgs, setVisibleOrgs] = useState(searchOptions);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);


  const maxPage = Math.ceil(searchOptions.length / pageLength);

  const start = (page - 1) * pageLength;
  const end = page * pageLength;

  useEffect(() => {

    console.log('filtering')

  const pageOptions = searchOptions
        .sort((orgA, orgB) => {
          const programTagsA = orgA.programs.flatMap((program) =>
            program.tags.map((tag) => tag.tag)
          );
          const allTagsA = [...orgA.tags.map((tag) => tag.tag), ...programTagsA].filter(
            tag => hiddenTags.has(tag) === false
          ); 

          const orgAFavoritesTags = allTagsA.filter((tag) => favoriteTags.has(tag));

          const programTagsB = orgB.programs.flatMap((program) =>
            program.tags.map((tag) => tag.tag)
          );
          const allTagsB = [...orgB.tags.map((tag) => tag.tag), ...programTagsB].filter(
            tag => hiddenTags.has(tag) === false
          
          ); 

          const orgBFavoritesTags = allTagsB.filter((tag) => favoriteTags.has(tag));

          

          if(orgAFavoritesTags.length > orgBFavoritesTags.length) {
            return -1;
          } else if(orgAFavoritesTags.length < orgBFavoritesTags.length) {
            return 1;
          } else {
            return 0;
          }
 
        }).slice(start, end);

    setVisibleOrgs(pageOptions);

  },
  [searchOptions, favoriteTags, hiddenTags, page, pageLength, end, start]);


  return (
    <div ref={parent}>
      {visibleOrgs
        .map((org) => (
          <OrganizationCard
            org={org}
            key={org.id}
            search={searchTerm}
            programInclude={programInclude}
            hightlightPrograms={orgInclude.programs}
            tagOptions={{ selected: favoriteTags, hidden: hiddenTags }}
          />
        ))}
      <Pagination setPage={setPage} page={page} maxPage={maxPage} />
    </div>
  );
};
