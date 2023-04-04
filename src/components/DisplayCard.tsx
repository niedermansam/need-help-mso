import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { type OrgProps, TagList } from "../pages/org";
import { type ResourceProps } from "../pages/resource";
import { ContactIcons, ContactInfo } from "./ContactInfo";

export function ResourceCard({
  resource,
  showOrg = true,
  admin = false,
}: {
  resource: ResourceProps;
  showOrg?: boolean;
  admin?: boolean;
}) {
  const resourceName = resource.name;
  const orgName = resource.organization.name;

  const orgId = resource.organizationId;
  const resourceId = resource.id;

  const phone = resource.organization.phone;
  const email = resource.organization.email;
  const website = resource.url || resource.organization.website;
  return (
    <CardWrapper>
      <div className="flex w-full flex-wrap items-center justify-center px-2 text-center md:col-span-4 lg:col-span-3 lg:ml-4 lg:justify-start lg:text-left">
        <h2 className="truncate">
          {showOrg && (
            <Link href={`/org/${orgId}`}>
              <h3 className="truncate text-xl font-light hover:text-rose-600  md:text-lg">
                {orgName}
              </h3>
            </Link>
          )}
          <Link
            href={`/resource/${resourceId}`}
            className="hover:text-rose-500"
          >
            <h2 className="mb-2 truncate text-2xl font-bold tracking-tight md:text-xl">
              {resourceName}
            </h2>
          </Link>
          {admin && (
            <Link href={`/resource/${resourceId}/edit`} className="">
              <FontAwesomeIcon
                className="text-stone-500 hover:text-rose-500"
                icon={faEdit}
              />
            </Link>
          )}
        </h2>
        <ContactIconSection
          phone={phone}
          email={email}
          website={website}
        />
      </div>
      <DesktopContactInfo
        phone={phone}
        email={email}
        website={website}
      />
      <CategoryTagSection category={resource.category} tags={resource.tags} />
      <div className="mt-4 flex items-center justify-center xs:row-span-2 md:col-span-2 md:row-span-1 md:mt-0">
        <Link
          className="mr-2 flex w-1/2 justify-center justify-self-center rounded border border-rose-500 bg-rose-500 py-1.5 font-bold text-white shadow-md sm:w-2/3 md:w-32"
          href={`/resource/${resource.id}`}
        >
          More Info
        </Link>
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
    <div className="my-4 mx-4 py-2 grid w-full max-w-7xl auto-rows-min grid-cols-1 rounded border border-stone-200 pb-4 shadow xs:grid-cols-2 md:grid-cols-12 md:pb-2">
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
        className="mt-2 md:mt-1 w-full justify-center lg:hidden"
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
    <div className="flex h-fit flex-col xs:row-span-2 xs:mt-4 md:mt-0 md:col-span-6 md:row-span-1 lg:col-span-5">
      <p className=" my-2 md:mt-0 w-full px-4 text-base lg:mt-0">
        <span className="mr-1 w-full text-center font-light"> Category: </span>
        <Link
          href={`/cat/${category}`}
          className="font-bold text-stone-500 hover:text-rose-500"
        >
          {category}
        </Link>
      </p>
      <div className="flex px-4 max-h-[48px]">
        <p className="mb-0.5 mr-2 w-16 font-light"> Tags: </p>
        <TagList className="overflow-scroll" tags={tags} />
      </div>
    </div>
  );
};

export function OrganizationCard({
  org,
  admin,
}: {
  org: OrgProps;
  admin: boolean;
}) {
  return (
    <CardWrapper>
      <div className="flex w-full flex-wrap items-center justify-center px-2 text-center md:col-span-4 lg:col-span-3 lg:ml-4 lg:justify-start lg:text-left">
        <h2 className="truncate ">
          <Link
            className="flex items-center justify-center"
            href={`/org/${org.id}`}
          >
            {admin && (
              <Link href={`/org/${org.id}/edit`} className="mr-1">
                <FontAwesomeIcon
                  className="text-stone-500 hover:text-rose-500"
                  icon={faEdit}
                />
              </Link>
            )}
            <h3 className="truncate text-xl font-bold text-stone-600 hover:text-rose-600  md:text-lg">
              {org.name}
            </h3>
          </Link>
        </h2>
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
