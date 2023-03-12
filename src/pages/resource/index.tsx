import { useState } from "react";
import NavBar from "../../components/Nav";
import { api } from "../../utils/api";
import type { Resource } from "@prisma/client";
import Link from "next/link";

type ResourceFormProps = Omit<Resource, "id" | "organizationId">;

export function CreateResourceForm({orgId}:{orgId:string}) {
  const INIT_RESOURCE: ResourceFormProps & { tags: string[] } = {
    name: "",
    description: "",
    url: "",
    tags: [],
    category: "",
  };

  const createNewResource = api.resource.create.useMutation();

  const [resource, setResource] = useState(INIT_RESOURCE);
  
  return (
    <form className="flex flex-col bg-gray-100 max-w-md p-6 rounded m-6">
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={resource.name}
        onChange={(e) => setResource({ ...resource, name: e.target.value })}
      />
      <label htmlFor="description">Description</label>
      <textarea
        name="description"
        id="description"
        value={resource.description}
        onChange={(e) =>
          setResource({ ...resource, description: e.target.value })
        }
      />
      <label htmlFor="url">URL</label>
      <input
        type="text"
        name="url"
        id="url"
        value={resource.url || ""}
        onChange={(e) => setResource({ ...resource, url: e.target.value })}
      />
      <label htmlFor="tags">Tags</label>
      <input
        type="text"
        name="tags"
        id="tags"
        value={resource.tags}
        onChange={(e) =>
          setResource({
            ...resource,
            tags: [...e.target.value.split(",")],
          })
        }
      />
      <label htmlFor="category">Category</label>
      <input
        type="text"
        name="category"
        id="category"
        value={resource.category}
        onChange={(e) => setResource({ ...resource, category: e.target.value })}
      />
      <button
        type="button"
        onClick={() => {
          createNewResource.mutate({ orgId, ...resource });
        }}
      >
        Submit
      </button>
    </form>
  );
}

export default function ResourcePage() {
  const { data: resourceData } = api.resource.getAll.useQuery();
  return (
    <div>
      <NavBar />
      <h1 className="pt-20 text-4xl">Resources</h1>
      {resourceData?.map((resource) => (
        <div key={resource.id}>
          <Link href={`/resource/${resource.id}`}>
          {resource.name}</Link>
          </div>
      ))}
    </div>
  );
}
