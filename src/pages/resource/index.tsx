import Link from "next/link";
import NavBar from "../../components/Nav";
import { api } from "../../utils/api";
import type { Resource, Category, Tag } from "@prisma/client";
import OptionalLink from "../../components/OptionalLink";
import { useEffect, useState } from "react";
import type { MultiValue, SingleValue } from "react-select";
import { encodeTag } from "../../utils/manageUrl";
import type {
  CategorySelectItem} from "../../components/Selectors";
import {
  CategorySelect,
  TagSelect,
} from "../../components/Selectors";

type CreateResourceProps = {
  name: string;
  description: string;
  url: string;
  tags: string[];
  category: string;
};

export function CreateResourceForm({ orgId }: { orgId: string }) {
  const INIT_RESOURCE: CreateResourceProps = {
    name: "",
    description: "",
    url: "",
    tags: [],
    category: "",
  };

  const [formData, setFormData] = useState({ ...INIT_RESOURCE });

  const addResource = api.resource.create.useMutation({
    onSuccess: () => setFormData({ ...INIT_RESOURCE, category: formData.category }),
  });

  const { data: tags } = api.tag.getAll.useQuery()

  return (
    <form className="m-6 flex max-w-md flex-col bg-gray-100 p-6">
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <label htmlFor="description">Description</label>
      <textarea
        name="description"
        id="description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      <label htmlFor="url">URL</label>
      <input
        type="text"
        name="url"
        id="url"
        value={formData.url}
        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
      />

      
      <CategorySelect
        onChange={(value) => {
          const newValue = value as SingleValue<{ value: string; label: string }>;
          setFormData({ ...formData, category: newValue?.value ?? "" });
        }}

      /> 

      <TagSelect
        options={tags?.map((tag) => {
          return {
            value: tag.tag,
            label: tag.tag,
          };
        })}
        className="capitalize"
        isMulti={true}
        onChange={(value) => {

          const newValue = value as MultiValue<{ value: string; label: string }>;

          setFormData({
            ...formData,
            tags: newValue.map((x) => {
              return x.value;
            }),
          });
          console.log(formData);
        }}
      />

      <button
        onClick={() =>
          addResource.mutate({
            name: formData.name,
            description: formData.description,
            url: formData.url,
            tags: formData.tags,
            category: formData.category,
            orgId: orgId,
          })
        }
        type="button"
      >
        Submit
      </button>
    </form>
  );
}

type ResourceProps = Resource & {
  organization: {
    name: string;
    phone: string | null;
    email: string | null;
    website: string | null;
  };
  categoryMeta: Category;
  tags: Tag[];
};

export function ResourceItem({ resource }: { resource: ResourceProps }) {
  return (
    <div
      key={resource.id}
      className="m-6 flex max-w-5xl items-end justify-between text-stone-600"
    >
      <div className="basis-80">
        <Link href={`/org/${resource.organizationId}`}>
          <h2 className="text-lg font-light leading-4">
            {resource.organization.name}
          </h2>
        </Link>
        <Link href={`/resource/${resource.id}`}>
          <h1 className="text-lg font-semibold">{resource.name}</h1>
        </Link>
      </div>
      <div>
        <p>{resource.organization.phone}</p>
      </div>
      <div className="flex basis-60 flex-wrap">
        {resource.tags.map((x) => (
          <p
            key={x.tag}
            className="mx-1 my-0.5 w-fit rounded-lg bg-gray-100 px-1 text-xs"
          >
            {x.tag}
          </p>
        ))}
      </div>
      <Link
        className="basis-32"
        href={`/cat/${encodeTag(resource.categoryMeta.category)}`}
      >
        {resource.categoryMeta.category}
      </Link>
      <OptionalLink className="basis-32" href={resource.url}>
        Website
      </OptionalLink>
      <Link className="basis-32" href={`/resource/${resource.id}`}>
        More Info
      </Link>
    </div>
  );
}

export function ResourceSection({ resources }: { resources: ResourceProps[] }) {
  const allResources = resources;
  const [visibleResources, setVisibleResources] =
    useState<ResourceProps[]>(resources);

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [strict, setStrict] = useState(false);

  const handleCategoryChange = (selected: unknown) => {
    if (selected && typeof selected === "object" && "value" in selected) {
      setVisibleResources(
        resources.filter(
          (resource) => resource.categoryMeta.category === selected.value
        )
      );
    } else {
      setVisibleResources(resources);
    }
  };


  useEffect(() => {
    if (selectedTags.length === 0) {
      return setVisibleResources(allResources);
    }
    if (!strict)
      return setVisibleResources(
        resources.filter((resource) => {
          const resourceTags = resource.tags.map((tag) => tag.tag);
          return selectedTags.some((tag) => resourceTags.includes(tag));
        })
      );
    else
      return setVisibleResources(
        resources.filter((resource) => {
          const resourceTags = resource.tags.map((tag) => tag.tag);
          return selectedTags.every((tag) => resourceTags.includes(tag));
        })
      );
  }, [selectedTags, allResources, resources, strict]);

  return (
    <div>
      <CategorySelect
        onChange={handleCategoryChange}
        className="w-64 cursor-pointer"
      />
      <TagSelect
        className="w-64 cursor-pointer"
        onChange={
          (selected) => {
            const selectedTags = (selected as CategorySelectItem[]).map((tag) => tag.value);
            setSelectedTags(selectedTags);
          }
        }
      />
      <input type="checkbox" checked={strict} onChange={() => {setStrict(!strict)}} /><label>Strict</label><br /><br /><br />
      {visibleResources.map((resource) => (
        <ResourceItem key={resource.id} resource={resource} />
      ))}
    </div>
  );
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
        <ResourceSection resources={data} />
      </div>
    );
}
