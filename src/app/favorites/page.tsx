"use client";
import { OrganizationCard } from "@/app/_components/DisplayCard/server";
import { trpc } from "@/app/providers";
import { LoadingAnimation } from "@/components";
import { api } from "@/utils/api";
import { useFavoriteOrgStore } from "@/utils/userStore";
import React, { useEffect } from "react";
import ReactModal from "react-modal";

const invalidateFavorites = () => {
  const utils = trpc.useContext();

  const invalidate = () => {
    utils.user.getOwnFavoritesLists
      .invalidate()
      .then(() => {
        console.log("invalidated");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return invalidate();
};

export function DeleteListButton({
  listId,
  afterDelete,
}: {
  listId: number;
  afterDelete?: () => void;
}) {
  const utils = trpc.useContext();

  const favoriteStore = useFavoriteOrgStore((state) => state.setFavoriteListId);

  const { data: userOwnsList, isLoading } =
    api.user.userOwnsFavoritesList.useQuery({ listId });
  const deleteList = api.user.deleteFavoritesList.useMutation({
    onSuccess: (data) => {
      favoriteStore(data.currentListId);
      utils.user.getOwnFavoritesLists
        .invalidate()
        .then(() => {
          console.log("invalidated");
        })
        .catch((err) => {
          console.log(err);
        });

      if (afterDelete) afterDelete();
    },
  });

  const handleDelete = () => {
    deleteList.mutate({ listId });
  };

  if (isLoading || !userOwnsList) return null;

  return (
    <button
      onClick={handleDelete}
      className="ml-2 rounded bg-rose-500 px-2 py-1 text-white"
    >
      Delete List
    </button>
  );
}

export function FavoritesActionButtons({ listId }: { listId: number }) {
  const favoriteStore = useFavoriteOrgStore((state) => state.setFavoriteListId);

  const invalidate = invalidateFavorites;

  const createList = api.user.createFavoriteList.useMutation({
    onSuccess: (data) => {
      favoriteStore(data);
      invalidate();
    },
  });

  const copyList = api.user.copyFavoritesList.useMutation({
    onSuccess: (data) => {
      favoriteStore(data.id);
      invalidate();
    },
  });

  const handleCreateList = () => {
    createList.mutate();
    invalidate();
  };

  return (
    <div className="flex">
      <button
        onClick={handleCreateList}
        className="rounded bg-stone-500 px-2 py-1 text-white"
      >
        Create New List
      </button>
      {listId && (
        <button
          onClick={() => copyList.mutate({ listId })}
          className="ml-2 rounded bg-stone-500 px-2 py-1 text-white"
        >
          Copy List
        </button>
      )}
      {listId && <DeleteListButton listId={listId} />}
    </div>
  );
}

export function FavoritesHeader({
  name,
  id,
}: {
  name: string;
  id: number;
  afterDelete?: () => void;
}) {
  const [prevName, setPrevName] = React.useState(name || "");
  const [newName, setNewName] = React.useState(name || "");

  const invalidate = invalidateFavorites;

  const { data: userOwnsList } = api.user.userOwnsFavoritesList.useQuery(
    { listId: id || null },
    {
      enabled: !!id,
    }
  );

  useEffect(() => {
    setNewName(name);
    setPrevName(name);
  }, [name]);

  const updateList = api.user.updateFavoritesListInfo.useMutation({
    onSuccess: () => {
      setPrevName(newName);
      invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newName === prevName) return;
    updateList.mutate({ listId: id, name: newName });
  };

  if (userOwnsList)
    return (
      <div>
        <form className="flex" onSubmit={handleSubmit}>
          <input
            type="text"
            className="rounded border border-gray-200 px-2 text-4xl font-bold text-stone-700"
            onChange={(e) => setNewName(e.target.value)}
            value={newName}
          />
          {newName !== prevName && (
            <button
              type="submit"
              className="rounded bg-stone-500 px-2 py-1 text-white"
            >
              Save
            </button>
          )}
        </form>
        <p className="text-stone-500">You own this list. ID: {id}</p>
        <FavoritesActionButtons listId={id} />
      </div>
    );

  return (
    <div>
      <h1 className="text-4xl font-bold text-stone-700">
        {name || "Favorites"}
      </h1>
      <FavoritesActionButtons listId={id} />
    </div>
  );
}

type ContactProps = {
  name: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
};

const PlainTextContactModal = ({ contact }: { contact?: ContactProps[] | null }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  if(!contact) return undefined;
  const contactsString = contact.map((contact) => {
    const { name,  phone, website } = contact;
    
    return  `Name: ${name || "N/A"}\nPhone: ${phone || "N/A"}\nWebsite: ${website || "N/A"}\n\n`;
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
        className="rounded bg-rose-500 px-2 py-1 text-white text-sm"
      >
        View Contacts as Plain Text
      </button>

    <ReactModal style={customStyles} isOpen={isOpen}  onRequestClose={() => setIsOpen(false)} >
      <textarea className="w-full h-full">{contactsString.join("")}</textarea>;
    </ReactModal>
    </>
  );
};

function Page() {
  const favoriteListId = useFavoriteOrgStore((state) => state.favoriteListId);
  const setFavoriteListId = useFavoriteOrgStore(
    (state) => state.setFavoriteListId
  );
  const setFavoriteListOrgs = useFavoriteOrgStore(
    (state) => state.setFavoriteOrgs
  );

  const { data: userLists, refetch } = api.user.getOwnFavoritesLists.useQuery();

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
    return void refetch();
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
        favoriteList?.organizations.map((org) => (
          <OrganizationCard org={org} key={org.id} showDescription />
        ))
      )}
      <PlainTextContactModal contact={favoriteList?.organizations } />
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
