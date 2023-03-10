import { useEffect } from "react"
import { api } from "../utils/api"

export default function AirtablePage() {

    const syncAirtable =   api.organization.syncAirtableResources.useMutation()

    useEffect(() => {
       syncAirtable.mutate()

    }, [])


    return <p>Syncing Airtable data...</p>
}