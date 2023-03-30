import type { StateManagerProps } from "react-select/dist/declarations/src/useStateManager";
import { api } from "../utils/api";
import type { MultiValue, SingleValue } from "react-select";
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
      <label className="text-lg font-light">{title || "Category"}</label>
      <CreatableSelect
        className="mb-2.5"
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
      <label className="text-lg font-light">{title || "Tags"}</label>
      <CreatableSelect
        className="mb-2.5"
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
      <label className="text-lg font-light">{title || "Community"}</label>
      <CreatableSelect
        className="mb-2.5"
        {...attributes}
        isMulti={true}
        isClearable
        options={
          options
            ? options
            : data?.map((community) => ({
                value: community.name,
                label: community.name,
              })) ?? []
        }
      />
    </>
  );
}
