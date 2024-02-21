"use client";
import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ArrowUp, Eye, EyeOff, ChevronsUpDown, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function SelectTagButton({
  selected,
  onClick,
}: {
  selected: boolean;
  onClick: () => void;
}) {
  if (selected) {
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
  onClick,
}: {
  hidden: boolean;
  onClick: () => void;
}) {
  if (hidden) {
    return (
      <Button
        variant={"destructive"}
        size={"xs"}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onClick();
          }
        }}
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
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onClick();
        }
      }}
    >
      <EyeOff className="h-4 w-4" />
    </Button>
  );
}

export function TagSelect({
  tags,
  tagOptions,
  setTagOptions,
}: {
  tags: Set<string>;
  tagOptions: {
    selected: Set<string>;
    hidden: Set<string>;
  };
  setTagOptions: React.Dispatch<
    React.SetStateAction<{
      selected: Set<string>;
      hidden: Set<string>;
    }>
  >;
}) {
  const [open, setOpen] = useState(false);

  const handleSelectedToggle = (tag: string) => {
    setTagOptions((prev) => {
      const newSelectedSet = new Set(prev.selected);
      const newHiddenSet = new Set(prev.hidden);
      if (newSelectedSet.has(tag)) {
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
  };

  const handleHiddenToggle = (tag: string) => {
    setTagOptions((prev) => {
      const newSelectedSet = new Set(prev.selected);
      const newHiddenSet = new Set(prev.hidden);
      if (newHiddenSet.has(tag)) {
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
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between font-extralight tracking-wide"
        >
          Highlight or Hide Tags...
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

export function TagSelectSection({
  tags,
  tagOptions,
  setTagOptions,
}: {
  tags: Set<string>;
  tagOptions: {
    selected: Set<string>;
    hidden: Set<string>;
  };
  setTagOptions: React.Dispatch<
    React.SetStateAction<{
      selected: Set<string>;
      hidden: Set<string>;
    }>
  >;
}) {
  return (
    <div className="my-2 flex">
      <TagSelect
        tags={tags}
        tagOptions={tagOptions}
        setTagOptions={setTagOptions}
      />
      <div className="ml-1 flex flex-col gap-2 gap-y-1">
        {tagOptions.selected.size > 0 && (
          <div className="flex flex-wrap gap-1 text-xs font-bold">
            <span className="tracking-tight">Selected Tags:</span>
            {Array.from(tagOptions.selected).map((tag) => (
              <span
                key={tag}
                className="flex items-center rounded-lg bg-green-600 px-2 text-xs font-medium text-white"
              >
                <button
                  className="m-0.5 -ml-1"
                  onClick={() => {
                    setTagOptions((prev) => {
                      const newSelectedSet = new Set(prev.selected);
                      newSelectedSet.delete(tag);
                      return {
                        hidden: prev.hidden,
                        selected: newSelectedSet,
                      };
                    });
                  }}
                >
                  <X className="h-3 w-3" />
                </button>

                {tag}
              </span>
            ))}
          </div>
        )}
        {tagOptions.hidden.size > 0 && (
          <div className="flex flex-wrap gap-1 text-xs font-bold">
            <span className="tracking-tight">Hidden Tags:</span>
            {Array.from(tagOptions.hidden).map((tag) => (
              <span
                key={tag}
                className="flex items-center rounded-lg bg-red-600 px-2 text-xs font-medium text-white"
              >
                <button
                  className="m-0.5 -ml-1"
                  onClick={() => {
                    setTagOptions((prev) => {
                      const newHiddenSet = new Set(prev.hidden);
                      newHiddenSet.delete(tag);
                      return {
                        hidden: newHiddenSet,
                        selected: prev.selected,
                      };
                    });
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
                {tag}
              </span>
            ))}
          </div>
        )}
        {tagOptions.hidden.size === 0 && tagOptions.selected.size === 0 && (
          <div className="text-xs py-1 ml-1 rounded border border-amber-300 bg-amber-100 text-amber-900 font-bold grid grid-cols-[auto_1fr] grid-rows-2 items-center gap-x-2.5 tracking-tight leading-tight px-2">
            <AlertTriangle className="size-6 row-span-2 text-amber-600 stroke-2" /> Tag filterings/sorting is currently under development.
            <span className="font-normal">
            Some organizations and programs may be incorrectly tagged. Please use caution when using this feature.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
