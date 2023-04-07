import type { GetServerSideProps } from "next/types";
// import { prisma } from "../server/db";
import LoadingPage from "../components/LoadingPage";

export default function TestPage() {
  return <LoadingPage />;
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async () => {
  



  return {
    props: {},
  };
};
