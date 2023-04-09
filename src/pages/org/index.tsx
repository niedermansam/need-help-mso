import type { Organization, Tag } from "@prisma/client";
import type { Session } from "next-auth/core/types";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import NavBar from "../../components/Nav";
import {
  CategorySelect,
  CommunitySelect,
  TagSelect,
  getValidSingleValue,
  isValidCategory,
} from "../../components/Selectors";
import { api } from "../../utils/api";
import { useMemo } from "react";

import { OrganizationCard } from "../../components/DisplayCard";

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
    helpfulToCommunities: [],
  };

  const [formData, setFormData] = useState(INITIAL_STATE);
  const router = useRouter();
  const addOrg = api.organization.create.useMutation({
    onSuccess: async (results) => {
      if (!results) return console.error("No results returned from mutation");
      await router.push(`/org/${results.id}/edit`);
    },
  });
  return (
    <div className="mt-20 flex justify-center">
      <div className=" min-w-full rounded-lg border border-stone-300 bg-stone-50 p-6 shadow-xl">
        <h3 className="mb-6 text-5xl font-extrabold text-stone-600">
          Create Organization
        </h3>
        <form className="">
          <div className="flex w-full">
            <div className="mr-4 flex w-4/12 flex-col">
              <label htmlFor="name" className="text-lg font-light">
                Name
              </label>
              <input
                className="mb-2.5 rounded border  border-stone-300 px-2 py-1.5 "
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <label className="text-lg font-light" htmlFor="description">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                className="mb-2.5 h-28 rounded border border-stone-300"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <button
                type="button"
                className="mt-4 w-full rounded bg-rose-500 p-2 font-bold text-white"
                onClick={() =>
                  addOrg.mutate({
                    ...formData,
                    tags: formData.tags.map((x) => x.trim()),
                  })
                }
              >
                Submit
              </button>
            </div>
            <div className="mx-4 flex w-3/12 flex-col">
              <label className="text-lg font-light" htmlFor="website">
                Website
              </label>
              <input
                className="mb-2.5 rounded border border-stone-300 px-2 py-1.5"
                type="text"
                name="website"
                id="website"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
              />
              <label className="text-lg font-light" htmlFor="email">
                Email
              </label>
              <input
                className="mb-2.5 rounded border border-stone-300 px-2  py-1.5"
                type="text"
                name="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <label className="text-lg font-light" htmlFor="phone">
                Phone
              </label>
              <input
                className="mb-2.5 rounded border border-stone-300 px-2  py-1.5"
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="mx-4 flex w-3/12 basis-80 flex-col">
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
                    const newTags = (
                      tags as { label: string; value: string }[]
                    ).map((x) => x.value);

                    return { ...formData, tags: newTags };
                  });
                }}
              />
            </div>

            <div className="mx-4 flex w-3/12 basis-80 flex-col">
              <CommunitySelect
                title="Exclusive to Communities"
                onChange={(communities) => {
                  setFormData(() => {
                    const newCommunities = (
                      communities as { label: string; value: string }[]
                    ).map((x) => x.value);

                    return {
                      ...formData,
                      exclusiveCommunities: newCommunities,
                    };
                  });
                }}
                value={formData.exclusiveCommunities.map((x) => ({
                  value: x,
                  label: x,
                }))}
              />
              <CommunitySelect
                title="Helpful to Communities"
                onChange={(communities) => {
                  setFormData(() => {
                    const newCommunities = (
                      communities as { label: string; value: string }[]
                    ).map((x) => x.value);

                    return {
                      ...formData,
                      helpfulToCommunities: newCommunities,
                    };
                  });
                }}
                value={formData.helpfulToCommunities.map((x) => ({
                  value: x,
                  label: x,
                }))}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateOrganizationModal() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className="fixed bottom-10 right-1/3 z-40 rounded bg-rose-500 py-2 px-4 font-bold text-white"
        onClick={() => setIsOpen(true)}
      >
        New Organization
      </button>
      <ReactModal
        className="z-50 mx-auto w-fit min-w-[90%]"
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            cursor: "pointer",
          },
          content: {
            cursor: "default",
          },
        }}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <CreateOrganizationForm />
      </ReactModal>
    </>
  );
}

export type OrgProps = Omit<
  Organization,
  "createdAt" | "updatedAt" | "logo"
> & {
  tags: Pick<Tag, "tag">[];
};

function OrganizationSection({
  orgs,
  admin,
  loggedIn,
}: {
  orgs: OrgProps[];
  admin: boolean;
  loggedIn: boolean;
}) {
  const [displayOrgs, setDisplayOrgs] = useState(orgs);

  const { data: favorites } = api.user.getFavoriteList.useQuery();

  const allTagsMemo = useMemo(() => {
    return [...new Set(orgs.flatMap((org) => org.tags.map((tag) => tag.tag)))];
  }, [orgs]);

  const [displayTags, setDisplayTags] = useState<string[]>(allTagsMemo);
  const [strict, setStrict] = useState(false);

  const [selectedTags, setSelectedTags] = useState<
    { value: string; label: string }[]
  >([]);

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (selectedTags.length === 0 && !selectedCategory) {
      setDisplayTags(allTagsMemo);
      setDisplayOrgs(orgs);
      return;
    }

    console.log(selectedTags.length);
    const filteredByCategory = orgs.filter((org) => {
      const orgCategory = org["category"];
      if (selectedCategory && orgCategory !== selectedCategory) return false;
      return true;
    });

    const newOrgList = filteredByCategory.filter((org) => {
      const orgTags = org.tags.map((tag) => tag.tag);
      if (selectedTags.length === 0) return true;
      if (strict)
        return selectedTags.every((tag) => orgTags.includes(tag.value));
      else return selectedTags.some((tag) => orgTags.includes(tag.value));
    });

    setDisplayOrgs(newOrgList);

    if (strict) {
      // create a list of available tags
      const availableTags = newOrgList.flatMap((org) =>
        org.tags.map((tag) => tag.tag)
      );

      const uniqueTags = [...new Set(availableTags)];

      setDisplayTags(uniqueTags);
    } else {
      const availableTags = filteredByCategory.flatMap((org) =>
        org.tags.map((tag) => tag.tag)
      );

      const uniqueTags = [...new Set(availableTags)];

      setDisplayTags(uniqueTags);
    }
  }, [selectedTags, strict, selectedCategory, orgs, allTagsMemo]);

  return (
    <div className="flex flex-wrap">
      <div className="mx-4 flex w-full">
        <div className="mr-2 w-96">
          <CategorySelect
            onChange={(value) => {
              setSelectedCategory(getValidSingleValue(value));
            }}
          />
        </div>
        <div className="mx-2 w-96">
          <TagSelect
            options={displayTags.map((tag) => ({ value: tag, label: tag }))}
            onChange={(value) => {
              const tagArray = value as { value: string; label: string }[];
              if (tagArray.length === 0) {
                setSelectedTags([]);
              } else {
                setSelectedTags(tagArray);
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
          <div className="-mt-2">
            <input
              type="checkbox"
              name="strict-tag-search"
              value="strict"
              checked={strict}
              onChange={(e) => {
                console.log(strict);
                setStrict(e.target.checked);
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
      </div>
      {displayOrgs.map((org) => {
        return (
          <OrganizationCard
            admin={admin}
            key={org.id}
            org={org}
            loggedIn={loggedIn}
            favoriteIds={favorites?.organizations || []}
          />
        );
      })}
    </div>
  );
}

export default function OrganizationsPage({
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: orgs } = api.organization.getAll.useQuery();
  const session = useSession().data;

  const isLoggedIn = !!session?.user;

  const isAdmin = session?.user.admin || false;
  return (
    <div>
      <NavBar />
      <div className="pt-12">
        <div>
          <h1 className="my-2 mx-4 text-4xl font-bold text-stone-700">
            Organizations
          </h1>
        </div>
        {isAdmin && <CreateOrganizationModal />}
        {orgs && (
          <OrganizationSection
            orgs={orgs}
            admin={isAdmin}
            loggedIn={isLoggedIn}
          />
        )}
      </div>
    </div>
  );
}

type ServerSideProps = {
  userSession: Session | null;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const session = await getSession(context);

  return {
    props: {
      userSession: session,
    },
  };
};
