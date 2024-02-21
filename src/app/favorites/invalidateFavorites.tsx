"use client";
import { trpc } from "@/components/providers";

export const invalidateFavorites = () => {
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
