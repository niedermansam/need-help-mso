import { BackButton } from "@/app/_components/BackButton";
import { ContactInfo, ProgramCard } from "@/app/_components/DisplayCard/server";
import { prisma } from "@/server/db";
import React from "react";

export const revalidate = 60 * 60 * 6;

async function Page({ params }: { params: { id: string } }) {
  const orgData = await prisma.organization.findUnique({
    where: {
      id: params.id,
    },
    include: {
      programs: {
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

  return (
    <div>
      <div className="p-2 ">
        <div className="mx-6">
          <h1 className="mb-4 pt-12 text-3xl font-bold">
            <BackButton /> {orgData?.name}
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
        {
          orgData.programs.length > 0 && (
            <div className="mx-6">
              <h2 className="mt-12 mb-4 text-2xl font-bold">Programs</h2>
              <ul className="list-disc list-inside">
                {orgData.programs.map((program) => (
                  <ProgramCard  key={program.id} program={{...program, organization: orgData}} />

                ))}
              </ul>
            </div>
          )

        }
      </div>
    </div>
  );
}

export default Page;
