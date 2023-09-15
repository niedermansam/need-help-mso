import NavBar from "../../components/Nav";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import { getSession } from "next-auth/react";
import { prisma } from "../../server/db";
import type {
  Category,
  Community,
  Organization,
  Resource,
  Tag,
} from "@prisma/client";
import type { Session } from "next-auth";

import { EditLink } from "../../components";
import { ContactInfo } from "../../components/ContactInfo";
import { ResourceCard } from "../../components/DisplayCard";
import { api } from "../../utils/api";

export default function OrganizationDetailsPage({
  orgData,
  userSession,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const isAdmin = userSession?.user.admin || false;

  const isLoggedIn = !!userSession?.user;

  const { data: favorites } = api.user.getCurrentFavoritesList.useQuery(
    undefined,
    {
      enabled: isLoggedIn,
    }
  );

  return (
    <div className="text-stone-600">
      <NavBar />
      <div className="p-2 ">
        <div className="mx-6">
          <h1 className="mb-4 pt-12 text-3xl font-bold">
            {orgData?.name}
            {isAdmin && <EditLink href={`${orgData.id}/edit`} />}
          </h1>
          <div className="mb-6 flex flex-col">
            <h3 className="font-semibold text-stone-500">Contact Info:</h3>
            <ContactInfo
              phone={orgData.phone}
              email={orgData.email}
              website={orgData.website}
            />
          </div>
          <h3 className="font-semibold text-stone-500">Description:</h3>
          <p>{orgData.description}</p>
        </div>
      </div>
      <h2 className="mx-6 mt-6 text-2xl font-bold">Available Resources</h2>
      {orgData.resources.map((resource) => {
        return (
          <ResourceCard
            resource={{ ...resource, organization: { ...orgData } }}
            key={resource.id}
            showOrg={false}
            favoritesArray={favorites?.resources || []}
          />
        );
      })}
    </div>
  );
}

export type OrgReturnProps = Organization & {
  tags: Tag[];
  exclusiveToCommunities: Community[];
  helpfulToCommunities: Community[];
  resources: (Resource & {
    tags: Tag[];
    categoryMeta: Category;
  })[];
};

export type OrgProps = Omit<OrgReturnProps, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type OrgServerSideProps = {
  orgData: OrgProps;
  userSession: Session | null;
};

export const getServerSideProps: GetServerSideProps<
  OrgServerSideProps
> = async (context) => {
  const session = await getSession(context);

  const orgId = context.query.id as string;

  const orgData = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
    include: {
      resources: {
        include: {
          tags: true,
          categoryMeta: true,
        },
      },
      exclusiveToCommunities: true,
      helpfulToCommunities: true,
      tags: true,
      categoryMeta: true,
    },
  });

  if (!orgData) {
    return {
      notFound: true,
    };
  }

  const propsData = {
    ...orgData,
    createdAt: orgData.createdAt.toISOString(),
    updatedAt: orgData.updatedAt.toISOString(),
  };

  return {
    props: {
      orgData: propsData,
      userSession: session,
    },
  };
};

//     },
