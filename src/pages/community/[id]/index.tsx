import type { Session } from "next-auth";
import NavBar from "../../../components/Nav";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { prisma } from "../../../server/db";
import type { Community, Program, Tag } from "@prisma/client";
import {
  type OrgCardProps,
  OrganizationCard,
  ProgramCard,
} from "../../../components/DisplayCard";
import {
  CategorySelect,
  TagSelect,
  getValidMultivalueArray,
  getValidSingleValue,
} from "../../../components/Selectors";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../utils/api";

export default function CommunityProgramsPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const session = useSession();
  const isAdmin = props.admin;
  const communityHasOrgs =
    props.data.exclusiveOrgs.length > 0 || props.data.helpfulOrgs.length > 0;

  const communityHasPrograms =
    props.data.exclusivePrograms.length > 0 ||
    props.data.helpfulPrograms.length > 0;
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

  const allPrograms = useMemo(() => {
    return props.data.exclusivePrograms.concat(props.data.helpfulPrograms);
  }, [props.data.exclusivePrograms, props.data.helpfulPrograms]);

  const [visibleOrgs, setVisibleOrgs] = useState<OrgCardProps[]>(allOrgs);
  const [visiblePrograms, setVisiblePrograms] =
    useState<ProgramReturn[]>(allPrograms);

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
    let newPrograms = allPrograms;
    if (selectedCategory !== undefined) {
      newPrograms = newPrograms.filter(
        (program) => program.category === selectedCategory
      );
    }
    if (selectedTags.length > 0) {
      newPrograms = newPrograms.filter((program) => {
        const programTags = program.tags.map((tag) => tag.tag);
        if (strict) {
          return selectedTags.every((tag) => programTags.includes(tag));
        } else {
          return selectedTags.some((tag) => programTags.includes(tag));
        }
      });
    }

    setVisiblePrograms(newPrograms);
  }, [selectedCategory, selectedTags, allPrograms, strict]);

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
        {communityHasPrograms && (
          <div>
            <h2 className="text-2xl font-bold text-gray-700">Programs</h2>
            {visiblePrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                admin={isAdmin}
                favoritesArray={favorites?.programs || []}
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

type ProgramReturn = Pick<
  Program,
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
  exclusivePrograms: ProgramReturn[];
  helpfulPrograms: ProgramReturn[];
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const session = await getSession(context);

  const isAdmin = session ? session.user.admin : false;

  const communityId = context.query.id as string;

  const selectProgramsObject = {
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

  const programs = await prisma.community.findUnique({
    where: {
      id: communityId,
    },
    include: {
      exclusivePrograms: selectProgramsObject,
      helpfulPrograms: selectProgramsObject,

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

  if (!programs) {
    return {
      notFound: true,
    };
  }

  const categorySet = new Set<string>();

  const exclusiveResouceTags = programs.exclusivePrograms.flatMap((program) => {
    categorySet.add(program.category);
    return program.tags.map((tag) => tag.tag);
  });

  const helpfulProgramTags = programs.helpfulPrograms.flatMap((program) => {
    categorySet.add(program.category);
    return program.tags.map((tag) => tag.tag);
  });

  const exclusiveOrgTags = programs.exclusiveOrgs.flatMap((org) => {
    categorySet.add(org.category);
    return org.tags.map((tag) => tag.tag);
  });

  const helpfulOrgTags = programs.helpfulOrgs.flatMap((org) => {
    categorySet.add(org.category);
    return org.tags.map((tag) => tag.tag);
  });

  const allTags = [
    ...exclusiveResouceTags,
    ...helpfulProgramTags,
    ...exclusiveOrgTags,
    ...helpfulOrgTags,
  ];

  const uniqueTags = [...new Set(allTags)];

  const categoryArray = Array.from(categorySet);

  return {
    props: {
      userSession: session,
      data: programs,
      admin: isAdmin,
      tags: uniqueTags,
      categories: categoryArray,
    },
  };
};
