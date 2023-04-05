import type { GetServerSideProps } from "next/types";
import { LoadingAnimation } from "../components";
import { prisma } from "../server/db";

export default function TestPage() {
  return <LoadingAnimation />;
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async () => {
  
  const communities = await  prisma.community.findMany({
    select: {
      name: true,
      description: true,
    }
  })

  communities.map(async (community) => {
    await prisma.community.update({
      where: {
        name: community.name
      },
      data: {
        id: community.name.toLowerCase().replace(/\s/g, "-")
      }
    })
  })



  return {
    props: {},
  };
};
