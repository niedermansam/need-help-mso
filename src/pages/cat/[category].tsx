import { useRouter } from "next/router";
import NavBar from "../../components/Nav";
import { decodeTag } from "../../utils/manageUrl";
import { useEffect, useState } from "react";
import { TagSelect } from "../../components/Selectors";
import { prisma } from "../../server/db";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ProgramCard } from "../../components/DisplayCard";
import { useSession } from "next-auth/react";
import { getSessionDetails } from "../../utils";
import { api } from "../../utils/api";

export default function CategoryPage({
  programs,
  tags: allTags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { category: URI } = useRouter().query;
  const category = decodeTag(URI as string);

  const session = useSession().data;

  const isLoggedIn = !!session?.user;

  const sessionDetails = getSessionDetails(session);

  const { data: favorites } = api.user.getCurrentFavoritesList.useQuery(
    undefined,
    { enabled: isLoggedIn }
  );

  console.log(sessionDetails);

  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const [visiblePrograms, setVisiblePrograms] =
    useState<typeof programs>(programs);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [strictFilter, setStrictFilter] = useState<boolean>(false);

  useEffect(() => {
    console.log("dammit");
    const filteredPrograms = programs.filter((program) => {
      if (selectedTags.length === 0) return true;
      const programTags = program.tags.map((tag) => tag.tag);
      if (strictFilter) {
        return selectedTags.every((tag) => programTags.includes(tag));
      } else {
        return selectedTags.some((tag) => programTags.includes(tag));
      }
    });
    setVisiblePrograms(filteredPrograms);

    const tagsInVisiblePrograms = filteredPrograms
      .map((program) => program.tags.map((tag) => tag.tag))
      .flat();

    if (strictFilter === false) {
      return setAvailableTags(allTags);
    } else {
      return setAvailableTags(tagsInVisiblePrograms);
    }
  }, [selectedTags, strictFilter, programs, allTags]);

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
      {visiblePrograms.map((program) => (
        <ProgramCard
          program={program}
          key={program.id}
          admin={sessionDetails.admin}
          loggedIn={sessionDetails.loggedIn}
          favoritesArray={favorites?.programs || []}
        />
      ))}
    </div>
  );
}

type ServerSideProps = {
  programs: ProgramReturn;
  category: string;
  tags: string[];
};

type ProgramReturn = {
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
  free: boolean;
}[];

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context
) => {
  const category = context.query.category as string;

  const programs = await prisma.program.findMany({
    where: {
      category: {
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
      free: true,
    },
  });

  const tags = programs
    .map((program) => program.tags.map((tag) => tag.tag))
    .flat();

  const uniqueTags = [...new Set(tags)];

  return {
    props: {
      category: category,
      programs: programs,
      tags: uniqueTags,
    },
  };
};
