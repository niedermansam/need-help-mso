"use client";
import React, { useState } from "react";
import type { OrganizationSearchListProps } from "./page";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

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
      placeholder="Search for organizations and programs..."
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
  className = " font-light grid grid-cols-[2rem_1fr] gap-2",
}: {
  className?: string;
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
    <div className={className}> 
        <label className=" col-span-2 font-bold tracking-tight text-stone-500">
          Include in Search:
        </label> 

        <input
          type="checkbox"
          className="size-4"
          checked={orgInclude.name}
          onChange={(e) =>
            setOrgInclude({ ...orgInclude, name: e.target.checked })
          }
        />
        <label htmlFor="name">Name</label>
        
        <input
          type="checkbox"
          className="size-4"
          checked={orgInclude.description}
          onChange={(e) =>
            setOrgInclude({ ...orgInclude, description: e.target.checked })
          }
        />
        <label htmlFor="description">Description</label>
        <input
          type="checkbox"
          className="size-4"
          checked={orgInclude.tags}
          onChange={(e) =>
            setOrgInclude({ ...orgInclude, tags: e.target.checked })
          }
        />
          <label htmlFor="tags">Tags</label>
        <input
          type="checkbox"
          className="size-4"
          checked={orgInclude.categories}
          onChange={(e) =>
            setOrgInclude({ ...orgInclude, categories: e.target.checked })
          }
        />
          <label htmlFor="categories">Categories</label>
        <input
          type="checkbox"
          className="size-4"
          checked={orgInclude.programs}
          onChange={(e) =>
            setOrgInclude({ ...orgInclude, programs: e.target.checked })
          }
        /> 
          <label htmlFor="programs">Programs</label>
      {orgInclude.programs && (
        <>
          <label className="col-span-2 font-bold tracking-tight text-stone-500">
            Program search:
          </label>
          <input
            type="checkbox"
            className="size-4"
            checked={programInclude.name}
            onChange={(e) =>
              setProgramInclude({ ...programInclude, name: e.target.checked })
            }
          />
            <label htmlFor="name">Name</label>
          <input
            type="checkbox"
            className="size-4"
            checked={programInclude.description}
            onChange={(e) =>
              setProgramInclude({
                ...programInclude,
                description: e.target.checked,
              })
            }
          />
            <label htmlFor="description">Description</label>
          <input
            type="checkbox"
            className="size-4"
            checked={programInclude.tags}
            onChange={(e) =>
              setProgramInclude({ ...programInclude, tags: e.target.checked })
            }
          />
              <label htmlFor="tags">Tags</label>
          <input
            type="checkbox"
            className="size-4"
            checked={programInclude.category}
            onChange={(e) =>
              setProgramInclude({
                ...programInclude,
                category: e.target.checked,
              })
            }
          /> 
            <label htmlFor="category">Category</label>
        </>
      )}
    </div>
  );
}


export function SearchOptionsPopover (
  {
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
  }
) {


  return ( <Popover>
    <PopoverTrigger> 
      <Button
        variant={"secondary"} 
        className="mr-2 font-bold text-sm text-stone-500 "
      >
        <Settings className="h-5 w-5 mr-1" />
        Search Options</Button>
    </PopoverTrigger>
    <PopoverContent>
      <SearchOptionsBar
        orgInclude={orgInclude}
        setOrgInclude={setOrgInclude}
        programInclude={programInclude}
        setProgramInclude={setProgramInclude}
      />
    </PopoverContent>
  </Popover>
  )


}