"use client";
import { api } from "@/utils/api";
import {
  useFavoriteOrgStore,
  useFavoriteProgramStore,
  useUserStore,
  userHasPermission,
} from "@/utils/userStore";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import {
  faEdit,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";
import { CategoryTag, type ProgramCardInformation } from "./server";
import ReactModal from "react-modal";
import { twMerge } from "tailwind-merge";
import { programHasSearchTerm } from "@/app/search/organizationIsInSearch";
import { Program } from "@prisma/client";
import { HighlightedText } from "@/app/test/HighlightedText";

export function FavoriteOrgButton({ orgId }: { orgId: string }) {
  const favoriteOrgs = useFavoriteOrgStore((state) => state.favoriteOrgs);
  const loggedIn = useUserStore((state) => state.loggedIn);

  const toggleFavoriteOrg = useFavoriteOrgStore(
    (state) => state.toggleFavoriteOrg
  );
  const saveFavoriteToDb = api.user.toggleFavoriteOrganization.useMutation({});

  const isFavoriteOrg = favoriteOrgs.includes(orgId);

  const handleClick = () => {
    toggleFavoriteOrg(orgId);
    saveFavoriteToDb.mutate({
      organizationId: orgId,
      newState: !isFavoriteOrg,
    });
  };
  return (
    loggedIn && (
      <button
        className="flex h-8 w-8 items-center justify-center "
        onClick={handleClick}
      >
        <FontAwesomeIcon
          icon={isFavoriteOrg ? faStarSolid : faStar}
          className="text-gold-500 h-4 text-amber-400 "
        />
      </button>
    )
  );
}

export function FavoriteProgramButton({
  programId,
  programName,
}: {
  programId: string;
  programName: string;
}) {
  const favoritePrograms = useFavoriteProgramStore(
    (state) => state.favoritePrograms
  );
  const loggedIn = useUserStore((state) => state.loggedIn);

  const toggleFavoriteProgram = useFavoriteProgramStore(
    (state) => state.toggleFavoriteProgram
  );
  const saveFavoriteToDb = api.user.toggleFavoriteProgram.useMutation({});
  const isFavoriteProgram = favoritePrograms.includes(programId);

  const handleClick = () => {
    toggleFavoriteProgram(programId, programName);
    saveFavoriteToDb.mutate({
      programId: programId,
      newState: !isFavoriteProgram,
    });
  };
  return (
    loggedIn && (
      <button
        className="flex h-8 w-8 items-center justify-center "
        onClick={handleClick}
      >
        <FontAwesomeIcon
          icon={isFavoriteProgram ? faStarSolid : faStar}
          className="text-gold-500 h-4 text-amber-400 "
        />
      </button>
    )
  );
}

function EditButton({ href }: { href: string }) {
  const userRole = useUserStore((state) => state.role);

  const hasPermission = userHasPermission(userRole, "VOLUNTEER");

  return hasPermission ? (
    <Link href={href} className="mr-1">
      <FontAwesomeIcon
        className="text-stone-500 hover:text-rose-500"
        icon={faEdit}
      />
    </Link>
  ) : null;
}

export const EditOrgButton = ({ orgId }: { orgId: string }) => {
  return <EditButton href={`/admin/org/${orgId}`} />;
};
export const EditProgramButton = ({
  orgId,
  programId,
}: {
  orgId: string;
  programId: string;
}) => {
  return <EditButton href={`/admin/org/${orgId}/programs/${programId}`} />;
};

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "10%",
    bottom: "auto",
    marginRight: "-50%",
    width: "80%",
    transform: "translate(-50%, -50%)",
  },
};

export function ProgramDetailsModal({
  program,
  buttonClassName,
}: {
  program: ProgramCardInformation;
  buttonClassName?: string;
}) {
  const [showDetails, setShowDetails] = React.useState(false);

  const { name, description, url } = program;

  return (
    <>
      <button
        className={twMerge(
          "flex w-32 items-center justify-center rounded bg-stone-200 text-sm text-stone-600",
          buttonClassName
        )}
        onClick={() => setShowDetails(true)}
      >
        More Details
      </button>

      <ReactModal
        isOpen={showDetails}
        onRequestClose={() => setShowDetails(false)}
        style={modalStyles}
      >
        <div className="absolute flex w-full">
          <button
            onClick={() => setShowDetails(false)}
            className="absolute -top-1 right-12 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 px-1 py-1 text-white"
          >
            x
          </button>
        </div>
        <div className="flex flex-col justify-between px-8">
          <h2 className="text-2xl font-bold text-stone-700">{name}</h2>
          <CategoryTag
            category={program.category}
            tags={program.tags.map((tag) => tag.tag)}
          />
          {url && (
            <Link className="text-rose-500" href={url}>
              Official Website
            </Link>
          )}
          <p>{description}</p>
          <button
            className="mt-24  flex items-center justify-center rounded bg-rose-500 text-white"
            onClick={() => setShowDetails(false)}
          >
            Close
          </button>
        </div>
      </ReactModal>
    </>
  );
}
export function ProgramModal({
  program,
  search,
  include,
  highlight,
  favoriteTags,
}: {
  favoriteTags: Set<string>;
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
    favoriteTags.has(tag)
  );

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
          <div className="absolute -top-2 right-3 z-50 h-fit w-fit translate-x-full rounded-full bg-green-600 p-px text-white">
            <div className="flex h-4 w-4 items-center  justify-center   overflow-hidden group-hover:w-fit">
              <span className="mx-1">{favoriteTagsInProgram.length}</span>
              <span className="hidden  items-center justify-center   p-px    text-white   group-hover:flex pr-1">
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
