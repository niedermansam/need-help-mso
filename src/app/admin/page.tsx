import { prisma } from "@/server/db";
import Link from "next/link";
import React from "react";
import RedeployButton from "./RedeployButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { userHasPermission } from "@/utils/userStore";
import { NewOrgButton } from "@/components/organization/CreateForm";
import OrgsToCheckPage from "./to-check/page";

export const revalidate = 0;

async function Page() {
  const session = await getServerSession(authOptions);

  const hasPermission = userHasPermission(session?.user.role, "VOLUNTEER");

  if (!hasPermission) return null;

  const totalOrgs = await prisma.organization.count();

  const verifiedOrgs = await prisma.organization.count({
    where: {
      adminVerified: true,
    },
  });

  const totalPrograms = await prisma.program.count();
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-500">
        Administrator Dashboard
      </h1>
      <p className="pb-4 text-sm">logged in as: {session?.user.email}</p>
      <div className="flex flex-col  justify-between gap-4">
        <div className="flex items-stretch justify-center  gap-4 text-center">
          <p className="rounded bg-white p-2 shadow">
            <span className="text-3xl font-bold text-stone-600">
              {" "}
              {totalOrgs}
            </span>
            <br /> Organizations
          </p>
          <p className="rounded bg-white p-2 shadow">
            <span className="text-3xl font-bold text-stone-600">
              {verifiedOrgs}
            </span>
            <br /> Organizations Verified
            <br /> by Admins
          </p>
          <p className="rounded bg-white p-2 shadow">
            <span className="text-3xl font-bold text-stone-600">
              {totalPrograms}
            </span>
            <br /> Programs
          </p>
        </div>

      </div>
      <div className="flex flex-col gap-4 py-4">
        <NewOrgButton className="flex items-center justify-center" />
        <RedeployButton />
      </div>
      <h2 className="py-6 text-2xl font-bold text-stone-500">
        Organizations to Check
      </h2>
      <OrgsToCheckPage />
    </div>
  );
}

export default Page;
