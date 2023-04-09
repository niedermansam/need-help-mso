import { useRouter } from "next/router";
import NavBar from "../../components/Nav";
import { decodeTag } from "../../utils/manageUrl";
import { useEffect, useState } from "react";
import { TagSelect } from "../../components/Selectors";
import { prisma } from "../../server/db";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { BarriersToEntry, SpeedOfAid } from "@prisma/client";
import { ResourceCard } from "../../components/DisplayCard";
import { useSession } from "next-auth/react";
import { getSessionDetails } from "../../utils";
import { api } from "../../utils/api";

export default function CategoryPage({
  resources,
  tags: allTags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { category: URI } = useRouter().query;
  const category = decodeTag(URI as string);

  const session = useSession().data;

  const sessionDetails = getSessionDetails(session);

  const { data: favorites } = api.user.getFavoriteList.useQuery();

  console.log(sessionDetails);

  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const [visibleResources, setVisibleResources] =
    useState<typeof resources>(resources);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [strictFilter, setStrictFilter] = useState<boolean>(false);

  useEffect(() => {
    console.log("dammit");
    const filteredResources = resources.filter((resource) => {
      if (selectedTags.length === 0) return true;
      const resourceTags = resource.tags.map((tag) => tag.tag);
      if (strictFilter) {
        return selectedTags.every((tag) => resourceTags.includes(tag));
      } else {
        return selectedTags.some((tag) => resourceTags.includes(tag));
      }
    });
    setVisibleResources(filteredResources);

    const tagsInVisibleResources = filteredResources
      .map((resource) => resource.tags.map((tag) => tag.tag))
      .flat();

    if (strictFilter === false) {
      return setAvailableTags(allTags);
    } else {
      return setAvailableTags(tagsInVisibleResources);
    }
  }, [selectedTags, strictFilter, resources, allTags]);

  return (
    <div>
      <NavBar />
      <div className="px-5 pt-20 text-5xl font-light capitalize">
        {category}
      </div>
      <TagSelect
        options={availableTags.map((tag) => ({ value: tag, label: tag }))}
        onChange={(selected) => {
          if (!selected) setSelectedTags([]);
          const selectedTags = selected as { value: string; label: string }[];
          const selectedTagsValues = selectedTags.map((tag) => tag.value);
          setSelectedTags(selectedTagsValues);

          umami.trackEvent("filter", {
            type: "tag",
            tags: selectedTagsValues.join(","),
          });
        }}
      />
      <div>
        <input
          type="checkbox"
          name="strictFilter"
          id="strictFilter"
          checked={strictFilter}
          className="mr-2"
          onChange={() => {
            const newFilterState = !strictFilter;
            setStrictFilter(newFilterState);
            umami.trackEvent("filter", {
              type: "tag",
              details: `strict-${newFilterState.toString()}`,
            });
          }}
        />
        <label htmlFor="strictFilter">Strict Filter?</label>
      </div>
      {visibleResources.map((resource) => (
        <ResourceCard
          resource={resource}
          key={resource.id}
          admin={sessionDetails.admin}
          loggedIn={sessionDetails.loggedIn}
          favoritesArray={favorites?.resources || []}
        />
      ))}
    </div>
  );
}

type ServerSideProps = {
  resources: ResourceReturn;
  category: string;
  tags: string[];
};

type ResourceReturn = {
  category: string;
  organization: {
    name: string;
    email: string | null;
    website: string | null;
    phone: string | null;
  };
  id: string;
  name: string;
  tags: {
    tag: string;
  }[];
  description: string;
  url: string | null;
  organizationId: string;
  barriersToEntry: BarriersToEntry | null;
  barriersToEntryDetails: string | null;
  speedOfAid: SpeedOfAid[];
  speedOfAidDetails: string | null;
  free: boolean;
}[];

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const category = context.query.category as string;

  const resources = await prisma.resource.findMany({
    where: {
      category: {
        mode: "insensitive",
        equals: category,
      },
    },
    select: {
      category: true,
      organization: {
        select: {
          name: true,
          email: true,
          website: true,
          phone: true,
        },
      },
      id: true,
      name: true,
      tags: {
        select: {
          tag: true,
        },
      },
      description: true,
      url: true,
      organizationId: true,
      barriersToEntry: true,
      barriersToEntryDetails: true,
      speedOfAid: true,
      speedOfAidDetails: true,
      free: true,
    },
  });

  const tags = resources
    .map((resource) => resource.tags.map((tag) => tag.tag))
    .flat();

  const uniqueTags = [...new Set(tags)];

  return {
    props: {
      category: category,
      resources: resources,
      tags: uniqueTags,
    },
  };
};
