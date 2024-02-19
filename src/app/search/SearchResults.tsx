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
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);


  const maxPage = Math.ceil(searchOptions.length / pageLength);

  const start = (page - 1) * pageLength;
  const end = page * pageLength;

  const pageOptions = searchOptions.slice(start, end);

  return (
    <div ref={parent}>
      {pageOptions
        .sort((orgA, orgB) => {
          const programTagsA = orgA.programs.flatMap((program) =>
            program.tags.map((tag) => tag.tag)
          );
          const allTagsA = [...orgA.tags.map((tag) => tag.tag), ...programTagsA]; 

          const orgAFavoritesTags = allTagsA.filter((tag) => favoriteTags.has(tag));

          const programTagsB = orgB.programs.flatMap((program) =>
            program.tags.map((tag) => tag.tag)
          );
          const allTagsB = [...orgB.tags.map((tag) => tag.tag), ...programTagsB]; 

          const orgBFavoritesTags = allTagsB.filter((tag) => favoriteTags.has(tag));


         if(orgB.name === "3Rivers") console.log(allTagsB)

          return orgBFavoritesTags.length - orgAFavoritesTags.length;
 
        })
        .map((org) => (
          <OrganizationCard
            org={org}
            key={org.id}
            search={searchTerm}
            programInclude={programInclude}
            hightlightPrograms={orgInclude.programs}
            favoriteTags={favoriteTags}
          />
        ))}
      <Pagination setPage={setPage} page={page} maxPage={maxPage} />
    </div>
  );
};
