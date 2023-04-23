import Link, { type LinkProps } from "next/link";
import NavBar from "../../components/Nav";
import { api } from "../../utils/api";
import type { BarriersToEntry, SpeedOfAid } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import type { MultiValue, SingleValue } from "react-select";
import { encodeTag } from "../../utils/manageUrl";
import type { CategorySelectItem } from "../../components/Selectors";
import {
  BarriersToEntrySelect,
  CommunitySelect,
  SpeedOfAidSelect,
  getValidSingleValue,
} from "../../components/Selectors";
import { CategorySelect, TagSelect } from "../../components/Selectors";
import ReactModal from "react-modal";
import {
  ResourceCard,
  type ResourceCardInformation,
} from "../../components/DisplayCard";
import LoadingPage from "../../components/LoadingPage";
import Custom404 from "../404";
import { useSession } from "next-auth/react";

type CreateResourceProps = {
  name: string;
  description: string;
  url: string;
  tags: string[];
  category: string;
  exclusiveToCommunities: string[];
  helpfulToCommunities: string[];
  barriersToEntry: BarriersToEntry | undefined;
  barriersToEntryDetails: string;
  speedOfAid: SpeedOfAid[];
  speedOfAidDetails: string;
  free: boolean;
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
    barriersToEntry: undefined,
    barriersToEntryDetails: "",
    speedOfAid: [],
    speedOfAidDetails: "",
    free: false,
  };

  const [formData, setFormData] = useState({ ...INIT_RESOURCE });

  const addResource = api.resource.create.useMutation({
    onSuccess: () =>
      setFormData({ ...INIT_RESOURCE, category: formData.category }),
  });

  const { data: tags } = api.tag.getAll.useQuery();

  return (
    <div className="m-6 flex w-fit flex-col rounded-lg border border-stone-300 bg-stone-50 p-6">
      <h1 className="max-w-full flex-grow text-center text-5xl font-extrabold text-stone-600">
        Create New Resource
      </h1>
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

          <div className=" mb-3 flex items-center text-xl capitalize text-stone-600">
            <input
              type="checkbox"
              name="free"
              id="free"
              className="mr-2 h-5 w-5 cursor-pointer rounded border border-stone-300 px-2 py-1.5"
              value={formData.free ? "true" : "false"}
              checked={formData.free}
              onChange={(e) =>
                setFormData({ ...formData, free: e.target.checked })
              }
            />
            <label>Free Resource</label>
          </div>
          <label className="text-lg font-light" htmlFor="description">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            className="mb-2 mt-0.5 h-28 rounded border border-stone-300 px-2 py-1.5"
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
            className=" mb-4 rounded border border-stone-300 px-2 py-1.5"
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
                barriersToEntry: formData.barriersToEntry,
                barriersToEntryDetails: formData.barriersToEntryDetails,
                speedOfAid: formData.speedOfAid || undefined,
                speedOfAidDetails: formData.speedOfAidDetails,
                free: formData.free,
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
            className="mb-2 capitalize"
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

        <div className="m-2 flex h-full w-80 flex-col justify-start">
          <BarriersToEntrySelect
            onChange={(value) => {
              const newValue = value as SingleValue<{
                value: BarriersToEntry;
                label: string;
              }>;

              setFormData({
                ...formData,
                barriersToEntry: newValue?.value || undefined,
              });
              console.log(formData.barriersToEntry);
            }}
          />
          <label
            className="text-lg font-light"
            htmlFor="barriersToEntryDetails"
          >
            Barriers to Entry Details
          </label>
          <textarea
            name="barriersToEntryDetails"
            id="barriersToEntryDetails"
            className="mb-2 mt-0.5 h-28 rounded border border-stone-300 px-2 py-1.5"
            value={formData.barriersToEntryDetails}
            onChange={(e) =>
              setFormData({
                ...formData,
                barriersToEntryDetails: e.target.value,
              })
            }
          />
        </div>
        <div className="m-2 flex h-full w-80 flex-col justify-start">
          <SpeedOfAidSelect
            onChange={(value) => {
              const newValue = value as MultiValue<{
                value: SpeedOfAid;
                label: string;
              }>;

              setFormData({
                ...formData,
                speedOfAid: newValue.map((x) => {
                  return x.value;
                }),
              });
              console.log(formData);
            }}
            value={formData.speedOfAid.map((x) => {
              return {
                value: x,
                label: x,
              };
            })}
          />
          <label className="text-lg font-light" htmlFor="speedOfAidDetails">
            Speed of Aid Details
          </label>
          <textarea
            name="speedOfAidDetails"
            id="speedOfAidDetails"
            className="mb-2 mt-0.5 h-28 rounded border border-stone-300 px-2 py-1.5"
            value={formData.speedOfAidDetails}
            onChange={(e) =>
              setFormData({
                ...formData,
                speedOfAidDetails: e.target.value,
              })
            }
          />
        </div>
      </form>
    </div>
  );
}

export function ResourceSection({
  resources,
  isLoggedIn,
  isAdmin,
}: {
  resources: ResourceCardInformation[];
  isLoggedIn: boolean;
  isAdmin?: boolean;
}) {
  const { data: favorites } = api.user.getFavoriteList.useQuery();

  const allResources = resources;
  const [visibleResources, setVisibleResources] =
    useState<ResourceCardInformation[]>(resources);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const allTags = useMemo(() => {
    return [...new Set(resources.flatMap((resource) => resource.tags.map((tag) => tag.tag)))];
  }, [resources]);

  const [displayTags, setDisplayTags] = useState(allTags);


  const [strict, setStrict] = useState(false);



  useEffect(() => {
    if (selectedTags.length === 0 && !selectedCategory) {
      setDisplayTags(allTags);
      setVisibleResources(resources);
      return;
    }

    const filteredByCategory = resources.filter((resource) => {
      if (!selectedCategory) return true;
      return resource.category === selectedCategory;
    });

    const newResourceList = filteredByCategory.filter((resource) => {
      const resourceTags = resource.tags.map((tag) => tag.tag);
      if (selectedTags.length === 0) return true;
      if (strict)
        return selectedTags.every((tag) => resourceTags.includes(tag));
      else return selectedTags.some((tag) => resourceTags.includes(tag));
    });

    setVisibleResources(newResourceList);


  if (strict) {
    // create a list of available tags
    const availableTags = newResourceList.flatMap((resource) =>
      resource.tags.map((tag) => tag.tag)
    );

    const uniqueTags = [...new Set(availableTags)];

    setDisplayTags(uniqueTags);
  } else {
    const availableTags = filteredByCategory.flatMap((resource) =>
      resource.tags.map((tag) => tag.tag)
    );

    const uniqueTags = [...new Set(availableTags)];

    setDisplayTags(uniqueTags);
  }
  }, [selectedTags, allResources, resources, strict, selectedCategory, allTags]);

  return (
    <div className="mr-6 w-full">
      <div className="flex flex-wrap">
        <div className="mx-4">
          <CategorySelect
            onChange={(value) => {
              setSelectedCategory(getValidSingleValue(value));
            }}
            className="w-64 cursor-pointer"
          />
        </div>
        <div className="mx-4">
          <TagSelect
            className="w-64 cursor-pointer"
            onChange={(selected) => {
              const selectedTags = (selected as CategorySelectItem[]).map(
                (tag) => tag.value
              );
              setSelectedTags(selectedTags);
            }}
            options={displayTags.map((tag) => {
              return {
                value: tag,
                label: tag,
              };
            })}
          />
          <input
            type="checkbox"
            className="cursor-pointer"
            id="strict-tag-search"
            checked={strict}
            onChange={() => {
              setStrict(!strict);
            }}
          />
          <label
            htmlFor="strict-tag-search"
            className="ml-1 text-xs font-bold text-stone-500"
          >
            Strict
          </label>
        </div>
      </div>
      <div className="mr-6">
        {visibleResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            favoritesArray={favorites?.resources || []}
            loggedIn={isLoggedIn}
            admin={isAdmin}
          />
        ))}
      </div>
    </div>
  );
}

export default function ResourcePage() {
  const {
    data: resources,
    isLoading,
    isError,
  } = api.resource.getAll.useQuery();

  const session = useSession().data;

  const isLoggedIn = !!session?.user;

  const isAdmin = session?.user.admin

  if (isLoading) return <LoadingPage />;
  if (isError) return <Custom404 />;

  if (resources)
    return (
      <div className="w-screen text-stone-600">
        <NavBar />
        <div className="px-4 pt-12 text-4xl font-bold">
          <h1 className="my-2">Resources</h1>
        </div>
        <ResourceSection resources={resources} isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      </div>
    );
}
