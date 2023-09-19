import { TagList } from "@/components/Tags";
import type { OrgProps } from "@/pages/old_org";
import { getRawPhoneNumber, prettyUrl } from "@/utils";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import {
  faEnvelope,
  faGlobe,
  faPhone,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Organization, Program, Tag } from "@prisma/client";
import Link from "next/link";
import {
  EditOrgButton,
  EditProgramButton,
  FavoriteOrgButton,
  FavoriteProgramButton,
  ProgramDetailsModal,
} from "./client";

export type ContactInfo = Pick<OrgProps, "phone" | "email" | "website">;

const FA_ICON_SIZE = { minWidth: 18, width: 18, height: 18 } as const;

export function ContactInfo({
  phone,
  email,
  website,
  shortUrl,
}: ContactInfo & { shortUrl?: boolean }) {
  const shortenUrl = shortUrl ?? false;
  return (
    <div className="w-full truncate">
      {phone && (
        <a
          className="mb-1.5 flex w-full items-center truncate text-xs text-stone-500 hover:text-cyan-700"
          href={getRawPhoneNumber(phone, true) || undefined}
        >
          <FontAwesomeIcon className="mr-2 h-4" icon={faPhone} />
          <span>{phone}</span>
        </a>
      )}
      {email && (
        <a
          className="mb-1.5 flex w-full items-center truncate text-ellipsis text-xs text-stone-500 hover:text-cyan-700"
          href={`mailto:${email}`}
        >
          <FontAwesomeIcon
            className="mr-2"
            style={FA_ICON_SIZE}
            icon={faEnvelope}
          />
          <span className="mr-2 truncate">{email}</span>
        </a>
      )}

      {website && (
        <Link
          className="mb-1.5 flex w-full items-center truncate whitespace-nowrap text-xs uppercase text-stone-500 hover:text-cyan-700"
          href={website}
        >
          <FontAwesomeIcon
            className="mr-2"
            style={FA_ICON_SIZE}
            icon={faGlobe}
          />
          <span className="mr-3 truncate text-xs  tracking-wide ">
            {prettyUrl(website, shortenUrl)}
          </span>
        </Link>
      )}
    </div>
  );
}

export interface ContactIconsProps
  extends React.ComponentPropsWithoutRef<"div"> {
  phone: string | null;
  email: string | null;
  website: string | null;
}

export function ContactIcons({
  phone,
  email,
  website,
  ...attributes
}: ContactIconsProps) {
  return (
    <div {...attributes} className={`flex ${attributes.className || ""}`}>
      {phone && (
        <button className="mx-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-stone-300  bg-stone-100 p-1.5 text-stone-500  hover:border-cyan-700/50 hover:bg-cyan-700/20 hover:text-cyan-700 md:mx-4 md:h-6 md:w-6">
          <a
            href={getRawPhoneNumber(phone, true) || undefined}
            className="flex items-center justify-center md:h-3 md:w-3"
          >
            <FontAwesomeIcon
              className="h-4 w-4 md:h-3 md:w-3 "
              icon={faPhone}
            />
          </a>
        </button>
      )}
      {email && (
        <button className="mx-2.5 flex  h-8 w-8 items-center  justify-center rounded-full border border-stone-300  bg-stone-100 p-1.5 text-stone-500  hover:border-cyan-700/50 hover:bg-cyan-700/20 hover:text-cyan-700 md:mx-4 md:h-6 md:w-6">
          <a
            href={`mailto:${email}`}
            className="flex items-center justify-center"
          >
            <FontAwesomeIcon
              className="h-4 w-4 md:h-3 md:w-3 "
              icon={faEnvelope}
            />
          </a>
        </button>
      )}

      {website && (
        <button className="mx-2.5 flex  h-8 w-8 items-center justify-center rounded-full border border-stone-300  bg-stone-100 p-1.5 text-stone-500  hover:border-cyan-700/50 hover:bg-cyan-700/20 hover:text-cyan-700 md:mx-4 md:h-6 md:w-6">
          <Link
            href={website}
            className="flex h-4 w-4 items-center justify-center"
          >
            <FontAwesomeIcon
              className="h-4 w-4 md:h-3 md:w-3 "
              icon={faGlobe}
            />
          </Link>
        </button>
      )}
    </div>
  );
}

export type OrgCardProps = Pick<
  Organization,
  "id" | "name" | "phone" | "email" | "website" | "category" | "description"
> & {
  tags: { tag: string }[];
};

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
    <div className="ml-2 hidden items-start px-1 pt-2 lg:col-span-2 lg:flex">
      <ContactInfo phone={phone} email={email} website={website} />
    </div>
  );
};

const CardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-4 grid w-full max-w-7xl auto-rows-min grid-cols-1 rounded border border-stone-200 bg-white py-2 pb-4 shadow xs:grid-cols-2 md:grid-cols-12 md:pb-2">
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
    <>
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
    </>
  );
};

export function OrganizationCard({
  org,
  showDescription,
}: {
  org: 
  Pick<
    Organization,
    "id" | "name" | "phone" | "email" | "website" | "category" | "description"
    > & {
      tags: { tag: string }[];
    };
  showDescription?: boolean;
}) {
  const orgId = org.id;

  return (
    <CardWrapper>
      <div className="flex w-full flex-wrap items-start justify-center px-2 text-center md:col-span-4 lg:col-span-3 lg:ml-4 lg:justify-start lg:text-left">
        <div className="flex truncate">
          <EditOrgButton orgId={orgId} />
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

      <div className="flex h-fit flex-col p-3 xs:row-span-2 xs:mt-4 md:col-span-6 md:row-span-1 md:mt-0 md:p-1 lg:col-span-5">
        {showDescription ? (
          <p className="text-sm font-light tracking-wide text-stone-600">
            {org.description}
          </p>
        ) : (
          <CategoryTagSection category={org.category} tags={org.tags} />
        )}
      </div>
      <div className="mt-4 flex items-center justify-center xs:row-span-2 md:col-span-2 md:row-span-1 md:mt-0">
        <FavoriteOrgButton orgId={orgId} />
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

export type ProgramCardInformation = Pick<
  Program,
  "name" | "id" | "url" | "category" | "organizationId" | "description"
> & {
  organization: {
    name: string;
    phone: string | null;
    email: string | null;
    website: string | null;
  };
  tags: Pick<Tag, "tag">[];
};

type ProgramCardDisplayOptions = {
  showDescription?: boolean;
  showOrgName?: boolean;
};

export function truncate(str: string, n: number) {
  const trimmed = str.slice(0, n + 1);
  return trimmed.slice(0, Math.min(trimmed.length, trimmed.lastIndexOf(" ")));
}

export const CategoryTag = ({
  category,
  tags,
}: {
  category: string;
  tags: string[];
}) => {
  return (
    <>
      <p className=" col-span-full">
        <span className="rounded bg-stone-500 px-2 text-sm text-white">
          {category}
        </span>
        {tags.map((tag) => (
          <span
            key={tag}
            className="ml-2 rounded bg-stone-400 px-2 text-sm text-white"
          >
            {tag}
          </span>
        ))}
      </p>
    </>
  );
};

export function ProgramCard({
  program,
  options,
}: {
  program: ProgramCardInformation;
  options?: ProgramCardDisplayOptions;
}) {
  const { showDescription, showOrgName } = options ?? {
    showDescription: false,
    showOrgName: false,
  };

  const programName = program.name;
  const orgName = program.organization.name;

  const orgId = program.organizationId;
  const programId = program.id;

  const phone = program.organization.phone;
  const email = program.organization.email;
  const website = program.url || program.organization.website;

  return (
    <div className="my-4 grid w-full max-w-7xl auto-rows-min grid-cols-1 rounded border border-stone-200 bg-white px-4 py-2 pb-4 shadow xs:grid-cols-2 md:grid-cols-4 md:pb-2">
      <div className="flex w-full flex-wrap items-start justify-start text-start md:col-span-4 lg:col-span-3 lg:justify-start lg:text-left">
        {showOrgName && (
          <Link href={`/org/${orgId}`}>
            <h3 className="truncate text-xl font-light hover:text-rose-600  md:text-lg">
              {orgName}
            </h3>
          </Link>
        )}
        <div className="flex">
          {/* <EditProgramButton programId={programId} orgId={orgId} /> */}
          <h2 className=" truncate text-2xl font-bold tracking-tight text-stone-600  md:text-xl">
            {programName}
          </h2>
        </div>
      </div>
      <CategoryTag
        category={program.category}
        tags={program.tags.map((tag) => tag.tag)}
      />
      <div className="col-span-full ">
        {truncate(program.description, 250) + "..."}
        <ProgramDetailsModal program={program} />
      </div>
    </div>
  );
}
