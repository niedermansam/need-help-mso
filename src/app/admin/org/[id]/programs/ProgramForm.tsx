"use client";
import {
  ProgramCard,
  type ProgramCardInformation,
} from "@/components/DisplayCard/server";
import { FormItemWrapper } from "@/components/FormItemWrapper";
import {
  CategorySelect,
  CommunitySelect,
  TagSelect,
} from "@/components/old/Selectors";
import { UnwrapTRPCMutation } from "@/types/trpc";
import { api } from "@/utils/api";
import { useUserStore } from "@/utils/userStore";
import { UseTRPCMutationOptions } from "@trpc/react-query/shared";
import { useRouter } from "next/navigation";
import React from "react";
import ReactModal from "react-modal";
import { twMerge } from "tailwind-merge";
import { set } from "zod";

type DefaultsFromOrganization = {
  id: string;
  category: string;
  name: string;
  phone: string | null;
  email: string | null;
  website: string | null;
};

type UpdateProgramProps = UnwrapTRPCMutation<
  typeof api.program.update.useMutation
>;

function UpdateProgramForm({
  program,
  onUpdate,
}: {
  program: UpdateProgramProps;
  onUpdate?: () => void;
}) {
  const [formState, setFormState] = React.useState<UpdateProgramProps>(program);

  console.log(program.helpfulToCommunities);

  const updateProgram = api.program.update.useMutation({
    onSuccess: () => {
      onUpdate?.();
    },
  });

  const [exclusiveToCommunities, setExclusiveToCommunities] = React.useState<
    { value: string; label: string }[]
  >(program.exclusiveToCommunities?.map((x) => ({ value: x, label: x })) || []);
  const [helpfulToCommunities, setHelpfulToCommunities] = React.useState<
    { value: string; label: string }[]
  >(program.helpfulToCommunities?.map((x) => ({ value: x, label: x })) || []);

  const [selectedTags, setSelectedTags] = React.useState<
    { value: string; label: string }[]
  >(program.tags?.map((x) => ({ value: x, label: x })) || []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "website")
      return setFormState((prevState) => ({
        ...prevState,
        url: value,
      }));

    if (name === "category")
      return setFormState((prevState) => ({
        ...prevState,
        category: value,
      }));

    if (name === "helpfulToCommunities") return;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, description, category } = formState;
    if (!name) return alert("Please enter a name");
    if (!category) return alert("Please select a category");

    const exluciveToCommunitiesIds = exclusiveToCommunities.map(
      (community) => community.value
    );
    const helpfulToCommunitiesIds = helpfulToCommunities.map(
      (community) => community.value
    );

    const tags = selectedTags.map((tag) => tag.value);

    updateProgram.mutate({
      ...formState,
      name,
      description,
      category,
      exclusiveToCommunities: exluciveToCommunitiesIds,
      helpfulTo: helpfulToCommunitiesIds,
      tags,
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="grid-rows-auto grid grid-cols-1 gap-x-6 md:grid-cols-2"
      >
        <FormItemWrapper>
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            className="text-bold rounded border border-stone-200 p-2 text-xl"
            id="name"
            onChange={handleChange}
            value={formState.name || ""}
          />
        </FormItemWrapper>
        <FormItemWrapper className=" min-h-[170px] md:row-span-4 ">
          <label
            htmlFor="description"
            className="text-sm font-light lowercase text-stone-600"
          >
            Description
          </label>
          <textarea
            name="description"
            className="text-bold h-full rounded border border-stone-200 p-2"
            id="description"
            onChange={handleChange}
            value={formState.description || ""}
          />
        </FormItemWrapper>{" "}
        <FormItemWrapper>
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="category"
          >
            Category
          </label>
          <CategorySelect
            name="category"
            id="category"
            title=""
            onChange={(e) => {
              const newValue = e as { value: string; label: string } | null;

              if (!newValue)
                return setFormState((prevState) => ({
                  ...prevState,
                  category: "",
                }));

              setFormState((prevState) => ({
                ...prevState,
                category: newValue.value,
              }));
            }}
            value={{
              value: formState.category || "",
              label: formState.category || "",
            }}
          />
        </FormItemWrapper>
        <FormItemWrapper>
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="tags"
          >
            Tags
          </label>
          <TagSelect
            name="tags"
            id="tags"
            title=""
            onChange={(e) => {
              const newValue = e as { value: string; label: string }[];

              setFormState((prevState) => ({
                ...prevState,
                tags: newValue.map((tag) => tag.value),
              }));

              setSelectedTags([...newValue]);
            }}
            value={selectedTags}
          />
        </FormItemWrapper>
        {/*<FormItemWrapper>
        <label
          className="text-sm font-light lowercase text-stone-600"
          htmlFor="orgId"
        >
          Organization
        </label>
        <OrganizationSingleSelect
          title=""
          value={{
            value: orgId,
            label: orgName,
          }}
        />
        </FormItemWrapper>*/}
        <FormItemWrapper>
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="website"
          >
            Website
          </label>
          <input
            type="text"
            name="website"
            className="text-bold rounded border border-stone-200 p-2 text-xl"
            id="website"
            onChange={handleChange}
            value={formState.url || ""}
          />
        </FormItemWrapper>{" "}
        <FormItemWrapper>
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="phone"
          >
            Phone
          </label>
          <input
            type="text"
            name="phone"
            className="text-bold rounded border border-stone-200 p-2 text-xl"
            id="phone"
            onChange={handleChange}
            value={formState.phone || ""}
          />
        </FormItemWrapper>
        <FormItemWrapper>
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="exclusiveToCommunities"
          >
            Exclusive to Communities
          </label>
          <CommunitySelect
            name="exclusiveToCommunities"
            id="exclusiveToCommunities"
            title=""
            onChange={(e) => {
              const newValue = e as { value: string; label: string }[];
              setFormState((prevState) => ({
                ...prevState,
                exclusiveToCommunities: newValue.map(
                  (community) => community.value
                ),
              }));
              setExclusiveToCommunities(newValue);
            }}
            value={exclusiveToCommunities}
          />
        </FormItemWrapper>
        <FormItemWrapper>
          <label
            className="text-sm font-light lowercase text-stone-600"
            htmlFor="helpfulToCommunities"
          >
            Helpful to Communities
          </label>
          <CommunitySelect
            name="helpfulToCommunities"
            id="helpfulToCommunities"
            title=""
            onChange={(e) => {
              const newValue = e as { value: string; label: string }[];
              setFormState((prevState) => ({
                ...prevState,
                helpfulToCommunities: newValue.map(
                  (community) => community.label
                ),
              }));
              setHelpfulToCommunities(newValue);
            }}
            value={helpfulToCommunities}
          />
        </FormItemWrapper>
        <button className=" col-span-full mt-4 w-full rounded bg-rose-500 p-2 text-white">
          Submit
        </button>
      </form>
      <div className="pt-4">
        <DeleteProgramButton programId={program.id} />
      </div>
    </>
  );
}

export function UpdateProgramModal({
  program,
  buttonClassName,
}: {
  program: UpdateProgramProps;
  buttonClassName?: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const isAdmin = useUserStore((state) => state.admin);

  if (!isAdmin) return null;
  console.log(program.helpfulToCommunities);

  return (
    <>
      <button
        className={twMerge(
          "rounded bg-rose-500 p-2 text-white",
          buttonClassName
        )}
        onClick={() => setIsOpen(true)}
      >
        Edit
      </button>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="min-h-[500px] min-w-[50%] rounded bg-white p-4"
        overlayClassName="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
      >
        <UpdateProgramForm
          program={program}
          onUpdate={() => {
            setIsOpen(false);
            router.refresh();
          }}
        />
      </ReactModal>
    </>
  );
}

function CreateProgramForm({
  org,
  setSearchName,
}: {
  org: DefaultsFromOrganization;
  setSearchName: (name: string) => void;
}) {
  const router = useRouter();
  const { id: orgId, category: orgCategory } = org;
  const createProgram = api.program.create.useMutation({
    onSuccess: () => {
      setFormState({
        orgId,
        category: formState.category,
        description: "",
        name: "",
        tags: [],
        url: "",
        exclusiveToCommunities: [],
        helpfulToCommunities: [],
      });
      setExclusiveToCommunities([]);
      setHelpfulToCommunities([]);
      setSelectedTags([]);
      router.refresh();
    },
  });
  type ProgramFormProps = Partial<Parameters<typeof createProgram.mutate>[0]>;
  const [formState, setFormState] = React.useState<ProgramFormProps>({
    orgId,
    category: orgCategory,
  });

  const [exclusiveToCommunities, setExclusiveToCommunities] = React.useState<
    { value: string; label: string }[]
  >([]);
  const [helpfulToCommunities, setHelpfulToCommunities] = React.useState<
    { value: string; label: string }[]
  >([]);

  const [selectedTags, setSelectedTags] = React.useState<
    { value: string; label: string }[]
  >([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "name") setSearchName(value);

    if (name === "website")
      return setFormState((prevState) => ({
        ...prevState,
        url: value,
      }));

    if (name === "category")
      return setFormState((prevState) => ({
        ...prevState,
        category: value,
      }));

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, description, orgId, category } = formState;
    if (!orgId) return alert("Please select an organization");
    if (!name) return alert("Please enter a name");
    if (!category) return alert("Please select a category");

    const exluciveToCommunitiesIds = exclusiveToCommunities.map(
      (community) => community.label
    );
    const helpfulToCommunitiesIds = helpfulToCommunities.map(
      (community) => community.label
    );

    const tags = selectedTags.map((tag) => tag.label);

    createProgram.mutate({
      ...formState,
      orgId,
      name,
      description,
      category,
      exclusiveToCommunities: exluciveToCommunitiesIds,
      helpfulToCommunities: helpfulToCommunitiesIds,
      orgName: org.name,
      tags,
    });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="grid-rows-auto grid grid-cols-1 gap-x-6 md:grid-cols-2"
    >
      <FormItemWrapper>
        <label
          className="text-sm font-light lowercase text-stone-600"
          htmlFor="name"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          className="text-bold rounded border border-stone-200 p-2 text-xl"
          id="name"
          onChange={handleChange}
          value={formState.name || ""}
        />
      </FormItemWrapper>
      <FormItemWrapper className=" min-h-[170px] md:row-span-4 ">
        <label
          htmlFor="description"
          className="text-sm font-light lowercase text-stone-600"
        >
          Description
        </label>
        <textarea
          name="description"
          className="text-bold h-full rounded border border-stone-200 p-2"
          id="description"
          onChange={handleChange}
          value={formState.description || ""}
        />
      </FormItemWrapper>{" "}
      <FormItemWrapper>
        <label
          className="text-sm font-light lowercase text-stone-600"
          htmlFor="category"
        >
          Category
        </label>
        <CategorySelect
          name="category"
          id="category"
          title=""
          onChange={(e) => {
            const newValue = e as { value: string; label: string } | null;

            if (!newValue)
              return setFormState((prevState) => ({
                ...prevState,
                category: "",
              }));

            setFormState((prevState) => ({
              ...prevState,
              category: newValue.value,
            }));
          }}
          value={{
            value: formState.category || "",
            label: formState.category || "",
          }}
        />
      </FormItemWrapper>
      <FormItemWrapper>
        <label
          className="text-sm font-light lowercase text-stone-600"
          htmlFor="tags"
        >
          Tags
        </label>
        <TagSelect
          name="tags"
          id="tags"
          title=""
          onChange={(e) => {
            const newValue = e as { value: string; label: string }[];

            setFormState((prevState) => ({
              ...prevState,
              tags: newValue.map((tag) => tag.value),
            }));

            setSelectedTags([...newValue]);
          }}
          value={selectedTags}
        />
      </FormItemWrapper>
      {/*<FormItemWrapper>
        <label
          className="text-sm font-light lowercase text-stone-600"
          htmlFor="orgId"
        >
          Organization
        </label>
        <OrganizationSingleSelect
          title=""
          value={{
            value: orgId,
            label: orgName,
          }}
        />
        </FormItemWrapper>*/}
      <FormItemWrapper>
        <label
          className="text-sm font-light lowercase text-stone-600"
          htmlFor="website"
        >
          Website
        </label>
        <input
          type="text"
          name="website"
          className="text-bold rounded border border-stone-200 p-2 text-xl"
          id="website"
          onChange={handleChange}
          value={formState.url || ""}
        />
      </FormItemWrapper>
      <FormItemWrapper>
        <label
          className="text-sm font-light lowercase text-stone-600"
          htmlFor="phone"
        >
          phone
        </label>
        <input
          type="text"
          name="phone"
          className="text-bold rounded border border-stone-200 p-2 text-xl"
          id="phone"
          onChange={handleChange}
          value={formState.phone || ""}
        />
      </FormItemWrapper>
      <FormItemWrapper>
        <label
          className="text-sm font-light lowercase text-stone-600"
          htmlFor="exclusiveToCommunities"
        >
          Exclusive to Communities
        </label>
        <CommunitySelect
          name="exclusiveToCommunities"
          id="exclusiveToCommunities"
          title=""
          onChange={(e) => {
            const newValue = e as { value: string; label: string }[];
            setFormState((prevState) => ({
              ...prevState,
              exclusiveToCommunities: newValue.map(
                (community) => community.label
              ),
            }));
            setExclusiveToCommunities(newValue);
          }}
          value={exclusiveToCommunities}
        />
      </FormItemWrapper>
      <FormItemWrapper>
        <label
          className="text-sm font-light lowercase text-stone-600"
          htmlFor="helpfulToCommunities"
        >
          Helpful to Communities
        </label>
        <CommunitySelect
          name="helpfulToCommunities"
          id="helpfulToCommunities"
          title=""
          onChange={(e) => {
            const newValue = e as { value: string; label: string }[];
            setFormState((prevState) => ({
              ...prevState,
              helpfulToCommunities: newValue.map(
                (community) => community.label
              ),
            }));
            setHelpfulToCommunities(newValue);
          }}
          value={helpfulToCommunities}
        />
      </FormItemWrapper>
      <button className=" col-span-full mt-4 w-full rounded bg-rose-500 p-2 text-white">
        Submit
      </button>
    </form>
  );
}

function ProgramList({
  programs,
  searchName,
}: {
  programs: ProgramCardInformation[];
  searchName: string;
}) {
  const filteredPrograms = programs; //.filter( (program) => program.name.toLowerCase().includes(searchName.toLowerCase()) );

  const [page, setPage] = React.useState(1);

  const programsPerPage = 3;

  const maxPage = Math.ceil(filteredPrograms.length / programsPerPage);

  const start = (page - 1) * programsPerPage;
  const end = page * programsPerPage;

  const paginatedPrograms = filteredPrograms.slice(start, end);

  if (!paginatedPrograms.length)
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h2 className="text-6xl font-bold text-stone-500">No Programs Found</h2>
        <p className="text-2xl text-stone-700">
          Add a new program using the form on this page.
        </p>
      </div>
    );

  return (
    <>
      {paginatedPrograms.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
      <div className="flex items-center justify-center gap-4">
        <button
          className="rounded bg-stone-500 p-2 text-white"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-stone-700">
          Page {page} of {maxPage}
        </span>
        <button
          className="rounded bg-stone-500 p-2 text-white"
          onClick={() => setPage((prev) => Math.min(prev + 1, maxPage))}
          disabled={page === maxPage}
        >
          Next
        </button>
      </div>
    </>
  );
}

function AdminProgramSection({
  org,
}: {
  org: DefaultsFromOrganization & { programs: ProgramCardInformation[] };
}) {
  const [searchName, setSearchName] = React.useState("");
  return (
    <div className="flex gap-4">
      <div className="w-1/3">
        <CreateProgramForm org={org} setSearchName={setSearchName} />
      </div>
      <div className="w-2/3">
        <ProgramList programs={org.programs} searchName={searchName} />
      </div>
    </div>
  );
}

export function DeleteProgramButton({ programId }: { programId: string }) {
  const router = useRouter();
  const deleteProgram = api.program.delete.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
    },
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [confirmString, setConfirmString] = React.useState("");
  const handleDelete = () => {
    if (!programId) return;

    deleteProgram.mutate({ programId: programId, confirmString });
  };

  const deleteButtonActive = (confirmString: string) =>
    confirmString.toLowerCase().trim() === "confirm";

  return (
    <>
      <button
        className="rounded bg-rose-500 p-2 text-white"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        Delete Program
      </button>
      <ReactModal
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2
      transform flex-col gap-4 rounded bg-white p-4"
        overlayClassName={twMerge(
          "fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50"
        )}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <p>Are you sure you want to delete this program?</p>
          <p>This action cannot be undone.</p>
          <p>Type the word &quot;confirm&quot; to continue</p>
          <input
            type="text"
            value={confirmString}
            onChange={(e) => setConfirmString(e.target.value)}
            className="rounded border border-stone-200 p-2"
          />
          <button
            className={twMerge(
              "rounded bg-rose-500 p-2 text-white",
              deleteButtonActive(confirmString) ? "bg-rose-500" : "bg-stone-300"
            )}
            onClick={handleDelete}
            disabled={!deleteButtonActive(confirmString)}
          >
            Delete
          </button>
        </div>
      </ReactModal>
    </>
  );
}

export default AdminProgramSection;
