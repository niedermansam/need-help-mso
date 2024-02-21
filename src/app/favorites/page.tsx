"use client";
import { OrganizationCard } from "@/components/DisplayCard/server";
import { LoadingAnimation } from "@/components/old";
import { api } from "@/utils/api";
import { useFavoriteOrgStore } from "@/utils/userStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import ReactModal from "react-modal";
import { FavoritesHeader } from "./FavoritesHeader";

type ContactProps = {
  name: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
};

const PlainTextContactModal = ({
  contact,
}: {
  contact?: ContactProps[] | null;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  if (!contact) return undefined;
  const contactsString = contact.map((contact) => {
    const { name, phone, website } = contact;

    return `Name: ${name || "N/A"}\nPhone: ${phone || "N/A"}\nWebsite: ${
      website || "N/A"
    }\n\n`;
  });

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      width: "80%",
      height: "80%",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        data-umami-event="plain-text-contact-modal"
        className="rounded bg-rose-500 px-2 py-1 text-sm text-white"
      >
        View Contacts as Plain Text
      </button>

      <ReactModal
        style={customStyles}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <textarea className="h-full w-full">{contactsString.join("")}</textarea>
        ;
      </ReactModal>
    </>
  );
};

type OrganizationProps = Parameters<typeof OrganizationCard>[0]["org"];

function FavoritesList({
  organizations,
}: {
  organizations: OrganizationProps[];
}) {
  if (!organizations.length)
    return (
      <div className="flex h-[40vh] flex-col items-center justify-center text-center">
        <p className="text-3xl font-bold text-stone-500">
          No organizations in this list, yet.
        </p>
        <p className="text-stone-500">
          Click the star next to an organization to change that.
        </p>
        <div className="flex gap-1 pt-2">
          <Link
            href="/orgs/all"
            className="rounded bg-rose-500 px-2 py-1 text-white"
          >
            Browse Organizations
          </Link>
          <Link
            className="rounded bg-rose-500 px-2 py-1 text-white"
            href="/map"
          >
            View Map
          </Link>
        </div>
      </div>
    );

  return (
    <div>
      {organizations.map((org) => (
        <OrganizationCard
          key={org.id}
          org={org}
          programInclude={{
            name: true,
            description: true,
            tags: true,
            category: true,
          }}
          hightlightPrograms={true}
          search={""}
          tagOptions={{
            selected: new Set(),
            hidden: new Set(),
          }}
        />
      ))}

      <PlainTextContactModal contact={organizations} />
    </div>
  );
}

function Page() {
  const router = useRouter();
  const favoriteListId = useFavoriteOrgStore((state) => state.favoriteListId);
  const setFavoriteListId = useFavoriteOrgStore(
    (state) => state.setFavoriteListId
  );
  const setFavoriteListOrgs = useFavoriteOrgStore(
    (state) => state.setFavoriteOrgs
  );

  const { data: userLists } = api.user.getOwnFavoritesLists.useQuery();

  const [listName, setListName] = React.useState("Favorites");

  const { data: favoriteList, isFetching: currentListLoading } =
    api.user.getFavoriteOrganizations.useQuery(
      { listId: favoriteListId || null },
      {
        enabled: !!favoriteListId,
        onSuccess: (data) => {
          if (!data) return;
          setListName(data.name);
        },
      }
    );

  const setFavoriteListDb = api.user.setCurrentFavoritesList.useMutation({
    onMutate: (listId) => {
      setFavoriteListId(listId.listId);
      setFavoriteListOrgs([]);
    },
    onSuccess: (data) => {
      if (!data) return;
      setFavoriteListId(data.id);
      setFavoriteListOrgs(data.organizations.map((org) => org.id));
    },
  });

  const afterDelete = () => {
    router.refresh();
  };

  return (
    <div>
      <FavoritesHeader
        name={listName}
        id={favoriteList?.id || 0}
        afterDelete={afterDelete}
      />
      {currentListLoading ? (
        <div className="flex h-80 w-full items-center justify-center">
          {" "}
          <LoadingAnimation />{" "}
        </div>
      ) : (
        <FavoritesList organizations={favoriteList?.organizations || []} />
      )}
      <h2 className="text-2xl font-bold text-stone-600">Your other lists:</h2>
      <p className="mb-2 text-sm">Click to view and edit</p>
      {userLists?.map((list) => {
        if (list.id === favoriteListId) return null;
        return (
          <div
            onClick={() => {
              setFavoriteListDb.mutate({ listId: list.id });
            }}
            key={list.id}
            className="cursor-pointer text-lg font-bold text-stone-600"
          >
            {list.name} &rarr;
          </div>
        );
      })}
    </div>
  );
}

export default Page;
