import { prisma } from "@/server/db";
import Link from "next/link";
import React from "react";

async function Page() {
  const users = await prisma.user.findMany({});
  const totalOrgs = await prisma.organization.count();

  const verifiedOrgs = await prisma.organization.count({
    where: {
      adminVerified: true,
    },
  });

  const totalPrograms = await prisma.program.count();
  return (
    <div>
      <p> {totalOrgs} organizations</p>
      <p> {verifiedOrgs} verified organizations</p>
      <p> {totalPrograms} programs</p>
      <Link href="/admin/to-check">Organizations to check</Link>
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
    </div>
  );
}

export default Page;
