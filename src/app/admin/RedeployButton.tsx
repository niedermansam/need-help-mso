"use client";
import { api } from "@/utils/api";
import { useUserStore, userHasPermission } from "@/utils/userStore";
import React from "react";

function RedeployButton() {
  const redeploy = api.rebuildApp.useMutation({
    onSuccess: (data) => console.log(data),
  });
  const userRole = useUserStore((state) => state.role);

  if (!userHasPermission(userRole, "VOLUNTEER")) return null;
  return (
    <div className="flex items-center gap-4 rounded p-2 shadow">
      <button
        onClick={() => redeploy.mutate()}
        className="max-w-md rounded bg-rose-500 px-4 py-2 text-white hover:bg-rose-500"
      >
        Redeploy
      </button>
      <div>
        <p className="text-bold text-xs text-rose-600">
          Warning: Changes made by administrators on the dashboard do not
          automatically update the site.
        </p>

        <p className="text-xs">
          Organizations and programs are stored in a cache for better
          performance. Click this button to rebuild the cache and make any
          changes made in the administrator dashboard publicly available.
        </p>
      </div>
    </div>
  );
}

export default RedeployButton;
