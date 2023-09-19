import Link, { type LinkProps } from "next/link";
import NavBar from "../../components/Nav";
import { api } from "../../utils/api";
import { useEffect, useMemo, useState } from "react";
import type { MultiValue, SingleValue } from "react-select";
import { encodeTag } from "../../utils/manageUrl";
import type { CategorySelectItem } from "../../components/Selectors";
import {
  CommunitySelect,
  getValidSingleValue,
} from "../../components/Selectors";
import { CategorySelect, TagSelect } from "../../components/Selectors";
import ReactModal from "react-modal";
import {
  ProgramCard,
  type ProgramCardInformation,
} from "../../components/DisplayCard";
import LoadingPage from "../../components/LoadingPage";
import Custom404 from "../old_404";
import { useSession } from "next-auth/react";

type CreateProgramProps = {
  name: string;
  description: string;
  url: string;
  tags: string[];
  category: string;
  exclusiveToCommunities: string[];
  helpfulToCommunities: string[];
  barriersToEntry: string | undefined;
  barriersToEntryDetails: string;
  speedOfAid: string[];
  speedOfAidDetails: string;
  free: boolean;
};
/**
 * 
 * 
 * 
      <Link
        className="basis-32"
        href={`/cat/${encodeTag(program.categoryMeta.category)}`}
      >
        {program.categoryMeta.category}
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
export function CreateProgramModal({ orgId }: { orgId: string }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className="w-full rounded bg-rose-500 px-2 py-1.5 font-bold tracking-wide text-rose-50"
        onClick={() => setShowModal(true)}
        type="button"
      >
        Add Program
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
        <CreateProgramForm orgId={orgId} />
      </ReactModal>
    </>
  );
}

export function CreateProgramForm({ orgId }: { orgId: string }) {
  const INIT_RESOURCE: CreateProgramProps = {
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

  const addProgram = api.program.create.useMutation({
    onSuccess: () =>
      setFormData({ ...INIT_RESOURCE, category: formData.category }),
  });

  const { data: tags } = api.tag.getAll.useQuery();

  return (
    <div className="m-6 flex w-fit flex-col rounded-lg border border-stone-300 bg-stone-50 p-6">
      <h1 className="max-w-full flex-grow text-center text-5xl font-extrabold text-stone-600">
        Create New Program
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
            <label>Free Program</label>
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
              addProgram.mutate({
                name: formData.name,
                description: formData.description,
                url: formData.url,
                tags: formData.tags,
                category: formData.category,
                orgId: orgId,
                orgName: "",
                exclusiveToCommunities: formData.exclusiveToCommunities,
                helpfulToCommunities: formData.helpfulToCommunities,
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
      </form>
    </div>
  );
}

export function ProgramSection({
  programs,
  isLoggedIn,
  isAdmin,
}: {
  programs: ProgramCardInformation[];
  isLoggedIn: boolean;
  isAdmin?: boolean;
}) {
  const { data: favorites } = api.user.getCurrentFavoritesList.useQuery(
    undefined,
    {
      enabled: isLoggedIn,
    }
  );

  const allPrograms = programs;
  const [visiblePrograms, setVisiblePrograms] =
    useState<ProgramCardInformation[]>(programs);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  const allTags = useMemo(() => {
    return [
      ...new Set(
        programs.flatMap((program) => program.tags.map((tag) => tag.tag))
      ),
    ];
  }, [programs]);

  const [displayTags, setDisplayTags] = useState(allTags);

  const [strict, setStrict] = useState(false);

  useEffect(() => {
    if (selectedTags.length === 0 && !selectedCategory) {
      setDisplayTags(allTags);
      setVisiblePrograms(programs);
      return;
    }

    const filteredByCategory = programs.filter((program) => {
      if (!selectedCategory) return true;
      return program.category === selectedCategory;
    });

    const newProgramList = filteredByCategory.filter((program) => {
      const programTags = program.tags.map((tag) => tag.tag);
      if (selectedTags.length === 0) return true;
      if (strict) return selectedTags.every((tag) => programTags.includes(tag));
      else return selectedTags.some((tag) => programTags.includes(tag));
    });

    setVisiblePrograms(newProgramList);

    if (strict) {
      // create a list of available tags
      const availableTags = newProgramList.flatMap((program) =>
        program.tags.map((tag) => tag.tag)
      );

      const uniqueTags = [...new Set(availableTags)];

      setDisplayTags(uniqueTags);
    } else {
      const availableTags = filteredByCategory.flatMap((program) =>
        program.tags.map((tag) => tag.tag)
      );

      const uniqueTags = [...new Set(availableTags)];

      setDisplayTags(uniqueTags);
    }
  }, [selectedTags, allPrograms, programs, strict, selectedCategory, allTags]);

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
        {visiblePrograms.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            favoritesArray={favorites?.programs || []}
            loggedIn={isLoggedIn}
            admin={isAdmin}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProgramPage() {
  const { data: programs, isLoading, isError } = api.program.getAll.useQuery();

  const session = useSession().data;

  const isLoggedIn = !!session?.user;

  const isAdmin = session?.user.admin;

  if (isLoading) return <LoadingPage />;
  if (isError) return <Custom404 />;

  if (programs)
    return (
      <div className="w-screen text-stone-600">
        <NavBar />
        <div className="px-4 pt-12 text-4xl font-bold">
          <h1 className="my-2">Programs</h1>
        </div>
        <ProgramSection
          programs={programs}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
        />
      </div>
    );
}
