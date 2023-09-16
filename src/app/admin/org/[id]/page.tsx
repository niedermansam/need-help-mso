import { prisma } from "@/server/db";
import React from "react";
import { UpdateOrganizationForm } from "../../../_components/organization/UpdateForm";

export const dynamic = "force-dynamic";

const getOrganization = async (id: string) => {
  const orgData = await prisma.organization.findUnique({
    where: {
      id: id,
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

  return orgData;
};

export type OrganizationFormProps = NonNullable<
  Awaited<ReturnType<typeof getOrganization>>
>;

async function Page({ params }: { params: { id: string } }) {
  const orgData = await getOrganization(params.id);

  if (!orgData) {
    return {
      notFound: true,
    };
  }

  return <UpdateOrganizationForm org={orgData} />;
}

export default Page;
