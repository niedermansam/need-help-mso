import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import LoadingPage from "../components/LoadingPage";

export default LoadingPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  const favoritesListId = session.user.currentListId;

  if (!favoritesListId) {
    return {
      redirect: {
        destination: `/list`,
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: `/list/${favoritesListId}`,
      permanent: false,
    },
  };
};
