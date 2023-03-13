import { useRouter } from "next/router";
import NavBar from "../../components/Nav";
import { api } from "../../utils/api";
import { ResourceItem } from "../resource";

export default function CategoryPage() {
    const {category: URI} = useRouter().query
    const category = decodeURIComponent(URI as string)

    const {data, isLoading, isError} = api.resource.getByCategory.useQuery(category)

    if (isLoading) {
        return <div>loading...</div>
    }

    if (isError) {
        return <div>failed to load</div>
    }

    return <div>
        <NavBar />
        <div className="pt-20 px-5 font-light text-5xl">{category}</div>
        {
            data?.map((resource) => <ResourceItem resource={resource} key={resource.id} />
            )
        }
    </div>
}