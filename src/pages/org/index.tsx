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
import { getRawPhoneNumber, prettyUrl } from "../../utils";
import {
  faEnvelope,
  faGlobe,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth/core/types";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import ReactModal from "react-modal";
import { TagLink } from "../../components/Tags";


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
        className="rounded bg-rose-500 py-2 px-4 font-bold text-white"
        onClick={() => setIsOpen(true)}
      >
        Create Organization
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
          }
        }}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <CreateOrganizationForm />
      </ReactModal>
    </>
  );
}

type OrgProps = Organization & { tags: Tag[] };

type ContactInfo = Pick<OrgProps, "phone" | "email" | "website">;

export function ContactInfo({
  phone,
  email,
  website,
  shortUrl,
}: ContactInfo & { shortUrl?: boolean }) {
  const shortenUrl = shortUrl ?? false;
  return (
    <>
      {phone && (
        <a
          className="text-sm text-stone-500 hover:text-cyan-700"
          href={getRawPhoneNumber(phone, true) || undefined}
        >
          <FontAwesomeIcon className="mr-2 " icon={faPhone} /> {phone}
        </a>
      )}
      {email && (
        <a
          className="text-sm text-stone-500 hover:text-cyan-700"
          href={`mailto:${email}`}
        >
          <FontAwesomeIcon className="mr-2 " icon={faEnvelope} /> {email}
        </a>
      )}

      {website && (
        <Link
          className="text-sm uppercase text-stone-500 hover:text-cyan-700"
          href={website}
        >
          <FontAwesomeIcon className="mr-2 " icon={faGlobe} />
          <span className="text-xs font-semibold tracking-wide">
            {prettyUrl(website, shortenUrl)}
          </span>
        </Link>
      )}
    </>
  );
}

export function TagList({ tags }: { tags: Tag[] }) {
  return (
    <div className="flex flex-wrap">
      {tags.map((tag) => (
        <TagLink key={tag.tag} tag={tag.tag} />
      ))}
    </div>
  );
}

export function OrganizationItem({
  org,
  admin,
}: {
  org: OrgProps;
  admin: boolean;
}) {
  return (
    <div className="m-6  flex w-full max-w-5xl rounded shadow  border border-stone-300 p-3 px-4 text-stone-700 transition-colors">
      <div className="mr-6 w-96">
        <h2 className="text-xl  font-bold text-stone-500 transition-colors  duration-75 ">
          <Link href={`/org/${org.id}`} className="hover:text-rose-500">
            {org.name}
          </Link>{" "}
          {admin && (
            <Link href={`/org/${org.id}/edit`} className="">
              <FontAwesomeIcon
                className="text-stone-500 hover:text-rose-500"
                icon={faEdit}
              />
            </Link>
          )}
        </h2>
        <div className="flex flex-col">
          <ContactInfo {...org} />
        </div>
      </div>
      <div className="flex h-fit basis-80 flex-col flex-wrap text-xs">
        <p className="mb-2 text-base">
          <span> Category: </span>
          <Link
            href={`/cat/${org.category}`}
            className="font-bold text-stone-500 hover:text-rose-500"
          >
            {org.category}
          </Link>
        </p>
        <TagList tags={org.tags} />
      </div>
    </div>
  );
}

function OrganizationSection({
  orgs,
  admin,
}: {
  orgs: OrgProps[];
  admin: boolean;
}) {
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
        <OrganizationItem admin={admin} key={org.id} org={org} />
      ))}
    </div>
  );
}

export default function OrganizationsPage({
  userSession,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: orgs } = api.organization.getAll.useQuery();
  const admin = userSession?.user?.admin || false;
  return (
    <div id="AppElement">
      <NavBar />
      <div className="pt-16">
        {admin && <CreateOrganizationModal />}
        {orgs && <OrganizationSection orgs={orgs} admin={admin} />}
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
