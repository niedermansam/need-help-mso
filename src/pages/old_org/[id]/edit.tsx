import { useState } from "react";
import NavBar from "../../../components/Nav";
import { api } from "../../../utils/api";
import { CreateProgramModal } from "../../program";
import {
  CategorySelect,
  CommunitySelect,
  TagSelect,
} from "../../../components/Selectors";
import type { MultiValue, SingleValue } from "react-select";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import { prisma } from "../../../server/db";
import { getSession } from "next-auth/react";
import type { Community, Organization, Program, Tag } from "@prisma/client";
import type { Session } from "next-auth";

function CreateOrganizationForm({ orgData }: ServerSideProps) {
  const {
    id: orgId,
    name,
    description,
    website,
    email,
    phone,
    category,
    tags,
    exclusiveToCommunities,
    helpfulToCommunities,
  } = orgData;

  const INITIAL_STATE = {
    id: orgId,
    name: name,
    description: description,
    website: website,
    email,
    phone,
    category,
    tags: tags.map((x) => x.tag),
    exclusiveToCommunities: exclusiveToCommunities.map((x) => x.name),
    helpfulToCommunities: helpfulToCommunities.map((x) => x.name),
  } as const;

  const [formData, setFormData] = useState({ ...INITIAL_STATE });
  // const addOrg = api.organization.update.useMutation();
  const disconnectTag = api.organization.disconnectTag.useMutation();
  return (
    <div className="bg-stone-50 text-stone-600">
      <div className="mx-6 pt-8 ">
        <h1 className="mb-3 text-4xl font-bold">Edit Organization</h1>
        <form className="flex">
          <div className="mx-3 flex w-4/12 flex-col">
            <label htmlFor="name" className="text-lg font-light">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              className="mb-3 rounded border border-stone-300 px-2 py-1.5"
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
              className="mb-3 h-36 rounded border border-stone-300 px-2  py-1.5"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {/*<button
              type="button"
              className="mb-6 rounded bg-rose-500 px-2 py-1.5 font-bold uppercase tracking-wider text-rose-50"
              onClick={() =>
                addOrg.mutate({
                  ...INITIAL_STATE,
                  ...formData,
                  website: formData.website || undefined,
                  tags: formData.tags.map((x) => x.trim()),
                })
              }
            >
              Submit
            </button>*/}
          </div>

          <div className="mx-3 flex w-2/12 flex-col">
            <label className="text-lg font-light" htmlFor="website">
              Website
            </label>
            <input
              type="text"
              name="website"
              id="website"
              className="mb-3 rounded border border-stone-300 px-2  py-1.5 "
              value={formData.website || ""}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
            />
            <label className="text-lg font-light" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="mb-3 rounded border border-stone-300 px-2  py-1.5 "
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <label className="text-lg font-light" htmlFor="phone">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="mb-3 rounded border border-stone-300 px-2  py-1.5 "
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <div className="mb-6 flex h-full flex-col items-center justify-end">
              <CreateProgramModal orgId={orgData.id} />
            </div>
          </div>

          <div className="mx-3 flex w-4/12 flex-col">
            <CategorySelect
              value={
                formData.category
                  ? { value: formData.category, label: formData.category }
                  : undefined
              }
              onChange={(value) => {
                if (!value) return setFormData({ ...formData, category: "" });
                const newValue = value as SingleValue<{
                  label: string;
                  value: string;
                }>;
                setFormData({ ...formData, category: newValue?.value || "" });
              }}
            />
            <TagSelect
              value={formData.tags.map((x) => ({ label: x, value: x }))}
              isMulti
              className="text-sm"
              onChange={(value) => {
                if (!value) return setFormData({ ...formData, tags: [] });
                const newTags = (
                  value as MultiValue<{
                    label: string;
                    value: string;
                  }>
                ).map((x) => x.value);

                const oldTags = formData.tags.map((x) => x.trim());

                // check if any tags have been removed from oldTags
                const removedTags = oldTags.filter((x) => !newTags.includes(x));

                console.log(removedTags);

                if (removedTags.length > 0) {
                  // remove the tags from the org
                  removedTags.forEach((tag) => {
                    disconnectTag.mutate({ orgId: orgId, tag: tag });
                  });
                }

                setFormData({ ...formData, tags: newTags });
              }}
            />
          </div>

          <div className="mx-3 flex w-1/3 flex-col">
            <CommunitySelect
              title="Exclusive to Communities"
              value={formData.exclusiveToCommunities.map((x) => ({
                label: x,
                value: x,
              }))}
              isMulti
              onChange={(value) => {
                if (!value)
                  return setFormData({
                    ...formData,
                    exclusiveToCommunities: [],
                  });
                const newValue = value as MultiValue<{
                  label: string;
                  value: string;
                }>;
                setFormData({
                  ...formData,
                  exclusiveToCommunities: newValue.map((x) => x.value),
                });
              }}
            />

            <CommunitySelect
              title="Helpful to Communities"
              value={formData.helpfulToCommunities.map((x) => ({
                label: x,
                value: x,
              }))}
              isMulti
              onChange={(value) => {
                if (!value)
                  return setFormData({ ...formData, helpfulToCommunities: [] });
                const newValue = value as MultiValue<{
                  label: string;
                  value: string;
                }>;
                setFormData({
                  ...formData,
                  helpfulToCommunities: newValue.map((x) => x.value),
                });
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
export default function EditOrgPage({
  orgData,
  userSession,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <NavBar />
      <p>Edit Organization</p>
      {orgData ? (
        <CreateOrganizationForm userSession={userSession} orgData={orgData} />
      ) : null}
    </div>
  );
}

type ServerSideProps = {
  userSession: Session;
  orgData: Omit<Organization, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  } & {
    tags: Tag[];
    exclusiveToCommunities: Community[];
    helpfulToCommunities: Community[];
    programs: Program[];
  };
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const orgId = context.query.id as string;

  const session = await getSession(context);

  if (!session || !session.user || !session.user.admin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const returnData = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
    include: {
      tags: true,
      exclusiveToCommunities: true,
      helpfulToCommunities: true,
      programs: true,
    },
  });

  if (!returnData) {
    return {
      notFound: true,
    };
  }

  const propsData = {
    ...returnData,
    createdAt: returnData.createdAt.toISOString(),
    updatedAt: returnData.updatedAt.toISOString(),
  };

  return {
    props: { orgData: propsData, userSession: session },
  };
};
