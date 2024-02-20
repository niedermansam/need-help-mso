import { getRawPhoneNumber, prettyUrl } from "@/utils";
import {
  faEnvelope,
  faGlobe,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Community, Organization, Program, Tag } from "@prisma/client";
import Link from "next/link";
import {
  EditOrgButton,
  FavoriteOrgButton,
  ProgramDetailsModal,
} from "./client";
import { UpdateProgramModal } from "@/app/admin/org/[id]/programs/ProgramForm";
import { ProgramModal } from "./ProgramModal";
import { HighlightedText } from "@/app/test/HighlightedText";
import { twMerge } from "tailwind-merge";

export type ContactInfo = {
  phone: string | null;
  email: string | null;
  website: string | null;
};

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

type ProgramBaseProps = Pick<
  Program,
  | "name"
  | "description"
  | "url"
  | "organizationId"
  | "phone"
  | "category"
  | "id"
>;

type TagProps = Pick<Tag, "tag">;

type CommunityProps = Pick<Community, "name">;

type OrganizationProps = Pick<
  Organization,
  "name" | "phone" | "email" | "website" | "category" | "description" | "id"
> &{
  categories?: { category: string }[];
  tags: TagProps[];
};

export type ProgramProps = ProgramBaseProps & {
  exclusiveToCommunities: CommunityProps[];
  helpfulToCommunities: CommunityProps[];
} & {
  tags: TagProps[];
};

export type OrgCardProps = OrganizationProps & {
  programs: ProgramProps[];
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
    <div className="xs:grid-cols-2 my-4 grid  w-full auto-rows-min grid-cols-1 rounded border border-stone-200 bg-white py-2 pb-4 shadow md:grid-cols-12 md:pb-2">
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

export function OrganizationCard({
  org,
  search,
  programInclude,
  hightlightPrograms,
  tagOptions
}: {
  org: OrgCardProps;
  search?: string;
  programInclude: {
    name: boolean;
    description: boolean;
    tags: boolean;
    category: boolean;
  };
  hightlightPrograms: boolean;
  tagOptions: {
    selected: Set<string>;
    hidden: Set<string>;
  };
}) {
  const orgId = org.id;
  
  const allCategories = org.categories?.map((x) => x.category) 

  
  const allTags = org.tags.map((tag) => tag.tag);
 


  return (
    <CardWrapper>
      <div className="flex w-full flex-wrap items-start justify-center px-2 text-center md:col-span-4 lg:col-span-3 lg:ml-4 lg:justify-start lg:text-left ">
        <div className="flex truncate flex-col"><div className="flex">
          
            <EditOrgButton orgId={orgId} />
            <Link
              className="flex items-center justify-center"
              href={`/org/${org.id}`}
            >
              <h3 className="truncate text-xl font-bold text-stone-600 hover:text-rose-600  md:text-lg">
                <HighlightedText text={org.name} highlight={search || ""} />
              </h3>
          </Link>
        </div>
          <div className="w-full"> 
              <p className="text-sm font-light text-stone-600">
                {allCategories?.join(", ")}
              </p> 

              <p className="flex gap-x-2 gap-y-1 flex-wrap">
                {allTags.map((tag) => (
                  <span
                    key={tag}
                    className={twMerge("rounded bg-stone-400 px-2 text-sm text-white",
                    tagOptions.selected.has(tag) ? "bg-green-600" : ""
                    )}
                  >
                    {tag}
                  </span>
                ))}


              </p>
            
          </div> 

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

      <div className="xs:row-span-2 xs:mt-4 flex h-fit flex-col p-3 md:col-span-6 md:row-span-1 md:mt-0 md:p-1 lg:col-span-5">
        <p className="text-sm font-light tracking-wide text-stone-600">
          {org.description}
          <HighlightedText text={org.description} highlight={search || ""} />
        </p>
      </div>
      <div className="xs:row-span-2 mt-4 flex items-center justify-center md:col-span-2 md:row-span-1 md:mt-0">
        <FavoriteOrgButton orgId={orgId} />
      </div>
      {org.programs.length >= 1 && (
        <div className="col-span-full flex w-full flex-wrap gap-2 p-2">
          {org.programs.map((program) => {
            return (
              <ProgramModal
                key={program.id}
                program={program}
                search={search}
                include={programInclude}
                highlight={hightlightPrograms}
                tagOptions={tagOptions}
              />
            );
          })}
        </div>
      )}
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
  exclusiveToCommunities: { name: string }[];
  helpfulToCommunities: { name: string }[];
};

type ProgramCardDisplayOptions = {
  showDescription?: boolean;
  showOrgName?: boolean;
};

export function truncate(str: string, n: number) {
  if (str.length <= n) return str;
  const trimmed = str.slice(0, n + 1);
  return (
    trimmed.slice(0, Math.min(trimmed.length, trimmed.lastIndexOf(" "))) + "..."
  );
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
  const { showOrgName } = options ?? {
    showOrgName: false,
  };

  const programName = program.name;
  const orgName = program.organization.name;

  const orgId = program.organizationId;

  return (
    <div className="xs:grid-cols-2 my-4 grid w-full max-w-7xl auto-rows-min grid-cols-1 rounded border border-stone-200 bg-white px-4 py-2 pb-4 shadow md:grid-cols-4 md:pb-2">
      <div className="flex w-full flex-wrap items-start justify-start text-start md:col-span-4 lg:col-span-3 lg:justify-start lg:text-left">
        {showOrgName && (
          <Link href={`/org/${orgId}`}>
            <h3 className="truncate text-xl font-light hover:text-rose-600  md:text-lg">
              {orgName}
            </h3>
          </Link>
        )}
        <div className="flex flex-col">
          {/* <EditProgramButton programId={programId} orgId={orgId} /> */}
          <h2 className=" truncate text-2xl font-bold tracking-tight text-stone-600  md:text-xl">
            {program.url ? (
              <Link
                className="text-stone-500 hover:text-cyan-700 "
                target="_blank"
                href={program.url}
              >
                {programName} &rarr;
              </Link>
            ) : (
              programName
            )}
          </h2>
          {program.exclusiveToCommunities.length > 0 && (
            <p className="text-sm font-light text-stone-600">
              Exclusive to{" "}
              {program.exclusiveToCommunities.map((x) => x.name).join(", ")}
            </p>
          )}
        </div>
      </div>
      <CategoryTag
        category={program.category}
        tags={program.tags.map((tag) => tag.tag)}
      />
      <div className="col-span-full ">
        {program.description ? truncate(program.description || "", 250) : null}
        <div className="mt-2 flex justify-between">
          {program.description && (
            <ProgramDetailsModal buttonClassName="w-1/3" program={program} />
          )}
          <UpdateProgramModal
            buttonClassName="w-1/3"
            program={{
              ...program,
              helpfulToCommunities: program.helpfulToCommunities.map(
                (x) => x.name
              ),
              exclusiveToCommunities: program.exclusiveToCommunities.map(
                (x) => x.name
              ),
              tags: program.tags.map((x) => x.tag),
            }}
          />
        </div>
      </div>
    </div>
  );
}
