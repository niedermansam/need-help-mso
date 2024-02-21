"use client";
import { trpc } from "@/components/providers";
import { api } from "@/utils/api";
import { useFavoriteOrgStore } from "@/utils/userStore";
import React from "react";

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
      data-umami-event="delete-list"
    >
      Delete List
    </button>
  );
}
