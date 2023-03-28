
import Link from "next/link";
import NavBar from "../../components/Nav";
import { api } from "../../utils/api";
import type { Resource, Category, Tag } from "@prisma/client";

export function CreateResourceForm({orgId}: {orgId: string}) {
  console.log(orgId)
  /**
    const INIT_RESOURCE = {
        name: '',
        description: '',
        orgName: '',
        url: '',
        tags: [],
        category: '',
    }
*/
  return <form></form>;
}

type ResourceProps = 
  Resource & {
    organization: {
        name: string;
    };
    categoryMeta: Category;
    tags: Tag[];
}

export function ResourceItem({ resource }: { resource: ResourceProps}) {
  return (
            <div
              key={resource.id}
              className="m-6 flex max-w-4xl items-end justify-between"
            >
              <div className="basis-60">
                <h2 className="text-lg font-light leading-4">
                  {resource.organization.name}
                </h2>
                <h1 className="text-lg font-semibold">{resource.name}</h1>
              </div>
              <div className="basis-32">
                {resource.tags.map((x) => (
                  <p key={x.tag}>{x.tag}</p>
                ))}
              </div>
              <Link href={`/cat/${encodeURI(resource.categoryMeta.category)}`}>
                {resource.categoryMeta.category}
              </Link>
              {resource.url ? (
                <Link className="basis-32" href={resource.url}>
                  Website
                </Link>
              ) : null}
              <Link className="basis-32" href={`/resource/${resource.id}`}>
                More Info
              </Link>
            </div>)
}

export default function ResourcePage() {
  const { data, isLoading, isError } = api.resource.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  if (data)
    return (
      <div>
        <NavBar />
        <h1 className="pt-20 text-4xl">Resources</h1>
        {data.map((resource) => {
          return <ResourceItem key={resource.id} resource={resource} />;
        })}
      </div>
    );
}
