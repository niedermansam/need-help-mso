"use client";
import { api } from "@/utils/api";
import { useFavoriteOrgStore } from "@/utils/userStore";
import { useRouter } from "next/navigation";
import React from "react";
import { DeleteListButton } from "./DeleteListButton";

export function FavoritesActionButtons({ listId }: { listId: number }) {
  const favoriteStore = useFavoriteOrgStore((state) => state.setFavoriteListId);
  const router = useRouter();

  const createList = api.user.createFavoriteList.useMutation({
    onSuccess: (data) => {
      favoriteStore(data);
      router.refresh();
    },
  });

  const copyList = api.user.copyFavoritesList.useMutation({
    onSuccess: (data) => {
      favoriteStore(data.id);
      router.refresh();
    },
  });

  const handleCreateList = () => {
    createList.mutate();
  };

  return (
    <div className="flex">
      <button
        onClick={handleCreateList}
        data-umami-event="create-list"
        className="rounded bg-stone-500 px-2 py-1 text-white"
      >
        Create New List
      </button>
      {listId && (
        <button
          onClick={() => copyList.mutate({ listId })}
          className="ml-2 rounded bg-stone-500 px-2 py-1 text-white"
          data-umami-event="copy-list"
          data-umami-event-id={listId}
        >
          Copy List
        </button>
      )}
      {listId && <DeleteListButton listId={listId} />}
    </div>
  );
}
