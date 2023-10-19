import { prisma } from "@/server/db";
import Link from "next/link";
import React, { Suspense } from "react";
import RedeployButton from "./RedeployButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { userHasPermission } from "@/utils/userStore";
import { NewOrgButton } from "@/components/organization/CreateForm";
import OrgsToCheckPage from "./to-check/page";

export const revalidate = 0;

const UsersSection = async () => {
  const session = await getServerSession(authOptions);

  const hasPermission = userHasPermission(session?.user.role, "SUPERADMIN");

  if (!hasPermission) return null;

  const users = await prisma.user.findMany({});
  return (
    <>
      <h1 className="text-4xl font-bold  text-stone-600">Users</h1>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <h2 className="text-2xl font-bold text-stone-600">{user.name}</h2>
            <p>{user.email}</p>
            <p>{user.admin && "admin"}</p>
          </div>
        );
      })}
    </>
  );
};

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
      <h1 className="pb-6 text-2xl font-bold text-stone-500">
        Administrator Dashboard
      </h1>
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

        {false && (
          <Link
            className="rounded bg-rose-500 px-2 py-4 font-bold text-white"
            href="/admin/to-check"
          >
            View Unchecked Organizations
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-4 py-4">
        <NewOrgButton className="flex items-center justify-center" />
        <RedeployButton />
      </div>
      <Suspense fallback={""}>
        <h2 className="py-6 text-2xl font-bold text-stone-500">
          Organizations to Check
        </h2>
        <OrgsToCheckPage />
      </Suspense>
      <Suspense fallback={""}>{false && <UsersSection />}</Suspense>
    </div>
  );
}

export default Page;
