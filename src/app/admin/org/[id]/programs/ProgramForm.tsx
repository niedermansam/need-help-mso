"use client";
import {
  ProgramCard,
  type ProgramCardInformation,
} from "@/app/_components/DisplayCard/server";
import { FormItemWrapper } from "@/app/_components/FormItemWrapper";
import {
  CategorySelect,
  CommunitySelect,
  TagSelect,
} from "@/components/Selectors";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import React from "react";

type DefaultsFromOrganization = {
  id: string;
  category: string;
  name: string;
  phone: string | null;
  email: string | null;
  website: string | null;
};

function CreateProgramForm({ org, setSearchName }: { org: DefaultsFromOrganization, setSearchName: (name: string) => void }) {
  const router = useRouter( )
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
      router.refresh()
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
    if (!description) return alert("Please enter a description");
    if (!category) return alert("Please select a category");

    const exluciveToCommunitiesIds = exclusiveToCommunities.map(
      (community) => community.value
    );
    const helpfulToCommunitiesIds = helpfulToCommunities.map(
      (community) => community.value
    );

    const tags = selectedTags.map((tag) => tag.value);

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
          value={formState.description}
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
                (community) => community.value
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

function ProgramList({ programs, searchName }: { programs: ProgramCardInformation[], searchName: string }) {

  const filteredPrograms = programs//.filter( (program) => program.name.toLowerCase().includes(searchName.toLowerCase()) );

  const [page, setPage] = React.useState(1);

  const programsPerPage = 3;

  const maxPage = Math.ceil(filteredPrograms.length / programsPerPage);

  const start = (page - 1) * programsPerPage;
  const end = page * programsPerPage;

  const paginatedPrograms = filteredPrograms.slice(start, end);

  if(!paginatedPrograms.length) return (
    <div className="flex flex-col justify-center items-center h-full">
      <h2 className="text-6xl font-bold text-stone-500">No Programs Found</h2>
      <p className="text-2xl text-stone-700">Add a new program using the form on this page.</p>
    </div>
  )

  return (
    <>
      {paginatedPrograms.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
      <div className="flex justify-center gap-4 items-center">
        <button
          className="bg-stone-500 text-white rounded p-2"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-stone-700">
          Page {page} of {maxPage}
        </span>
        <button
          className="bg-stone-500 text-white rounded p-2"
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
      <CreateProgramForm org={org} setSearchName={setSearchName} /></div>
      <div className="w-2/3">
      <ProgramList programs={org.programs} searchName={searchName} /></div>
    </div>
  );
}

export default AdminProgramSection;
