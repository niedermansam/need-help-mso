import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import NavBar from "../../components/Nav";
import { api } from "../../utils/api";
import { decodeTag, encodeTag } from "../../utils/manageUrl";
import { LoadingAnimation } from "../../components";
import { OrganizationCard, ResourceCard } from "../../components/DisplayCard";
import { prisma } from "../../server/db";
import { useSession } from "next-auth/react";

export default function TagPage({
  tag,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, isLoading, isError, error } = api.tag.getResources.useQuery({
    tag,
  });

  const session = useSession().data;

  const isLoggedIn = !!session?.user;

  const isAdmin = session?.user.admin || false;


  const { data: userFavorites } = api.user.getFavoriteList.useQuery(undefined, {enabled: isLoggedIn});

  return (
    <div className="text-stone-700">
      <NavBar />
      <h1 className="mx-6 mb-4 pt-20 text-3xl font-extrabold capitalize text-stone-500">
        Tag: {decodeTag(tag)}
      </h1>
      <div className="mx-6">
        <h2 className=" -mb-2 text-2xl font-extrabold text-stone-600">
          Resources
        </h2>
        {data &&
          data?.resources.map((resource) => {
            return (
              <ResourceCard
                resource={resource}
                key={resource.id}
                favoritesArray={userFavorites?.resources || []}
              />
            );
          })}
        {isLoading && (
          <div className="flex h-20 items-center">
            {" "}
            <LoadingAnimation />{" "}
          </div>
        )}
        {isError && (
          <div>
            <p>{error.message || "Sorry, something went wrong"}</p>
          </div>
        )}
      </div>
      <div className="mx-6">
        <h2 className="-mb-2 text-2xl font-extrabold text-stone-600">
          Organizations
        </h2>
        {data &&
          data?.organizations.map((org) => {
            return <OrganizationCard org={org} key={org.id} admin={isAdmin} loggedIn={!!session?.user} favoriteIds={userFavorites?.organizations || []} />;
          })}
        {isLoading && (
          <div className="flex h-20 items-center">
            {" "}
            <LoadingAnimation />{" "}
          </div>
        )}
        {isError && <div>{error.message || "Sorry, something went wrong"}</div>}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<{ tag: string }> = async (
  context
) => {
  const { query } = context;

  // check the query has a tag and that it is a string
  if (!query.tag || typeof query.tag !== "string") {
    return {
      notFound: true,
    };
  }

  const tag = encodeTag(query.tag);
  console.log(decodeTag(tag));
  const tagData = await prisma.tag.findFirst({
    where: {
      tag: {
        equals: decodeTag(tag),
        mode: "insensitive",
      },
    },
  });

  if (!tagData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      tag: tagData.tag,
    },
  };
};
