import NavBar from "../../../components/Nav";
import {
  CategorySelect,
  type CategorySelectItem,
  TagSelect,
  CommunitySelect,
  OrganizationMultiSelect,
  OrganizationSingleSelect,
  getValidatedMultivalueArray,
} from "../../../components/Selectors";
import { api } from "../../../utils/api";
import { useState } from "react";
import type {
  Category,
  Community,
  Organization,
  Resource,
  Tag,
} from "@prisma/client";
import type { MultiValue} from "react-select";
import type { GetServerSideProps } from "next";
import { prisma } from "../../../server/db";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";

type ResourceReturn =
  | (Resource & {
      organization: Organization;
      tags: Tag[];
      categoryMeta: Category;
      exclusiveToCommunities: Community[];
      helpfulToCommunities: Community[];
      helpingOrganizations: Organization[];
    })
  | null
  | undefined;

export function getPartnerOrgArray(resource: ResourceReturn) {
  if (!resource) return [];
  return resource.helpingOrganizations.map((org) => ({
    value: org.name,
    label: org.name,
  }));
}

export default function EditResourcePage(props: ServerSideProps) {
  const { resource, communityList, orgList } = props;

  const [adminOrg, setAdminOrg] = useState<{ value: string; label: string }>({
    value: resource?.organization?.name || "",
    label: resource?.organization?.name || "",
  });

  const updateResource = api.resource.update.useMutation();

  const newAdminOrg = api.resource.reassignAdministeringOrg.useMutation();

  const [formData, setFormData] = useState({
    ...resource,
    helpingOrganizations: resource.helpingOrganizations,
    organization: {
      name: resource?.organization?.name,
      id: resource?.organizationId,
    },
  });

  if (!resource) return <div>Loading...</div>;

  return (
    <div className="bg-stone-50">
      <NavBar />
      <div className="bg-stone-50 px-9 pt-14 text-4xl font-bold capitalize">
        Edit {resource.name}
      </div>

      <div className="bg-stone-50">
        <form className="mx-6 my-2 flex">
          <div className="mx-4 flex w-96 flex-col">
            <label className="text-lg font-light" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="mb-2.5 rounded border border-stone-300 px-2 py-1.5 "
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              id="name"
            />{" "}
            <label className="text-lg font-light" htmlFor="url">
              URL
            </label>
            <input
              type="text"
              name="url"
              id="url"
              className="mb-2.5 rounded border border-stone-300 px-2 py-1.5 "
              value={formData.url || ""}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
            />
            <label className="text-lg font-light" htmlFor="description">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              className="mb-2.5 h-60 rounded border border-stone-300 px-2 py-1.5 "
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className=" w-92 mx-3">
            <CategorySelect
              value={
                formData.category
                  ? { value: formData.category, label: formData.category }
                  : undefined
              }
              onChange={(value) => {
                const category = (value as CategorySelectItem).value;
                setFormData({ ...formData, category: category });
              }}
            />
            <TagSelect
              value={
                formData.tags
                  ? formData.tags.map((tag) => {
                      return { value: tag.tag, label: tag.tag };
                    })
                  : []
              }
              onChange={(value, action) => {
                if (action.action === "clear") {
                  setFormData({ ...formData, tags: [] });
                  return;
                }

                const tags = (value as { value: string; label: string }[]).map(
                  (tag) => {
                    return { tag: tag.value, description: "" };
                  }
                );

                setFormData({ ...formData, tags: tags });
              }}
            />
            <CommunitySelect
              title="Exclusive To"
              options={communityList}
              isMulti
              value={
                formData.exclusiveToCommunities
                  ? formData.exclusiveToCommunities.map((community) => {
                      return { value: community.name, label: community.name };
                    })
                  : undefined
              }
              onChange={(value) => {
                const communities = (
                  value as { value: string; label: string }[]
                ).map((community) => {
                  return { name: community.value };
                });

                setFormData({
                  ...formData,
                  exclusiveToCommunities: communities,
                });
              }}
            />
            <CommunitySelect
              title="Helpful To"
              options={communityList}
              isMulti
              value={
                formData.helpfulToCommunities
                  ? formData.helpfulToCommunities.map((community) => {
                      return { value: community.name, label: community.name };
                    })
                  : undefined
              }
              onChange={(value) => {
                const communities = (
                  value as { value: string; label: string }[]
                ).map((community) => {
                  return { name: community.value };
                });

                setFormData({ ...formData, helpfulToCommunities: communities });
              }}
            />
            <OrganizationSingleSelect
              title="Administered By"
              value={adminOrg}

              options={orgList}

              onChange={(value) => {
                const organization = value as { value: string; label: string };

                console.log(organization);

                newAdminOrg.mutate({
                  resourceId: resource.id,
                  orgId: organization.value,
                });

                setAdminOrg(organization);
              }}
            />
            <OrganizationMultiSelect
              title="Partner Organizations"
              options={orgList}
              value={getValidatedMultivalueArray(
                formData.helpingOrganizations.map((org) => {
                  return { value: org.name, label: org.name };
                })
              )}
              onChange={(value) => {
                const organizations = value as {
                  value: string;
                  label: string;
                }[];

                setFormData({
                  ...formData,
                  helpingOrganizations: organizations.map((org) => {
                    return { name: org.label, id: org.value };
                  }),
                });
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              console.log(formData);
              updateResource.mutate({
                id: resource.id,
                orgId: resource.organization.id,
                tags: formData.tags
                  ? formData.tags.map((tag) => {
                      return tag.tag;
                    })
                  : [],
                exclusiveTo: formData.exclusiveToCommunities?.map(
                  (community) => {
                    return community.name;
                  }
                ),
                helpfulTo: formData.helpfulToCommunities?.map((community) => {
                  return community.name;
                }),
                barriersToEntry: formData.barriersToEntry || undefined,
                barriersToEntryDetails:
                  formData.barriersToEntryDetails || undefined,
                speedOfAid: formData.speedOfAid || undefined,
                speedOfAidDetails: formData.speedOfAidDetails || undefined,
                free: formData.free,
                helpingOrganizations: formData.helpingOrganizations.map(
                  (org) => {
                    return org.id;
                  }
                ),
              });
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

type SelectedOrgProps = Pick<Organization, "id" | "name">;

type ServerSideProps = {
  resource: Resource & {
    tags: Tag[];
    organization: SelectedOrgProps;
    exclusiveToCommunities: Community[];
    helpfulToCommunities: Community[];
    helpingOrganizations: SelectedOrgProps[];
  };
  resourceId: string;
  session: Session;
  orgList: MultiValue<CategorySelectItem>;
  communityList: MultiValue<CategorySelectItem>;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const resourceId = context.params?.id as string;

  const session = await getSession(context);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (!session.user.admin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const resource = await prisma.resource.findUnique({
    where: {
      id: resourceId,
    },
    include: {
      tags: true,
      organization: {
        select: {
          name: true,
          id: true,
        },
      },

      helpfulToCommunities: true,
      exclusiveToCommunities: true,

      helpingOrganizations: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  const allOrgs = await prisma.organization.findMany({
    select: {
      name: true,
      id: true,
    },
  });

  const allCommunities = await prisma.community.findMany({
    select: {
      name: true,
    },
  });

  if (!resource) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      resource: { ...resource },
      resourceId: resourceId,
      session: session,
      orgList: allOrgs.map((org) => {
        return { label: org.name, value: org.id };
      }),
      communityList: allCommunities.map((community) => {
        return { label: community.name, value: community.name };
      }),
    },
  };
};
