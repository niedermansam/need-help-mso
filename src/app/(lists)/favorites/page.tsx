"use client";
import { OrganizationCard } from "@/app/components/DisplayCard/server";
import LoadingPage from "@/app/components/LoadingPage";
import { api } from "@/utils/api";
import { useFavoriteStore } from "@/utils/userStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { set } from "zod";

export function FavoritesActionButtons({ listId }: { listId: number }) {
  const favoriteStore = useFavoriteStore((state) => state.setFavoriteListId);
  const createList = api.user.createFavoriteList.useMutation({
    onSuccess: (data) => {
      favoriteStore(data);
    },
  });
  const router = useRouter();

  const handleCreateList = () => {
    createList.mutate();
    router.refresh();
  };

  return (
    <div className="flex">
      <button
        onClick={handleCreateList}
        className="rounded bg-stone-500 px-2 py-1 text-white"
      >
        Create New List
      </button>
    </div>
  );
}

export function FavoritesHeader({ name, id }: { name: string; id: number }) {
  const [prevName, setPrevName] = React.useState(name || "");
  const [newName, setNewName] = React.useState(name || "");
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
        <p className="text-stone-500">You own this list.</p>
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

function Page() {
  const favoriteListId = useFavoriteStore((state) => state.favoriteListId);
  const setFavoriteListId = useFavoriteStore(
    (state) => state.setFavoriteListId
  );
  const setFavoriteListOrgs = useFavoriteStore(
    (state) => state.setFavoriteOrgs
  );

  const { data: userLists } = api.user.getOwnFavoritesLists.useQuery();

  const [listName, setListName] = React.useState("Favorites");

  const { data: favoriteList, isLoading } =
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
    onSuccess: (data) => {
      if (!data) return;
      setFavoriteListId(data.id);
      setFavoriteListOrgs(data.organizations.map((org) => org.id));
    },
  });


  if (isLoading) {
    return <LoadingPage />;
  }

  
  return (
    <div>
      <FavoritesHeader name={listName} id={favoriteList?.id || 0} />
      {favoriteList?.organizations.map((org) => (
        <OrganizationCard org={org} key={org.id} showDescription />
      ))}
      <h2 className="text-2xl font-bold text-stone-600">Your other lists:</h2>
      <p className="text-sm mb-2">Click to view and edit</p>
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
