"use client"
import { api } from "@/utils/api";
import { useFavoriteStore, useUserStore } from "@/utils/userStore";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faEdit,  faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export function FavoriteOrgButton({orgId}: {orgId: string}) {


    const favoriteOrgs = useFavoriteStore(state => state.favoriteOrgs)

    const toggleFavoriteOrg = useFavoriteStore(state => state.toggleFavoriteOrg)
    const saveFavoriteToDb = api.user.toggleFavoriteOrganization.useMutation({
    })

    const isFavoriteOrg = favoriteOrgs.includes(orgId);

    const handleClick = () => {
        toggleFavoriteOrg(orgId)
        saveFavoriteToDb.mutate({organizationId: orgId, newState: !isFavoriteOrg})
    }
    return (
        <button
            className="flex items-center justify-center w-8 h-8 "
            onClick={handleClick}
        >
            <FontAwesomeIcon
                icon={isFavoriteOrg ? faStarSolid : faStar}
                className="text-gold-500 h-4 text-amber-400 "
            />
        </button>
    )
}

export function EditButton({orgId}: {orgId: string}) {

    const admin = useUserStore(state => state.admin)

    return (
        admin ? <Link href={`/admin/org/${orgId}/`} className="mr-1">
            <FontAwesomeIcon
                className="text-stone-500 hover:text-rose-500"
                icon={faEdit}
            />
        </Link> : null
    )
}