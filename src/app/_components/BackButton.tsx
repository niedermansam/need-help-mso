"use client"

import { useRouter } from "next/navigation"


export function BackButton() {
    const router = useRouter()
    return (
        <button data-umami-event="back" onClick={() => router.back()}>
            &larr;
        </button>
    )
}