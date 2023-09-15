import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import NavBar from "../../components/Nav";
import { getSession, useSession } from "next-auth/react";
import { prisma } from "../../server/db";
import {
  OrganizationCard,
  ResourceCard,
  type ResourceCardInformation,
} from "../../components/DisplayCard";
import { api } from "../../utils/api";

function ResourceSection({
  resources,
  session,
  userFavorites,
}: {
  resources: ResourceCardInformation[];
  session: ReturnType<typeof useSession>;
  userFavorites: string[] | undefined;
}) {
  return (
    <div className="mt-6">
      <h2 className="text-3xl font-bold text-stone-500">Resources</h2>
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          favoritesArray={userFavorites || []}
          loggedIn={!!session.data?.user}
        />
      ))}
    </div>
  );
}

function OrganizationSection({
  organizations,
  session,
  userFavorites,
}: {
  organizations: {
    name: string;
    id: string;
    category: string;
    website: string | null;
    phone: string | null;
    email: string | null;
    tags: {
      tag: string;
    }[];
  }[];
  userFavorites: string[] | undefined;
  session: ReturnType<typeof useSession>;
}) {
  return (
    <div className="mt-6">
      <h2 className="text-3xl font-bold text-stone-500">Organizations</h2>
      {organizations.map((organization) => (
        <OrganizationCard
          key={organization.id}
          org={organization}
          admin={false}
          favoriteIds={userFavorites || []}
          loggedIn={!!session.data?.user}
        />
      ))}
    </div>
  );
}

export default function ListsPage({
  listDetails: favorites,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const hasFavoriteResources = favorites.resources.length > 0;
  const hasFavoriteOrganizations = favorites.organizations.length > 0;

  const { data: userFavorites } = api.user.getCurrentFavoritesList.useQuery(
    undefined,
    {
      enabled: !!session.data?.user,
    }
  );
  return (
    <div>
      <NavBar />
      <div className="mx-6 pt-14">
        <h1 className=" text-5xl font-extrabold text-stone-500">Favorites</h1>
        {hasFavoriteResources && (
          <ResourceSection
            resources={favorites.resources}
            session={session}
            userFavorites={userFavorites?.resources}
          />
        )}
        {hasFavoriteOrganizations && (
          <OrganizationSection
            organizations={favorites.organizations}
            session={session}
            userFavorites={userFavorites?.organizations}
          />
        )}
      </div>
    </div>
  );
}

type ServerSideProps = {
  listDetails: {
    name: string;
    id: number;
    resources: {
      name: string;
      id: string;
      url: string | null;
      category: string;
      organizationId: string;
      organization: {
        name: string;
        id: string;
        website: string | null;
        phone: string | null;
        email: string | null;
      };
      tags: {
        tag: string;
      }[];
    }[];
    organizations: {
      name: string;
      id: string;
      category: string;
      website: string | null;
      phone: string | null;
      email: string | null;
      tags: {
        tag: string;
      }[];
    }[];
  };
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const session = await getSession(context);

  const loggedIn = !!session?.user.id;

  const favoritesListId = parseInt(context.query.id as string);

  const listDetails = await prisma.favoritesList.findUnique({
    where: {
      id: favoritesListId,
    },
    select: {
      name: true,
      id: true,
      resources: {
        select: {
          name: true,
          id: true,
          url: true,
          category: true,
          organizationId: true,
          organization: {
            select: {
              name: true,
              id: true,
              website: true,
              phone: true,
              email: true,
            },
          },
          tags: {
            select: {
              tag: true,
            },
          },
        },
      },
      organizations: {
        select: {
          name: true,
          id: true,
          category: true,
          website: true,
          phone: true,
          email: true,
          tags: {
            select: {
              tag: true,
            },
          },
        },
      },
    },
  });

  if (listDetails === null && !session?.user.id) {
    return {
      notFound: true,
    };
  }

  if (listDetails === null && loggedIn) {
    const newList = await prisma.favoritesList.create({
      data: {
        name: "Favorites",
        adminId: session.user.id,
      },
      select: {
        name: true,
        id: true,
      },
    });

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        currentListId: newList.id,
      },
    });

    return {
      props: {
        listDetails: { ...newList, resources: [], organizations: [] },
      },
    };
  } else if (listDetails === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      listDetails,
    },
  };
};
