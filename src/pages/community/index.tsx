import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import NavBar from "../../components/Nav";
import type { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import { prisma } from "../../server/db";
import type { Community } from "@prisma/client";
import Link from "next/link";
import { EditLink } from "../../components";

export default function CommunityPage({
  communities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession()
  const isAdmin = session && session.data &&  session.data.user.admin || false
  return (
    <div>
      <NavBar />
      <div className="mx-4 pt-14">
        <h1 className=" text-4xl font-bold text-gray-700">Communities</h1>
        <div className="">
          <div className="">
            {communities.map((community) => (
              <div key={community.name} className=" my-4 flex items-center">
                {isAdmin && (
                  <EditLink
                    iconProps={{
                      className: "text-stone-500 hover:text-stone-700 mr-2",
                    }}
                    href={`community/${community.id}/edit`}
                  />
                )}
                <Link
                  href={`community/${community.id}`}
                  className="flex items-center"
                >
                  <h2 className=" text-xl md:text-2xl text-stone-700 hover:text-rose-600">
                    {community.name}&rarr;
                  </h2>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type CommunityReturn = Pick<Community, "description" | "name" | "id">;

type ServerSideProps = {
  userSession: Session | null;
  communities: CommunityReturn[];
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const session = await getSession(context);

  const communities = await prisma.community.findMany({
    select: {
      name: true,
      description: true,
      id: true,
    },
  });

  return {
    props: {
      userSession: session,
      communities,
    },
  };
};
