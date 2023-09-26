import { BackButton } from "@/app/_components/BackButton";
import { ContactInfo, ProgramCard } from "@/app/_components/DisplayCard/server";
import { prisma } from "@/server/db";
import React from "react";
import { getOrgData } from "./getOrgData";
import ProgramSection from "./ProgramSection";
import { EditOrgButton } from "@/app/_components/DisplayCard/client";

export const revalidate = 60 * 60 * 6;

async function Page({ params }: { params: { id: string } }) {
  const orgData = await getOrgData(params.id)

  if (!orgData) {
    return {
      notFound: true,
    };
  }

  return (
    <div>
      <div className="p-2 pt-0">
        <div className="mx-6">
          <h1 className="mb-4 pt-6 text-3xl font-bold flex items-center gap-2">
            <BackButton /> {orgData?.name} <span className="text-2xl">  <EditOrgButton orgId={orgData.id}/></span> 
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

export default Page;
