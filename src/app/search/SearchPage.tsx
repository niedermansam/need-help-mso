"use client";
import React, { useEffect, useState } from "react";
import type { OrganizationSearchListProps } from "./page";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchResults } from "./SearchResults";
import { organizationIsInSearch } from "./organizationIsInSearch";
import { SearchBar, SearchOptionsBar } from "./SearchBar";
 
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Calendar, Smile, Calculator, User, CreditCard, Settings, ArrowUp, Eye, EyeOff, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function SelectTagButton({ 
  selected,
  onClick
}: { 
  selected: boolean;
  onClick: () => void;
}) {
  if(selected) {
    return (
      <Button
        variant={"green"}
        size={"xs"}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onClick();
          }
        }}
        className="mr-2  hover:bg-emerald-600/50"
      >
        <ArrowUp className="h-4 w-4 stroke-2" />
      </Button>
    );
  }
  return (
    <Button
      variant={"secondary"}
      size={"xs"}
      className="mr-2 hover:bg-emerald-50 hover:text-emerald-600"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onClick();
        }
      }}
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
}

function HideTagButton({  
  hidden,
  onClick
}: {
  hidden: boolean;
  onClick: () => void;
}) {
  if(hidden) {
    return (
      <Button
        variant={"destructive"}
        size={"xs"}
        onClick={onClick}
        onKeyDown={
          (e) => {
            if(e.key === "Enter") {
              onClick();
            }
          }
        }
        className="mr-2  hover:bg-red-500/50"
      >
        <Eye className="h-4 w-4 stroke-2" />
      </Button>
    );
  }
  return (
    <Button
      variant={"secondary"}
      size={"xs"}
      className="mr-2 hover:bg-red-50 hover:text-red-500"
      onClick={onClick}
      onKeyDown={
        (e) => {
          if(e.key === "Enter") {
            onClick();
          }
        }
      }
    >
      <EyeOff className="h-4 w-4" />
    </Button>
  );
}

export function TagSelect({
  tags ,
  tagOptions,
  setTagOptions,
}: {
  tags: Set<string>;
  tagOptions:  {
    selected: Set<string>;
    hidden: Set<string>;
  
  },
  setTagOptions: React.Dispatch<React.SetStateAction<{
    selected: Set<string>;
    hidden: Set<string>;
  }>>;
}) {

  const [open, setOpen] = useState(false);

  const handleSelectedToggle = (tag: string) => {
    setTagOptions((prev) => {
      const newSelectedSet = new Set(prev.selected);
      const newHiddenSet = new Set(prev.hidden);
      if(newSelectedSet.has(tag)) {
        newSelectedSet.delete(tag);
      } else {
        newSelectedSet.add(tag);
      newHiddenSet.delete(tag);
      }


      return {
        hidden: newHiddenSet,
        selected: newSelectedSet,
      };
    });
  }


  const handleHiddenToggle = (tag: string) => {
    setTagOptions((prev) => {
      const newSelectedSet = new Set(prev.selected);
      const newHiddenSet = new Set(prev.hidden);
      if(newHiddenSet.has(tag)) {
        newHiddenSet.delete(tag);
      } else {
        newHiddenSet.add(tag);
      newSelectedSet.delete(tag);
      }

      return {
        hidden: newHiddenSet,
        selected: newSelectedSet,
      };
    });
  }


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        > 
          Tags
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command className="max-w-lg rounded-lg border shadow-md">
          <CommandInput placeholder="Search for tags to highlight or hide..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {/* <CommandGroup heading="Favorites"></CommandGroup>
        {
          [...tagOptions.selected].map((tag) => (
            <CommandItem key={tag} className="grid grid-cols-[auto_1fr_auto] ">
              <SelectTagButton   
                selected={tagOptions.selected.has(tag)}
                onClick={() => handleSelectedToggle(tag)}
              />
              <span className=" justify-self-center">{tag}</span>
              <HideTagButton
                hidden={tagOptions.hidden.has(tag)}
                onClick= {() => handleHiddenToggle(tag)}
                
              />
            </CommandItem>
          ))

        }
        <CommandSeparator />
        <CommandGroup heading="Hidden"></CommandGroup>
        <CommandSeparator /> */}
            <CommandGroup heading="Tags">
              {Array.from(tags).map((tag) => (
                <CommandItem
                  key={tag}
                  className="grid grid-cols-[auto_1fr_auto] "
                >
                  <SelectTagButton
                    selected={tagOptions.selected.has(tag)}
                    onClick={() => handleSelectedToggle(tag)}
                  />
                  <span className=" justify-self-center">{tag}</span>
                  <HideTagButton
                    hidden={tagOptions.hidden.has(tag)}
                    onClick={() => handleHiddenToggle(tag)}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}


export const SearchPage = ({
  searchOptions,
  availableTags,
}: {
  searchOptions: OrganizationSearchListProps;
  availableTags: Set<string>;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchQuery = searchParams?.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [displayOrgs, setDisplayOrgs] = useState(searchOptions);
  const [orgInclude, setOrgInclude] = useState({
    name: true,
    description: false,
    tags: true,
    categories: true,
    programs: true,
  });

  const [tagOptions, setTagOptions] = useState({
    selected: new Set<string>(),
    hidden: new Set<string>(),
  })

  const [visibleTags, setVisibleTags] = useState(availableTags);

  const [programInclude, setProgramInclude] = useState({
    name: true,
    description: false,
    tags: true,
    category: true,
  });

  useEffect(() => {
    if (searchTerm === "") {
      setDisplayOrgs(searchOptions);
      return;
    }

    router.replace(`?q=${searchTerm}`);

    const newDisplayOrgs = searchOptions.filter((org) => {
      return organizationIsInSearch(
        org,
        searchTerm,
        orgInclude,
        programInclude
      );
    }
    );

    const allTagsArr  = newDisplayOrgs.flatMap((org) => {
      const programTags = org.programs.flatMap((program) =>
        program.tags.map((tag) => tag.tag)
      );
      return [...org.tags.map((tag) => tag.tag), ...programTags];
    }
    );

    const allTags = new Set(allTagsArr);

    const newVisibleTags = new Set([...allTags] );

    setVisibleTags(newVisibleTags);



    setDisplayOrgs( newDisplayOrgs); 
  }, [searchTerm, searchOptions, router, orgInclude, programInclude]);

  return (
    <div>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <SearchBar
          searchOptions={searchOptions}
          searchInput={searchTerm}
          setSearchInput={setSearchTerm}
        />
        <SearchOptionsBar
          orgInclude={orgInclude}
          setOrgInclude={setOrgInclude}
          programInclude={programInclude}
          setProgramInclude={setProgramInclude}
        />
      </div>
      <TagSelect tags={visibleTags} tagOptions={tagOptions} 
        setTagOptions={setTagOptions}
      />
      {displayOrgs.length} Organizations (out of {searchOptions.length})
      <SearchResults
        searchOptions={displayOrgs}
        searchTerm={searchTerm}
        programInclude={programInclude}
        orgInclude={orgInclude}
        favoriteTags={tagOptions.selected}
        hiddenTags={tagOptions.hidden}
      />
    </div>
  );
};


 