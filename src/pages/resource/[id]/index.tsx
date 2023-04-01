
import NavBar from "../../../components/Nav";
import Link from "next/link";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import { prisma } from "../../../server/db";
import type {
  Category,
  Community,
  Organization,
  Resource,
  Tag,
} from "@prisma/client";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";
import { CategoryLink } from "..";
import { encodeTag } from "../../../utils/manageUrl";
import { ContactInfo } from "../../org";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { TagLink } from "../../../components/Tags";


export default function ResourcePage({
  resource,
  admin,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <NavBar />
      <div className="px-6 pt-16 text-stone-600">
        <h1 className="text-3xl font-bold">
          {resource.name}
          {admin && (
            <Link href={`/resource/${resource.id}/edit`}>
              <FontAwesomeIcon
                icon={faEdit}
                className="mx-2 text-rose-800 hover:text-rose-500"
              />
            </Link>
          )}
        </h1>
        <div className="mb-2 text-lg font-bold">
          Help With&nbsp;
          <CategoryLink
            className=" text-rose-500 hover:text-rose-700"
            category={resource.category}
          />
          &nbsp;From&nbsp;
          <Link
            className="text-xl text-rose-500 hover:text-rose-700"
            href={`/org/${resource.organizationId}`}
          >
            {resource.organization.name}
          </Link>
        </div>
        <div className="mb-6 flex flex-wrap">
          <div className="flex flex-col">
            <h3 className="font-semibold text-stone-500">Contact Info:</h3>
            <ContactInfo
              phone={resource.organization.phone}
              email={resource.organization.email}
              website={resource.url || resource.organization.website}
            />
          </div>
          <div>
            <div className=" mx-6">
              <h3 className=" font-semibold text-stone-500">Tags:</h3>
              {resource.tags.map((tag) => (
                <TagLink tag={tag.tag} key={`${tag.tag} ${resource.id}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="mb-6 rounded border border-stone-200 p-4 shadow-md">
          <h3 className="font-semibold leading-4 text-stone-500">
            Description:
          </h3>
          <p className=" leading-loose">{resource.description}</p>
          <h4 className="mt-2 font-semibold text-stone-500">Internal Links</h4>
          <Link
            className="text-rose-500 hover:text-rose-700"
            href={`/org/${resource.organization.id}`}
          >
            {resource.organization.name}
          </Link>
        </div>
      </div>
    </div>
  );
}

type ServerSideProps = {
  resource: Resource & {
    organization: Pick<Organization, "name" | "id" | "phone" | "email" | "website">;
    tags: Tag[];
    categoryMeta: Category;
    exclusiveToCommunities: Community[];
    helpfulToCommunities: Community[];
  };
  session: Session | null;
  admin: boolean;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const { id } = context.query;

  const session = await getSession(context);

  const admin = (session && session.user && session.user.admin) || false;

  const returnResource = await prisma.resource.findUnique({
    where: {
      id: id as string,
    },
    include: {
      organization: {
        select: {
          name: true,
          id: true,
          phone: true,
          email: true,
          website: true,
        },
      },
      categoryMeta: true,
      tags: true,
      exclusiveToCommunities: true,
      helpfulToCommunities: true,
    },
  });

  if (!returnResource) {
    return {
      notFound: true,
    };
  }

  const resource = {
    ...returnResource,
  };

  return {
    props: {
      resource,
      session,
      admin,
    },
  };
};
