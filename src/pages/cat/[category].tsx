import { useRouter } from "next/router";
import NavBar from "../../components/Nav";
import { api } from "../../utils/api";
import { ResourceItem } from "../resource";
import { decodeTag } from "../../utils/manageUrl";
import { useState } from "react";
import { TagSelect } from "../../components/Selectors";

export default function CategoryPage() {
  const { category: URI } = useRouter().query;
  const category = decodeTag(URI as string);

  const {
    data: returnData,
    isLoading,
    isError,
  } = api.resource.getByCategory.useQuery(category, {
    enabled: !!category,
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([
  ]);

  const [strictFilter, setStrictFilter] = useState<boolean>(false);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>failed to load</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="px-5 pt-20 text-5xl font-light capitalize">
        {category}
      </div>
      <TagSelect
        options={returnData?.tags?.map((tag) => {
          return { value: tag, label: tag };
        })}
        onChange={(selected) => {
          if (!selected) setSelectedTags([]);
          const selectedTags = selected as { value: string; label: string }[];
          setSelectedTags(selectedTags.map((tag) => tag.value));
        }}
      />
      <div>
        <input
          type="checkbox"
          name="strictFilter"
          id="strictFilter"
          checked={strictFilter}
          className="mr-2"
          onChange={() => setStrictFilter(!strictFilter)}
        />
        <label htmlFor="strictFilter">Strict Filter?</label>
      </div>
      {returnData?.resources
        ?.filter((resource) => {
          if (selectedTags.length === 0) return true;
          const resourceTags = resource.tags.map((tag) => tag.tag);
          if(!strictFilter) return selectedTags.some((tag) => resourceTags.includes(tag));
          if(strictFilter) return selectedTags.every((tag) => resourceTags.includes(tag));
        })
        .map((resource) => (
          <ResourceItem resource={resource} key={resource.id} />
        ))}
    </div>
  );
}
