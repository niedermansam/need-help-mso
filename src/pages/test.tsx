import type { GetServerSideProps } from "next/types";
import { LoadingAnimation } from "../components";
// import { prisma } from "../server/db";

export default function TestPage() {
  return <LoadingAnimation />;
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async () => {
  /* 
  const allOrgs = await prisma.organization.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  allOrgs.map(async (org) => {
    await prisma.organization.update({
      where: {
        id: org.id,
      },
      data: {
        id: org.name.replace(/\s/g, "-").toLowerCase(),
      },
    
  });
}); */

  return {
    props: {},
  };
};
