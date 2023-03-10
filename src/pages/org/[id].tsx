import { useRouter } from "next/router";
import NavBar from "../../components/Navbar";
import { api } from "../../utils/api";

export default function OrganizationDetailsPage () {

    const {id: orgId} = useRouter().query

    const {data: orgData} = api.organization.getById.useQuery({id: orgId as string})

    if (!orgData) return <p>no data</p>
    return <div>
        <NavBar />
        <h1 className="pt-20 text-3xl">{orgData?.name}</h1>
        <p>{orgData.description}</p>
        {
            orgData.resources.map(resource => {
                return <div className="p-4 m-4 border border-gray-200">
                    <h2>{resource.name}</h2>
                    </div>
            })
        }
    </div>
}