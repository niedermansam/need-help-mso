"use client";
import { api } from "@/utils/api";
import React, { useEffect } from "react";
import { FavoritesActionButtons } from "./FavoritesActionButtons";
import { invalidateFavorites } from "./invalidateFavorites";

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
              data-umami-event="update-list-name"
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
