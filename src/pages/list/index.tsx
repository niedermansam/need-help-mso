import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import NavBar from "../../components/Nav";
import { getSession } from "next-auth/react";
import { prisma } from "../../server/db";
import { OrganizationCard, ResourceCard, type ResourceCardInformation } from "../../components/DisplayCard";

function ResourceSection({
  resources,
}: {
  resources: ResourceCardInformation[];
}) {
  return (
    <div className="mt-6">
      <h2 className="text-3xl font-bold text-stone-500">Resources</h2>
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} favoritesArray={[resource.id]} loggedIn={true}/>
      ))}
    </div>
  );
}

function OrganizationSection({
  organizations,
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
}) {
  return (
    <div className="mt-6">
      <h2 className="text-3xl font-bold text-stone-500">Organizations</h2>
      {organizations.map((organization) => (
        <OrganizationCard
          key={organization.id}
          org={organization}
          admin={false}
          favoriteIds={[organization.id]}
          loggedIn={true}
        />
      ))}
    </div>
  );
}

export default function ListsPage({
  favorites,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const hasFavoriteResources = favorites.resources.length > 0;
  const hasFavoriteOrganizations = favorites.organizations.length > 0;
  return (
    <div>
      <NavBar />
      <div className="mx-6 pt-14">
        <h1 className=" text-5xl font-extrabold text-stone-500">Favorites</h1>
        {hasFavoriteResources && (
          <ResourceSection resources={favorites.resources} />
        )}
        {hasFavoriteOrganizations && (
          <OrganizationSection organizations={favorites.organizations} />
        )}
      </div>
    </div>
  );
}

type ServerSideProps = {
  favorites: {
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

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const favoritesListId = session.user.currentListId;

  const favorites = await prisma.favoritesList.findUnique({
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

  if (favorites === null) {
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
        favorites: { ...newList, resources: [], organizations: [] },
      },
    };
  }

  return {
    props: {
      favorites,
    },
  };
};
