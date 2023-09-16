import NavBar from "../../../components/Nav";
import {
  CategorySelect,
  type CategorySelectItem,
  TagSelect,
  CommunitySelect,
  OrganizationMultiSelect,
  OrganizationSingleSelect,
  getValidMultivalueArray,
} from "../../../components/Selectors";
import { api } from "../../../utils/api";
import { useState } from "react";
import type {
  Category,
  Community,
  Organization,
  Program,
  Tag,
} from "@prisma/client";
import type { MultiValue } from "react-select";
import type { GetServerSideProps } from "next";
import { prisma } from "../../../server/db";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";

type ProgramReturn =
  | (Program & {
      organization: Organization;
      tags: Tag[];
      categoryMeta: Category;
      exclusiveToCommunities: Community[];
      helpfulToCommunities: Community[];
      helpingOrganizations: Organization[];
    })
  | null
  | undefined;

export function getPartnerOrgArray(program: ProgramReturn) {
  if (!program) return [];
  return program.helpingOrganizations.map((org) => ({
    value: org.name,
    label: org.name,
  }));
}

export default function EditProgramPage(props: ServerSideProps) {
  const { program, communityList, orgList } = props;

  const [adminOrg, setAdminOrg] = useState<{ value: string; label: string }>({
    value: program?.organization?.name || "",
    label: program?.organization?.name || "",
  });

  const updateProgram = api.program.update.useMutation();

  const newAdminOrg = api.program.reassignAdministeringOrg.useMutation();

  const [formData, setFormData] = useState({
    ...program,
    helpingOrganizations: program.helpingOrganizations,
    organization: {
      name: program?.organization?.name,
      id: program?.organizationId,
    },
  });

  if (!program) return <div>Loading...</div>;

  return (
    <div className="bg-stone-50">
      <NavBar />
      <div className="bg-stone-50 px-9 pt-14 text-4xl font-bold capitalize">
        Edit {program.name}
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
              onChange={(value, foo) => {
                console.log(foo.action);
                const communities = (
                  value as { value: string; label: string }[]
                ).map((community) => {
                  return { name: community.label, id: community.value };
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
                  return { name: community.label, id: community.value };
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
                  programId: program.id,
                  orgId: organization.value,
                });

                setAdminOrg(organization);
              }}
            />
            <OrganizationMultiSelect
              title="Partner Organizations"
              options={orgList}
              value={getValidMultivalueArray(
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
              updateProgram.mutate({
                id: program.id,
                orgId: program.organization.id,
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

type CommunityPick = Pick<Community, "name" | "id">;

type ServerSideProps = {
  program: Program & {
    tags: Tag[];
    organization: SelectedOrgProps;
    exclusiveToCommunities: CommunityPick[];
    helpfulToCommunities: CommunityPick[];
    helpingOrganizations: SelectedOrgProps[];
  };
  programId: string;
  session: Session;
  orgList: MultiValue<CategorySelectItem>;
  communityList: MultiValue<CategorySelectItem>;
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const programId = context.params?.id as string;

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

  const program = await prisma.program.findUnique({
    where: {
      id: programId,
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

  if (!program) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      program: { ...program },
      programId: programId,
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
