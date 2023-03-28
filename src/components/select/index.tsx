import type { StateManagerProps } from "react-select/dist/declarations/src/useStateManager";
import { api } from "../../utils/api";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

export type CategorySelectItem = {
  value: string;
  label: string;
};

export type CategorySelectProps = StateManagerProps<CategorySelectItem> & {
  title?: string;
};

export type TagSelectProps = CategorySelectProps & {
  tags: string[];
}

export function CategorySelect({title, ...attributes }: CategorySelectProps) {
  
  const { data } = api.getCategoryList.useQuery();
  return (
    <>
      <h2>{title || 'Category'}</h2>
      <Select
        {...attributes}
        isClearable
        options={
          data?.map((category) => ({
            value: category.category,
            label: category.category,
          })) ?? []
        }
      />
    </>
  );
}

export function TagSelect({ title,  ...attributes }: CategorySelectProps) {
  const { data } = api.tag.getAll.useQuery();
  return (
    <>
      <h2>{title || "Tags"}</h2>
      <CreatableSelect
        {...attributes}
        isMulti={true}
        options={
          data?.map((tag) => ({
            value: tag.tag,
            label: tag.tag,
          })) ?? []
        }
      />
    </>
  );
}

export function CommunitySelect({ title, ...attributes }: CategorySelectProps) {
  const { data } = api.community.getAll.useQuery();
  return (
    <>
      <h2>{title || "Community"}</h2>
      <CreatableSelect
        {...attributes}
        isClearable
        options={
          data?.map((community) => ({
            value: community.name,
            label: community.name,
          })) ?? []
        }
      />
    </>
  );
}
