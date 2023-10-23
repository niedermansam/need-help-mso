import { prisma } from "@/server/prisma";
import React from "react";
import { UpdateOrganizationForm } from "../../../../components/organization/UpdateForm";
import { ORGANIZATION_SELECT } from "@/components/organization/utils/fetchAllOrgs";

export const dynamic = "force-dynamic";

const getOrganization = async (id: string) => {
  const orgData = await prisma.organization.findUnique({
    where: {
      id: id,
    },
    select: {
      ...ORGANIZATION_SELECT,
      adminVerified: true,
      locations: {
        select: {
          id: true,
          name: true,
          address: true,
          apt: true,
          city: true,
          state: true,
          zip: true,
          latitude: true,
          longitude: true,
          orgId: true,
        },
      },
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
