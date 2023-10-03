"use client";
import { api } from '@/utils/api';
import { useUserStore } from '@/utils/userStore';
import React from 'react'

function RedeployButton() {
    const redeploy = api.rebuildApp.useMutation({
        onSuccess: (data) => console.log(data)
    })
    const userIsSuperAdmin = useUserStore((state) => state.role) === "SUPERADMIN"

    if (!userIsSuperAdmin) return null
  return (
    <button
    onClick={() => redeploy.mutate()}
    >Redeploy</button>
  )
}

export default RedeployButton