"use client";
import { api } from "@/utils/api";
import {
  useFavoriteOrgStore,
  useFavoriteProgramStore,
  useUserStore,
} from "@/utils/userStore";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import {
  faEdit,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { CategoryTag, type ProgramCardInformation } from "./server";
import ReactModal from "react-modal";
import { twMerge } from "tailwind-merge";

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
   loggedIn && <button
      className="flex h-8 w-8 items-center justify-center "
      onClick={handleClick}
    >
      <FontAwesomeIcon
        icon={isFavoriteOrg ? faStarSolid : faStar}
        className="text-gold-500 h-4 text-amber-400 "
      />
    </button>
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
    loggedIn && <button
      className="flex h-8 w-8 items-center justify-center "
      onClick={handleClick}
    >
      <FontAwesomeIcon
        icon={isFavoriteProgram ? faStarSolid : faStar}
        className="text-gold-500 h-4 text-amber-400 "
      />
    </button>
  );
}

function EditButton({ href }: { href: string }) {
  const admin = useUserStore((state) => state.admin);

  return admin ? (
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
        className={twMerge("flex w-32 items-center text-sm justify-center rounded bg-stone-200 text-stone-600", buttonClassName)}
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
