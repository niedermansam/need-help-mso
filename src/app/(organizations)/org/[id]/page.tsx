import { BackButton } from "@/components/BackButton";
import { ContactInfo } from "@/components/DisplayCard/server";
import React from "react";
import { getOrgData } from "./getOrgData";
import ProgramSection from "./ProgramSection";
import { EditOrgButton } from "@/components/DisplayCard/client";
import { prisma } from "@/server/prisma";

async function Page({ params }: { params: { id: string } }) {
  const orgData = await getOrgData(params.id);

  if (!orgData) {
    return {
      notFound: true,
    };
  }

  return (
    <div>
      <div className="p-2 pt-0">
        <div className="mx-6">
          <h1 className="mb-4 flex items-center gap-2 pt-6 text-3xl font-bold">
            <BackButton /> {orgData?.name}{" "}
            <span className="text-2xl">
              {" "}
              <EditOrgButton orgId={orgData.id} />
            </span>
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
        <ProgramSection programs={orgData.programs} organization={orgData} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const orgs = await prisma.organization.findMany({
    select: {
      id: true,
    },
  });

  return orgs.map((org) => {
    return { id: org.id };
  });
}

export default Page;
