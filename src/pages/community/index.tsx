import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import NavBar from "../../components/Nav";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { prisma } from "../../server/db";
import type { Community } from "@prisma/client";
import Link from "next/link";

export default function CommunityPage({ communities} : InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <NavBar />
      <div className="pt-12 mx-4">
        <h1 className=" text-4xl font-bold text-gray-700">
          Communities
        </h1>
        <div className="">
          <div className="">
            {communities.map((community) => (
              <div key={community.name} className="">
                <Link href={`community/${community.id}`}><h2 className="text-2xl font-bold text-gray-700">
                  {community.name}
                </h2></Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type CommunityReturn = Pick<Community, 'description' | 'name' | 'id'>

type ServerSideProps = {
  userSession: Session | null;
  communities: CommunityReturn[]
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const session = await getSession(context);

  const communities = await prisma.community.findMany({
    select: {
      name: true,
      description: true,
      id: true
    }
  })

  return {
    props: {
      userSession: session,
      communities
    },
  };
};
