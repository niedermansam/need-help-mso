import type { StateManagerProps } from "react-select/dist/declarations/src/useStateManager";
import { api } from "../utils/api";
import Select, { MultiValue, SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

export type CategorySelectItem = {
  value: string;
  label: string;
};

export type CategorySelectProps = StateManagerProps<CategorySelectItem> & {
  title?: string;
  options?: SingleValue<CategorySelectItem> | MultiValue<CategorySelectItem>;
};

export type TagSelectProps = CategorySelectProps & {
  tags: string[];
};

export const isValidCategory = (
  category: SingleValue<CategorySelectItem> | MultiValue<CategorySelectItem>
): category is Exclude<SingleValue<CategorySelectItem>, null> => {
  return (
    category !== null &&
    category !== undefined &&
    category.hasOwnProperty("value") &&
    category.hasOwnProperty("label")
  );
};

export const getCategoryString = (
  category: SingleValue<CategorySelectItem> | MultiValue<CategorySelectItem>
): string => {
  if (isValidCategory(category)) {
    return category.value;
  }
  return "";
}

export function CategorySelect({ title, ...attributes }: CategorySelectProps) {
  const { data } = api.getCategoryList.useQuery();
  return (
    <>
      <h2>{title || "Category"}</h2>
      <CreatableSelect
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

export const isValidTagArray = ( tags: SingleValue<CategorySelectItem> | MultiValue<CategorySelectItem> ): tags is MultiValue<CategorySelectItem> => {
  const tagIsValid = 
    tags !== null &&
    tags !== undefined &&
    Array.isArray(tags)

  return tagIsValid
}

export const getTagArray = ( tags: SingleValue<CategorySelectItem> | MultiValue<CategorySelectItem> ): string[] => {
  if (!isValidTagArray(tags)) return []
    return tags.map(tag => tag.value)
}

export function TagSelect({ title, ...attributes }: CategorySelectProps) {
  const { options } = attributes;
  const { data } = api.tag.getAll.useQuery(undefined, {
    enabled: !options,
  });
  return (
    <>
      <h2>{title || "Tags"}</h2>
      <CreatableSelect
        {...attributes}
        isMulti={true}
        options={
          options
            ? options
            : data?.map((tag) => ({
                value: tag.tag,
                label: tag.tag,
              }))
        }
      />
    </>
  );
}

export function CommunitySelect({ title, options, ...attributes }: CategorySelectProps) {
  const { data } = api.community.getAll.useQuery(undefined, {
    enabled: !options,
  });
  
  return (
    <>
      <h2>{title || "Community"}</h2>
      <CreatableSelect
        {...attributes}
        isMulti={true}
        isClearable
        options={
          options ? options :
          data?.map((community) => ({
            value: community.name,
            label: community.name,
          })) ?? []
        }
      />
    </>
  );
}
