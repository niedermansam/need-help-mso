import Link, { type LinkProps } from "next/link";
import NavBar from "../../components/Nav";
import { api } from "../../utils/api";
import type { Resource, Category, Tag } from "@prisma/client";
import { useEffect, useState } from "react";
import type { MultiValue, SingleValue } from "react-select";
import { encodeTag } from "../../utils/manageUrl";
import {
  CategorySelectItem,
  CommunitySelect,
} from "../../components/Selectors";
import { CategorySelect, TagSelect } from "../../components/Selectors";
import { ContactInfo, TagList } from "../org";
import { prettyPhoneNumber } from "../../utils";
import ReactModal from "react-modal";

type CreateResourceProps = {
  name: string;
  description: string;
  url: string;
  tags: string[];
  category: string;
  exclusiveToCommunities: string[];
  helpfulToCommunities: string[];
};
/**
 * 
 * 
 * 
      <Link
        className="basis-32"
        href={`/cat/${encodeTag(resource.categoryMeta.category)}`}
      >
        {resource.categoryMeta.category}
      </Link> */

export function CategoryLink({
  category,
  className,
  ...props
}: Omit<LinkProps, "href"> & {
  category: string;
  className?: HTMLDivElement["className"];
}) {
  return (
    <Link className={className} {...props} href={`/cat/${encodeTag(category)}`}>
      {category}
    </Link>
  );
}

export function CreateResourceModal({ orgId }: { orgId: string }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className="w-full rounded bg-rose-500 px-2 py-1.5 font-bold tracking-wide text-rose-50"
        onClick={() => setShowModal(true)}
        type="button"
      >
        Add Resource
      </button>
      <ReactModal
        className="w-fit"
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <CreateResourceForm orgId={orgId} />
      </ReactModal>
    </>
  );
}

export function CreateResourceForm({ orgId }: { orgId: string }) {
  const INIT_RESOURCE: CreateResourceProps = {
    name: "",
    description: "",
    url: "",
    tags: [],
    category: "",
    exclusiveToCommunities: [],
    helpfulToCommunities: [],
  };

  const [formData, setFormData] = useState({ ...INIT_RESOURCE });

  const addResource = api.resource.create.useMutation({
    onSuccess: () =>
      setFormData({ ...INIT_RESOURCE, category: formData.category }),
  });

  const { data: tags } = api.tag.getAll.useQuery();

  return (
    <div className="m-6 flex flex-col rounded-lg border border-stone-300 w-fit bg-stone-50 p-6">
      <h1 className="text-center text-5xl max-w-full font-extrabold flex-grow text-stone-600" >Create New Resource</h1>
      <form className="flex  justify-center">
        <div className="m-2 flex w-80 flex-col">
          <label className="text-lg font-light" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            className=" mb-2 rounded border border-stone-300 px-2 py-1.5"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label className="text-lg font-light" htmlFor="description">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            className="mb-2 h-28 mt-0.5 rounded border border-stone-300 px-2 py-1.5"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <label className="text-lg font-light" htmlFor="url">
            URL
          </label>
          <input
            type="text"
            name="url"
            id="url"
            className=" rounded border border-stone-300 px-2 py-1.5 mb-4"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />
          <button
            className="w-full rounded bg-rose-500 px-2 py-1.5 font-bold tracking-wide text-rose-50"
            onClick={() =>
              addResource.mutate({
                name: formData.name,
                description: formData.description,
                url: formData.url,
                tags: formData.tags,
                category: formData.category,
                orgId: orgId,
                exclusiveToCommunities: formData.exclusiveToCommunities,
                helpfulToCommunities: formData.helpfulToCommunities,
              })
            }
            type="button"
          >
            Submit
          </button>
        </div>
        <div className="m-2 flex h-full w-80 flex-col justify-start">
          <CategorySelect
            onChange={(value) => {
              const newValue = value as SingleValue<{
                value: string;
                label: string;
              }>;
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
            className="capitalize mb-2"
            isMulti={true}
            onChange={(value) => {
              const newValue = value as MultiValue<{
                value: string;
                label: string;
              }>;

              setFormData({
                ...formData,
                tags: newValue.map((x) => {
                  return x.value;
                }),
              });
              console.log(formData);
            }}
          />


          <CommunitySelect
            title="Exclusive to Communities"
            className="mb-2"
            onChange={(value) => {
              const newValue = value as MultiValue<{
                value: string;
                label: string;
              }>;

              setFormData({
                ...formData,
                exclusiveToCommunities: newValue.map((x) => {
                  return x.value;
                }),
              });
              console.log(formData);
            }}
            value={formData.exclusiveToCommunities.map((x) => {
              return {
                value: x,
                label: x,
              };
            })}
          />
          <CommunitySelect
            title="Helpful to Communities"
            onChange={(value) => {
              const newValue = value as MultiValue<{
                value: string;
                label: string;
              }>;

              setFormData({
                ...formData,
                helpfulToCommunities: newValue.map((x) => {
                  return x.value;
                }),
              });
              console.log(formData);
            }}
            value={formData.helpfulToCommunities.map((x) => {
              return {
                value: x,
                label: x,
              };
            })}
          />
        </div>
      </form>
    </div>
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

export function ResourceItem({
  resource,
  showOrg = true,
}: {
  resource: ResourceProps;
  showOrg?: boolean;
}) {
  return (
    <div
      key={resource.id}
      className="m-6 flex max-w-5xl items-center justify-between rounded border border-stone-300 p-2 text-stone-600 shadow"
    >
      <div className="ml-2 basis-80">
        {showOrg && (
          <Link href={`/org/${resource.organizationId}`}>
            <h3 className="text-lg font-light leading-4 hover:text-rose-600">
              {resource.organization.name}
            </h3>
          </Link>
        )}
        <Link href={`/resource/${resource.id}`} className="hover:text-rose-400">
          <h2 className="text-lg font-semibold">{resource.name}</h2>
        </Link>
      </div>

      <div className="flex w-96 flex-col">
        <ContactInfo
          phone={prettyPhoneNumber(resource.organization.phone)}
          email={resource.organization.email}
          website={resource.url}
          shortUrl={true}
        />
      </div>
      <div className="flex basis-60 flex-col flex-wrap">
        <CategoryLink
          category={resource.category}
          className="mb-2 font-bold text-stone-500 hover:text-rose-400"
        />
        <TagList tags={resource.tags} />
      </div>
      <Link
        className="mr-2 flex basis-32 justify-center rounded border border-rose-500 bg-rose-500 py-1.5 font-bold text-white shadow-md"
        href={`/resource/${resource.id}`}
      >
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
        onChange={(selected) => {
          const selectedTags = (selected as CategorySelectItem[]).map(
            (tag) => tag.value
          );
          setSelectedTags(selectedTags);
        }}
      />
      <input
        type="checkbox"
        checked={strict}
        onChange={() => {
          setStrict(!strict);
        }}
      />
      <label>Strict</label>
      <br />
      <br />
      <br />
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
