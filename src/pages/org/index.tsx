import { useEffect, useState } from "react";
import NavBar from "../../components/Nav";
import { api } from "../../utils/api";
import type { Organization, Tag } from "@prisma/client";
import Link from "next/link";
import {
  CategorySelect,
  CommunitySelect,
  TagSelect,
  isValidCategory,
} from "../../components/Selectors";
import { useRouter } from "next/router";

export type OrganizationProps = {
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  category: string;
  tags: string[];
  exclusiveCommunities: string[];
  helpfulToCommunities: string[];
};

function CreateOrganizationForm() {
  const INITIAL_STATE: OrganizationProps = {
    name: "",
    description: "",
    website: "",
    email: "",
    phone: "",
    category: "",
    tags: [],
    exclusiveCommunities: [],
    helpfulToCommunities: []
  };

  const [formData, setFormData] = useState(INITIAL_STATE);
  const router = useRouter();
  const addOrg = api.organization.create.useMutation({
    onSuccess: async (results) => {
      await router.push(`/org/${results.id}/edit`);
    },
  });
  return (
    <div className="mx-6 max-w-md bg-gray-100 p-6">
      <h1>Create Organization</h1>
      <form className="flex flex-col ">
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
        <label htmlFor="website">Website</label>
        <input
          type="text"
          name="website"
          id="website"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <CategorySelect
          onChange={(unvalidatedCategory) => {
            // check that categofy is the type SingleValue<CategorySelectItem>

            const category = isValidCategory(unvalidatedCategory)
              ? unvalidatedCategory.value
              : "";

            setFormData({ ...formData, category: category });
          }}
        />
        <TagSelect
          onChange={(tags) => {
            setFormData(() => {
              const newTags = (tags as { label: string; value: string }[]).map(
                (x) => x.value
              );

              return { ...formData, tags: newTags };
            });
          }}
          
        />

        <CommunitySelect 
          title="Exclusive to Communities"
          onChange={(communities) => {
            setFormData(() => {
              const newCommunities = (communities as { label: string; value: string }[]).map(
                (x) => x.value
              );

              return { ...formData, exclusiveCommunities: newCommunities };
            });
          }}

          value={formData.exclusiveCommunities.map((x) => ({value: x, label: x}))}

        />
        <CommunitySelect
          title="Helpful to Communities" 
          onChange={(communities) => {
            setFormData(() => {
              const newCommunities = (communities as { label: string; value: string }[]).map(
                (x) => x.value
              );

              return { ...formData, helpfulToCommunities: newCommunities };
            });
          }}

          value={formData.helpfulToCommunities.map((x) => ({value: x, label: x}))}
        />

        <button
          type="button"
          onClick={() =>
            addOrg.mutate({
              ...formData,
              tags: formData.tags.map((x) => x.trim()),
            })
          }
        >
          Submit
        </button>
      </form>
    </div>
  );
}

type OrgProps = Organization & { tags: Tag[] };

function OrganizationItem({ org }: { org: OrgProps }) {
  return (
    <div className="m-6 flex w-full max-w-5xl  border border-gray-200 p-6">
      <div className="mr-6 basis-80">
        {" "}
        <Link href={`/org/${org.id}`}>
          <h2 className="text-xl">{org.name}</h2>
        </Link>
        <p>{org.phone}</p>
        <p>{org.email}</p>
      </div>{" "}
      <div className="flex h-fit basis-80 flex-wrap text-xs">
        {org.tags.map((tag) => (
          <p
            key={tag.tag}
            className="mx-2 my-0.5 rounded bg-stone-300 px-2 py-0.5 capitalize text-stone-800 hover:bg-stone-200"
          >
            {tag.tag}
          </p>
        ))}
      </div>
      <p className="basis-32">{org.category}</p>
      <p>{org.website}</p>
    </div>
  );
}

function OrganizationSection({ orgs }: { orgs: OrgProps[] }) {
  const [displayOrgs, setDisplayOrgs] = useState(orgs);
  const [strict, setStrict] = useState(false);

  const [selectedTags, setTags] = useState<{ value: string; label: string }[]>(
    []
  );

  useEffect(() => {
    if (selectedTags.length === 0) return setDisplayOrgs(orgs);
    setDisplayOrgs(
      orgs.filter((org) => {
        const orgTags = org.tags.map((tag) => tag.tag);
        if (strict)
          return selectedTags.every((tag) => orgTags.includes(tag.value));
        else return selectedTags.some((tag) => orgTags.includes(tag.value));
      })
    );
  }, [selectedTags, strict, orgs]);

  return (
    <div className="flex flex-wrap">
      <div className="w-full">
        <TagSelect
          className="w-96"
          onChange={(value) => {
            const tagArray = value as { value: string; label: string }[];
            if (tagArray.length === 0) {
              setTags([]);
            } else {
              setTags(tagArray);
            }

            /*
            const tagArray =  value as { value: string, label: string }[] 
            if(tagArray.length === 0) return setDisplayOrgs(orgs)
            setDisplayOrgs(orgs.filter((org) => {
              const orgTags = org.tags.map((tag) => tag.tag);
              if(strict) return tagArray.every((tag) => orgTags.includes(tag.value));
              else return tagArray.some((tag) => orgTags.includes(tag.value));
            }));*/
          }}
        />
        <input
          type="checkbox"
          name="category"
          value="strict"
          checked={strict}
          onChange={(e) => {
            console.log(strict);
            setStrict(e.target.checked);
          }}
        />{" "}
        Strict Search
      </div>
      {displayOrgs.map((org) => (
        <OrganizationItem key={org.id} org={org} />
      ))}
    </div>
  );
}

export default function OrganizationsPage() {
  const { data: orgs } = api.organization.getAll.useQuery();
  return (
    <div>
      <NavBar />
      <CreateOrganizationForm />
      {orgs && <OrganizationSection orgs={orgs} />}
    </div>
  );
}
