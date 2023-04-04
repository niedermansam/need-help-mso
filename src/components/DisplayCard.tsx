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
  return (
    <div className="my-4 grid max-w-7xl auto-rows-min grid-cols-1 rounded border border-stone-200 pb-4 shadow xs:grid-cols-2 md:grid-cols-12 md:pb-2">
      <div className="flex w-full flex-wrap items-center justify-center px-2 text-center md:col-span-4 lg:col-span-3 lg:ml-4 lg:justify-start lg:text-left">
        <h2 className="truncate">
          {showOrg && (
            <Link href={`/org/${resource.organizationId}`}>
              <h3 className="truncate pt-2 text-xl font-light hover:text-rose-600  md:text-lg">
                {resource.organization.name}
              </h3>
            </Link>
          )}
          <Link
            href={`/resource/${resource.id}`}
            className="hover:text-rose-500"
          >
            <h2 className="mb-2 truncate text-2xl font-bold tracking-tight md:text-xl">
              {resource.name}
            </h2>
          </Link>
          {admin && (
            <Link href={`/resource/${resource.id}/edit`} className="">
              <FontAwesomeIcon
                className="text-stone-500 hover:text-rose-500"
                icon={faEdit}
              />
            </Link>
          )}
        </h2>
        <ContactIcons
          className="mt-2 w-full justify-center lg:hidden"
          phone={resource.organization.phone}
          email={resource.organization.email}
          website={resource.url || resource.organization.website}
        />
      </div>
      <div className="hidden pt-4 lg:col-span-2 lg:block">
        <ContactInfo
          phone={resource.organization.phone}
          email={resource.organization.email}
          website={resource.url || resource.organization.website}
        />
      </div>
      <div className="flex h-fit flex-col xs:row-span-2 xs:mt-4 md:col-span-6 md:row-span-1 lg:col-span-5">
        <p className=" my-2 w-full px-4 text-base lg:mt-0">
          <span className="mr-1 w-full text-center font-light">
            {" "}
            Category:{" "}
          </span>
          <Link
            href={`/cat/${resource.category}`}
            className="font-bold text-stone-500 hover:text-rose-500"
          >
            {resource.category}
          </Link>
        </p>
        <div className="flex overflow-scroll px-4">
          <p className="mb-0.5 mr-2 w-16 font-light"> Tags: </p>
          <TagList tags={resource.tags} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center xs:row-span-2 md:col-span-2 md:row-span-1 md:mt-0">
        <Link
          className="mr-2 flex w-1/2 justify-center justify-self-center rounded border border-rose-500 bg-rose-500 py-1.5 font-bold text-white shadow-md sm:w-2/3 md:w-32"
          href={`/resource/${resource.id}`}
        >
          More Info
        </Link>
      </div>
    </div>
  );
}

export function OrganizationCard({
  org,
  admin,
}: {
  org: OrgProps;
  admin: boolean;
}) {
  return (
    <div className="my-4 grid max-w-7xl auto-rows-min grid-cols-1 rounded border border-stone-200 pb-4 shadow xs:grid-cols-2 md:grid-cols-12 md:pb-2">
      <div className="flex w-full flex-wrap items-center justify-center px-2 text-center md:col-span-4 lg:col-span-3 lg:ml-4 lg:justify-start lg:text-left">
        <h2 className="truncate">
          <Link href={`/org/${org.id}`}>
            <h3 className="truncate pt-2 text-xl font-bold text-stone-600 hover:text-rose-600  md:text-lg">
              {org.name}
            </h3>
          </Link>
          {admin && (
            <Link href={`/org/${org.id}/edit`} className="">
              <FontAwesomeIcon
                className="text-stone-500 hover:text-rose-500"
                icon={faEdit}
              />
            </Link>
          )}
        </h2>
        <ContactIcons
          className="mt-2 w-full justify-center lg:hidden"
          phone={org.phone}
          email={org.email}
          website={org.website}
        />
      </div>
      <div className="hidden pt-2 lg:col-span-2 lg:block">
        <ContactInfo
          phone={org.phone}
          email={org.email}
          website={org.website}
        />
      </div>
      <div className="flex h-fit flex-col xs:row-span-2 xs:mt-4 md:col-span-6 md:row-span-1 lg:col-span-5">
        <p className=" my-2 w-full px-4 text-base ">
          <span className="mr-1 w-full text-center font-light">Category: </span>
          <Link
            href={`/cat/${org.category}`}
            className="font-bold text-stone-500 hover:text-rose-500"
          >
            {org.category}
          </Link>
        </p>
        <div className="flex overflow-scroll px-4">
          <p className="mb-0.5 mr-2 w-16 font-light"> Tags: </p>
          <TagList tags={org.tags} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center xs:row-span-2 md:col-span-2 md:row-span-1 md:mt-0">
        <Link
          className="mr-2 flex w-1/2 justify-center justify-self-center rounded border border-rose-500 bg-rose-500 py-1.5 font-bold text-white shadow-md sm:w-2/3 md:w-32"
          href={`/org/${org.id}`}
        >
          More Info
        </Link>
      </div>
    </div>
  );
}
