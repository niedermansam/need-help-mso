"use client";
import Link from "next/link";
import React, { useState } from "react";
import { CategoryTag } from "./server";
import ReactModal from "react-modal";
import { twMerge } from "tailwind-merge";
import { programHasSearchTerm } from "@/app/search/organizationIsInSearch";
import { Program } from "@prisma/client";
import { HighlightedText } from "@/app/test/HighlightedText";

export function ProgramModal({
  program,
  search,
  include,
  highlight,
  tagOptions,
}: {
  tagOptions: {
    selected: Set<string>;
    hidden: Set<string>;
  };
  program: Pick<
    Program,
    | "name"
    | "category"
    | "description"
    | "phone"
    | "url"
    | "id"
    | "organizationId"
  > & {
    exclusiveToCommunities: { name: string }[];
    helpfulToCommunities: { name: string }[];
  } & {
    tags: {
      tag: string;
    }[];
  };
  search?: string;
  include: {
    name: boolean;
    description: boolean;
    tags: boolean;
    category: boolean;
  };
  highlight: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const programTags = program.tags.map((tag) => tag.tag);

  const favoriteTagsInProgram = programTags.filter((tag) =>
    tagOptions.selected.has(tag)
  );

  const hiddenTagInProgram = programTags.filter((tag) =>
    tagOptions.hidden.has(tag)
  );

  if (hiddenTagInProgram.length > 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={twMerge(
          "group relative w-fit  rounded border px-2 py-1 text-sm hover:bg-rose-300 hover:text-stone-800",
          highlight && programHasSearchTerm(program, search, include)
            ? "bg-rose-500 text-white  hover:bg-rose-700 hover:text-white"
            : "border-stone-200 text-stone-500"
        )}
      >
        {favoriteTagsInProgram.length > 0 && (
          <div className="absolute -top-2 right-3 z-50 h-fit w-fit translate-x-full rounded-full bg-green-600 p-px text-white group-hover:z-[51]">
            <div className="flex h-4 w-4 items-center  justify-center   overflow-hidden group-hover:h-fit group-hover:w-fit group-focus:h-fit group-focus:w-fit">
              <span className="mx-1">{favoriteTagsInProgram.length}</span>
              <span
                className="hidden  w-full items-center   justify-center    p-px   pr-1 text-xs leading-none text-white group-hover:flex group-focus:flex"
                style={{
                  minWidth: "max-content",
                }}
              >
                {favoriteTagsInProgram.join(", ")}
              </span>
            </div>
          </div>
        )}
        <HighlightedText text={program.name} highlight={search} />
      </button>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="absolute  left-1/2 top-1/2 z-[10001] block w-[60%] -translate-x-1/2 -translate-y-1/2 transform flex-col rounded bg-white p-4 shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000] fixed inset-0"
      >
        <h2 className="text-2xl font-bold">
          <HighlightedText text={program.name} highlight={search} />
        </h2>
        {program.phone && <p>{program.phone}</p>}

        <CategoryTag
          category={program.category}
          tags={program.tags.map((tag) => tag.tag)}
        />

        {program.exclusiveToCommunities.length > 0 && (
          <p>
            Exclusive to{" "}
            {program.exclusiveToCommunities.map((x) => x.name).join(", ")}
          </p>
        )}
        <p className="text-sm font-light">
          <HighlightedText
            text={program.description ?? ""}
            highlight={search}
          />
        </p>
        {program.url && (
          <Link
            href={program.url}
            className="text-rose-500 hover:text-rose-600"
            target="_blank"
          >
            Visit Site
          </Link>
        )}
        <button
          onClick={() => setIsOpen(false)}
          className="rounded border border-stone-200 bg-stone-50 px-2 py-1 text-sm"
        >
          Close
        </button>
      </ReactModal>
    </>
  );
}
