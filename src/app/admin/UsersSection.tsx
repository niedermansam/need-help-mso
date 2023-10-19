import { prisma } from "@/server/db";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { userHasPermission } from "@/utils/userStore";

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
