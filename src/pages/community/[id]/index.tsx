import type { Session } from "next-auth";
import NavBar from "../../../components/Nav";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { prisma } from "../../../server/db";
import type { Community, Resource, Tag } from "@prisma/client";
import {
  type OrgCardProps,
  OrganizationCard,
  ResourceCard,
} from "../../../components/DisplayCard";
import {
  CategorySelect,
  TagSelect,
  getValidMultivalueArray,
  getValidSingleValue,
} from "../../../components/Selectors";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../utils/api";

export default function CommunityResourcesPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const session = useSession();
  const isAdmin = props.admin;
  const communityHasOrgs =
    props.data.exclusiveOrgs.length > 0 || props.data.helpfulOrgs.length > 0;

  const communityHasResources =
    props.data.exclusiveResources.length > 0 ||
    props.data.helpfulResources.length > 0;
  const isLoggedIn = !!session.data?.user;

  const { data: favorites } = api.user.getCurrentFavoritesList.useQuery(
    undefined,
    {
      enabled: isLoggedIn,
    }
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [strict, setStrict] = useState(false);

  const allOrgs = useMemo(() => {
    return props.data.exclusiveOrgs.concat(props.data.helpfulOrgs);
  }, [props.data.exclusiveOrgs, props.data.helpfulOrgs]);

  const allResources = useMemo(() => {
    return props.data.exclusiveResources.concat(props.data.helpfulResources);
  }, [props.data.exclusiveResources, props.data.helpfulResources]);

  const [visibleOrgs, setVisibleOrgs] = useState<OrgCardProps[]>(allOrgs);
  const [visibleResources, setVisibleResources] =
    useState<ResourceReturn[]>(allResources);

  useEffect(() => {
    let newOrgs = allOrgs;
    if (selectedCategory !== undefined) {
      newOrgs = newOrgs.filter((org) => org.category === selectedCategory);
    }
    if (selectedTags.length > 0) {
      newOrgs = newOrgs.filter((org) => {
        const orgTags = org.tags.map((tag) => tag.tag);
        if (strict) {
          return selectedTags.every((tag) => orgTags.includes(tag));
        } else {
          return selectedTags.some((tag) => orgTags.includes(tag));
        }
      });
    }

    setVisibleOrgs(newOrgs);
  }, [selectedCategory, selectedTags, allOrgs, strict]);

  useEffect(() => {
    let newResources = allResources;
    if (selectedCategory !== undefined) {
      newResources = newResources.filter(
        (resource) => resource.category === selectedCategory
      );
    }
    if (selectedTags.length > 0) {
      newResources = newResources.filter((resource) => {
        const resourceTags = resource.tags.map((tag) => tag.tag);
        if (strict) {
          return selectedTags.every((tag) => resourceTags.includes(tag));
        } else {
          return selectedTags.some((tag) => resourceTags.includes(tag));
        }
      });
    }

    setVisibleResources(newResources);
  }, [selectedCategory, selectedTags, allResources, strict]);

  return (
    <div>
      <NavBar />
      <div className="mx-4 pt-12">
        <h1 className=" my-2 text-4xl font-bold text-gray-700">
          {props.data.name}
        </h1>
        <div>
          <CategorySelect
            categories={props.categories}
            onChange={(value) => {
              if (value === null) {
                setSelectedCategory(undefined);
              } else {
                setSelectedCategory(getValidSingleValue(value));
              }
            }}
          />
          <TagSelect
            options={props.tags.map((tag) => {
              return {
                value: tag,
                label: tag,
              };
            })}
            onChange={(value) => {
              if (value === null) {
                setSelectedTags([]);
                return;
              }
              const newValue = getValidMultivalueArray(value);
              setSelectedTags(
                newValue.map((option) => {
                  return option.value;
                })
              );
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
        {communityHasOrgs && (
          <div>
            <h2 className="text-2xl font-bold text-gray-700">Organizations</h2>
            {visibleOrgs.map((org) => (
              <OrganizationCard
                loggedIn={isLoggedIn}
                favoriteIds={favorites?.organizations || []}
                key={org.id}
                org={org}
                admin={isAdmin}
              />
            ))}
          </div>
        )}
        {communityHasResources && (
          <div>
            <h2 className="text-2xl font-bold text-gray-700">Resources</h2>
            {visibleResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                admin={isAdmin}
                favoritesArray={favorites?.resources || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type ServerSideProps = {
  userSession: Session | null;
  data: DataReturn;
  admin: boolean;
  tags: string[];
  categories: string[];
};

type ResourceReturn = Pick<
  Resource,
  "name" | "id" | "url" | "category" | "organizationId"
> & {
  tags: Pick<Tag, "tag">[];
  organization: {
    name: string;
    id: string;
    website: string | null;
    phone: string | null;
    email: string | null;
  };
};

type DataReturn = Community & {
  exclusiveOrgs: OrgCardProps[];
  helpfulOrgs: OrgCardProps[];
  exclusiveResources: ResourceReturn[];
  helpfulResources: ResourceReturn[];
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const session = await getSession(context);

  const isAdmin = session ? session.user.admin : false;

  const communityId = context.query.id as string;

  const selectResourcesObject = {
    select: {
      tags: {
        select: {
          tag: true,
        },
      },
      category: true,
      id: true,

      name: true,
      url: true,
      organizationId: true,
      organization: {
        select: {
          name: true,
          id: true,
          website: true,
          phone: true,
          email: true,
        },
      },
    },
  } as const;

  const resources = await prisma.community.findUnique({
    where: {
      id: communityId,
    },
    include: {
      exclusiveResources: selectResourcesObject,
      helpfulResources: selectResourcesObject,

      exclusiveOrgs: {
        select: {
          tags: true,
          id: true,
          name: true,
          website: true,
          phone: true,
          email: true,
          category: true,
        },
      },
      helpfulOrgs: {
        select: {
          tags: true,
          id: true,
          name: true,
          website: true,
          phone: true,
          email: true,
          category: true,
        },
      },
    },
  });

  if (!resources) {
    return {
      notFound: true,
    };
  }

  const categorySet = new Set<string>();

  const exclusiveResouceTags = resources.exclusiveResources.flatMap(
    (resource) => {
      categorySet.add(resource.category);
      return resource.tags.map((tag) => tag.tag);
    }
  );

  const helpfulResourceTags = resources.helpfulResources.flatMap((resource) => {
    categorySet.add(resource.category);
    return resource.tags.map((tag) => tag.tag);
  });

  const exclusiveOrgTags = resources.exclusiveOrgs.flatMap((org) => {
    categorySet.add(org.category);
    return org.tags.map((tag) => tag.tag);
  });

  const helpfulOrgTags = resources.helpfulOrgs.flatMap((org) => {
    categorySet.add(org.category);
    return org.tags.map((tag) => tag.tag);
  });

  const allTags = [
    ...exclusiveResouceTags,
    ...helpfulResourceTags,
    ...exclusiveOrgTags,
    ...helpfulOrgTags,
  ];

  const uniqueTags = [...new Set(allTags)];

  const categoryArray = Array.from(categorySet);

  return {
    props: {
      userSession: session,
      data: resources,
      admin: isAdmin,
      tags: uniqueTags,
      categories: categoryArray,
    },
  };
};
