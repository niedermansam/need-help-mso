import { useState } from "react";
import NavBar from "../../../components/Nav";
import { api } from "../../../utils/api";
import { CreateResourceForm } from "../../resource";
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
import type { OrgServerSideProps } from "../[id]";

function CreateOrganizationForm({ orgData }: OrgServerSideProps) {
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
  const addOrg = api.organization.update.useMutation();
  const disconnectTag = api.organization.disconnectTag.useMutation();
  return (
    <div className="mx-6 max-w-md bg-gray-100 p-6">
      <h1>Edit Organization</h1>
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
          value={formData.website || ""}
          onChange={(e) =>
            setFormData({ ...formData, website: e.target.value })
          }
        />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          name="phone"
          id="phone"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
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

        <CommunitySelect
          title="Exclusive to Communities"
          value={formData.exclusiveToCommunities.map((x) => ({
            label: x,
            value: x,
          }))}
          isMulti
          onChange={(value) => {
            if (!value)
              return setFormData({ ...formData, exclusiveToCommunities: [] });
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

        <button
          type="button"
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
        </button>
      </form>
    </div>
  );
}
export default function EditOrgPage({
  orgData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <NavBar />
      <p>Edit Organization</p>
      {orgData ? <CreateOrganizationForm orgData={orgData} /> : null}
      <h2>Add Resource</h2>
      {orgData ? <CreateResourceForm orgId={orgData.id} /> : null}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<
  OrgServerSideProps
> = async (context) => {
  const orgId = context.query.id as string;

  const session = await getSession(context);

  if (!session || !session.user || !session.user.admin) {
    return {
      redirect: {
        destination: "/login",
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
      resources: true,
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
    props: { orgData: propsData },
  };
};
