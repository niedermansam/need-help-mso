import NavBar from "../../components/Nav";
import Link from "next/link";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import { getSession } from "next-auth/react";
import { prisma } from "../../server/db";
import type { Community, Organization, Resource, Tag } from "@prisma/client";
import type { Session } from "next-auth";

export default function OrganizationDetailsPage({
  orgData,
  userSession
}: 
InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!orgData) return <p>no data</p>;

  console.log(userSession)

  return (
    <div>
      <NavBar />
      <div className="p-2">
        <div className="m-4">
          <h1 className="pt-20 text-3xl">{orgData?.name}</h1>
          <p>{orgData.email}</p>
          <p>{orgData.phone}</p>
          <p>{orgData.description}</p>
        </div>
      </div>
      {orgData.resources.map((resource) => {
        return (
          <div key={resource.id} className="m-4 border border-gray-200 p-4">
            <Link href={`/resource/${resource.id}`}>
              <h2>{resource.name}</h2>
            </Link>
          </div>
        );
      })}
      {
        userSession.user.admin && (
          <Link href={`/org/${orgData.id}/edit`}>
            Edit
          </Link>
        )
        
      }
    </div>
  );
}

export type OrgReturnProps = Organization & {
  tags: Tag[];
  exclusiveToCommunities: Community[];
  helpfulToCommunities: Community[];
  resources: Resource[];
};

export type OrgProps = Omit<OrgReturnProps, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type OrgServerSideProps = {
  orgData: OrgProps;
  userSession: Session;
};

export const getServerSideProps: GetServerSideProps<OrgServerSideProps> = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const orgId = context.query.id as string;

  const orgData = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
    include: {
      resources: true,
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
