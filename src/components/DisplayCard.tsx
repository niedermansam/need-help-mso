"use client";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { ContactIcons, ContactInfo } from "./ContactInfo";
import { TagList } from "./Tags";
import type { Organization, Program, Tag } from "@prisma/client";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { api } from "../utils/api";
import { useEffect, useState } from "react";
import { UpdateProgramModal } from "@/app/admin/org/[id]/programs/ProgramForm";

export type ProgramCardInformation = Pick<
  Program,
  "name" | "id" | "url" | "category" | "organizationId"
> & {
  organization: {
    name: string;
    phone: string | null;
    email: string | null;
    website: string | null;
  };
  tags: Pick<Tag, "tag">[];
};

type ProgramCardProps = {
  program: ProgramCardInformation;
  favoritesArray: string[];
  showOrg?: boolean;
  admin?: boolean;
  loggedIn?: boolean;
};

export function ProgramCard({
  program,
  favoritesArray,
  loggedIn,
  showOrg = true,
  admin,
}: ProgramCardProps) {
  const programName = program.name;
  const orgName = program.organization.name;

  const orgId = program.organizationId;
  const programId = program.id;

  const phone = program.organization.phone;
  const email = program.organization.email;
  const website = program.url || program.organization.website;

  const [isFavoriteProgram, setIsFavoriteProgram] = useState(
    favoritesArray.includes(programId)
  );

  useEffect(() => {
    setIsFavoriteProgram(favoritesArray.includes(programId));
  }, [favoritesArray, programId]);

  const toggleFavorite = api.user.toggleFavoriteProgram.useMutation({
    onMutate: ({ newState }) => setIsFavoriteProgram(newState),
    onSettled: (data, err, input) => {
      const oldState = !input.newState;
      if (err || data === undefined) return setIsFavoriteProgram(oldState);
    },
  });
  return (
    <CardWrapper>
      <div className="flex w-full flex-wrap items-center justify-center px-2 text-center md:col-span-4 lg:col-span-3 lg:ml-4 lg:justify-start lg:text-left">
        <div className="truncate">
          {showOrg && (
            <Link href={`/org/${orgId}`}>
              <h3 className="truncate text-xl font-light hover:text-rose-600  md:text-lg">
                {orgName}
              </h3>
            </Link>
          )}
          <div className="flex">
            {admin && (
              <Link href={`/program/${programId}/edit`} className="">
                <FontAwesomeIcon
                  className="mr-1 text-stone-500 hover:text-rose-500"
                  icon={faEdit}
                />
              </Link>
            )}
            <Link
              href={`/program/${programId}`}
              className="hover:text-rose-500"
            >
              <h2 className="mb-2 truncate text-2xl font-bold tracking-tight text-stone-600 hover:text-rose-500 md:text-xl">
                {programName}
              </h2>
            </Link>
          </div>
        </div>
        <ContactIconSection phone={phone} email={email} website={website} />
      </div>
      <DesktopContactInfo phone={phone} email={email} website={website} />
      <CategoryTagSection category={program.category} tags={program.tags} />
      <div className="mt-4 flex items-center justify-center xs:row-span-2 md:col-span-2 md:row-span-1 md:mt-0">
        {loggedIn && (
          <button
            onClick={() =>
              toggleFavorite.mutate({
                programId,
                newState: !isFavoriteProgram,
              })
            }
            className="mr-1 flex h-4 items-center justify-center"
          >
            <FontAwesomeIcon
              icon={isFavoriteProgram ? faStarSolid : faStar}
              className="text-gold-500 h-4 text-amber-400 "
            />
          </button>
        )}
        <Link
          className="mr-2 flex w-1/2 justify-center justify-self-center rounded border border-rose-500 bg-rose-500 py-1.5 font-bold text-white shadow-md sm:w-2/3 md:w-32"
          href={`/program/${program.id}`}
        >
          More Info
        </Link>
        <UpdateProgramModal program={{...program,  tags: program.tags.map(x => x.tag)}} />
      </div>
    </CardWrapper>
  );
}



const DesktopContactInfo = ({
  phone,
  email,
  website,
}: {
  phone: string | null;
  email: string | null;
  website: string | null;
}) => {
  return (
    <div className="ml-2 hidden items-center pt-2 lg:col-span-2 lg:flex">
      <ContactInfo phone={phone} email={email} website={website} />
    </div>
  );
};

const CardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-4 my-4 grid w-full max-w-7xl auto-rows-min grid-cols-1 rounded border border-stone-200 py-2 pb-4 shadow xs:grid-cols-2 md:grid-cols-12 md:pb-2">
      {children}
    </div>
  );
};
const ContactIconSection = ({
  phone,
  email,
  website,
}: {
  phone: string | null;
  email: string | null;
  website: string | null;
}) => {
  return (
    <div className="flex w-full items-center justify-center px-2 text-center md:col-span-4 lg:col-span-3 lg:ml-4 lg:justify-start lg:text-left">
      <ContactIcons
        className="mt-2 w-full justify-center md:mt-1 lg:hidden"
        phone={phone}
        email={email}
        website={website}
      />
    </div>
  );
};
const CategoryTagSection = ({
  category,
  tags,
}: {
  category: string;
  tags: { tag: string }[];
}) => {
  return (
    <div className="flex h-fit flex-col xs:row-span-2 xs:mt-4 md:col-span-6 md:row-span-1 md:mt-0 lg:col-span-5">
      <p className=" my-2 w-full px-4 text-base md:mt-0 lg:mt-0">
        <span className="mr-1 w-full text-center font-light"> Category: </span>
        <Link
          href={`/cat/${category}`}
          className="font-bold text-stone-500 hover:text-rose-500"
        >
          {category}
        </Link>
      </p>
      <div className="flex max-h-[48px] px-4">
        <p className="mb-0.5 mr-2 w-16 font-light"> Tags: </p>
        <TagList className="overflow-y-auto" tags={tags} />
      </div>
    </div>
  );
};

export type OrgCardProps = Pick<
  Organization,
  "id" | "name" | "phone" | "email" | "website" | "category"
> & {
  tags: { tag: string }[];
};

export function OrganizationCard({
  org,
  admin,
  loggedIn,
  favoriteIds,
}: {
  org: OrgCardProps;
  admin: boolean;
  loggedIn: boolean;
  favoriteIds: string[];
}) {
  const orgId = org.id;
  const [isFavoriteOrg, setIsFavoriteOrg] = useState(
    favoriteIds.includes(orgId)
  );

  useEffect(() => {
    setIsFavoriteOrg(favoriteIds.includes(orgId));
  }, [favoriteIds, orgId]);

  const toggleFavorite = api.user.toggleFavoriteOrganization.useMutation({
    onMutate: ({ newState }) => setIsFavoriteOrg(newState),
    onSettled: (data, err, input) => {
      const oldState = !input.newState;
      if (err || data === undefined) return setIsFavoriteOrg(oldState);
    },
  });
  return (
    <CardWrapper>
      <div className="flex w-full flex-wrap items-center justify-center px-2 text-center md:col-span-4 lg:col-span-3 lg:ml-4 lg:justify-start lg:text-left">
        <div className="flex truncate">
          {admin && (
            <Link href={`/org/${org.id}/edit`} className="mr-1">
              <FontAwesomeIcon
                className="text-stone-500 hover:text-rose-500"
                icon={faEdit}
              />
            </Link>
          )}{" "}
          <Link
            className="flex items-center justify-center"
            href={`/org/${org.id}`}
          >
            <h3 className="truncate text-xl font-bold text-stone-600 hover:text-rose-600  md:text-lg">
              {org.name}
            </h3>
          </Link>
        </div>
        <ContactIconSection
          phone={org.phone}
          email={org.email}
          website={org.website}
        />
      </div>
      <DesktopContactInfo
        phone={org.phone}
        email={org.email}
        website={org.website}
      />

      <CategoryTagSection category={org.category} tags={org.tags} />
      <div className="mt-4 flex items-center justify-center xs:row-span-2 md:col-span-2 md:row-span-1 md:mt-0">
        {loggedIn && (
          <button
            onClick={() =>
              toggleFavorite.mutate({
                organizationId: org.id,
                newState: !isFavoriteOrg,
              })
            }
            className="mr-1 flex h-4 items-center justify-center"
          >
            <FontAwesomeIcon
              icon={isFavoriteOrg ? faStarSolid : faStar}
              className="text-gold-500 h-4 text-amber-400 "
            />
          </button>
        )}
        <Link
          className="mr-2 flex w-1/2 justify-center justify-self-center rounded border border-rose-500 bg-rose-500 py-1.5 font-bold text-white shadow-md sm:w-2/3 md:w-32"
          href={`/org/${org.id}`}
        >
          More Info
        </Link>
      </div>
    </CardWrapper>
  );
}
