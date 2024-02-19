"use client";
import React, { useState } from "react";
import type { OrganizationSearchListProps } from "./page";

export const SearchBar = ({
  searchInput,
  setSearchInput,
}: {
  searchOptions: OrganizationSearchListProps;
  searchInput: string;
  setSearchInput: (searchInput: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState(searchInput);
  return (
    <input
      type="text"
      className="w-full rounded-md border border-gray-300 p-2"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setTimeout(() => {
          setSearchInput(e.target.value);
        }, 300);
      }}
    />
  );
};
export function SearchOptionsBar({
  orgInclude,
  setOrgInclude,
  programInclude,
  setProgramInclude,
}: {
  orgInclude: {
    name: boolean;
    description: boolean;
    tags: boolean;
    categories: boolean;
    programs: boolean;
  };
  programInclude: {
    name: boolean;
    description: boolean;
    tags: boolean;
    category: boolean;
  };
  setOrgInclude: (orgInclude: {
    name: boolean;
    description: boolean;
    tags: boolean;
    categories: boolean;
    programs: boolean;
  }) => void;

  setProgramInclude: (programInclude: {
    name: boolean;
    description: boolean;
    tags: boolean;
    category: boolean;
  }) => void;
}) {
  return (
    <div>
      {" "}
      <div className="flex [&_input]:ml-4 [&_input]:mr-0.5">
        <label className="font-bold tracking-tight text-stone-500">
          Include in Search:
        </label>
        <input
          type="checkbox"
          checked={orgInclude.name}
          onChange={(e) =>
            setOrgInclude({ ...orgInclude, name: e.target.checked })
          }
        />
        Name
        <input
          type="checkbox"
          checked={orgInclude.description}
          onChange={(e) =>
            setOrgInclude({ ...orgInclude, description: e.target.checked })
          }
        />
        Description
        <input
          type="checkbox"
          checked={orgInclude.tags}
          onChange={(e) =>
            setOrgInclude({ ...orgInclude, tags: e.target.checked })
          }
        />
        Tags
        <input
          type="checkbox"
          checked={orgInclude.categories}
          onChange={(e) =>
            setOrgInclude({ ...orgInclude, categories: e.target.checked })
          }
        />
        Categories
        <input
          type="checkbox"
          checked={orgInclude.programs}
          onChange={(e) =>
            setOrgInclude({ ...orgInclude, programs: e.target.checked })
          }
        />
        Programs
      </div>
      {orgInclude.programs && (
        <div className="flex [&_input]:ml-4 [&_input]:mr-0.5">
          <label className="font-bold tracking-tight text-stone-500">
            Program search:
          </label>
          <input
            type="checkbox"
            checked={programInclude.name}
            onChange={(e) =>
              setProgramInclude({ ...programInclude, name: e.target.checked })
            }
          />
          Name
          <input
            type="checkbox"
            checked={programInclude.description}
            onChange={(e) =>
              setProgramInclude({
                ...programInclude,
                description: e.target.checked,
              })
            }
          />
          Description
          <input
            type="checkbox"
            checked={programInclude.tags}
            onChange={(e) =>
              setProgramInclude({ ...programInclude, tags: e.target.checked })
            }
          />
          Tags
          <input
            type="checkbox"
            checked={programInclude.category}
            onChange={(e) =>
              setProgramInclude({
                ...programInclude,
                category: e.target.checked,
              })
            }
          />
          Category
        </div>
      )}
    </div>
  );
}
