import type { GetServerSideProps } from "next/types";
import { LoadingAnimation } from "../components";
// import { prisma } from "../server/db";

export default function TestPage() {
  return <LoadingAnimation />;
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async () => {
  


  return {
    props: {},
  };
};
