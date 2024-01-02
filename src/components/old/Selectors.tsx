import type { StateManagerProps } from "react-select/dist/declarations/src/useStateManager";
import { api } from "@/utils/api";
import type { MultiValue, SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

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
};

export function CategorySelect({ title, categories , ...attributes }: CategorySelectProps & {
  categories?: string[];
}) {
  const { data } = api.getCategoryList.useQuery();

  const label = title === undefined ? "Category" : title;
  return (
    <>
      <label className="text-lg font-light">{label}</label>
      <CreatableSelect
        className="mb-2.5"
        {...attributes}
        isClearable
        options={
          categories ? categories.map(cat => {return {
            value: cat,
            label: cat,
          }}) : data?.map((category) => ({
            value: category.category,
            label: category.category,
          })) ?? []
        }
      />
    </>
  );
}

export const isValidTagArray = (
  tags: SingleValue<CategorySelectItem> | MultiValue<CategorySelectItem>
): tags is MultiValue<CategorySelectItem> => {
  const tagIsValid = tags !== null && tags !== undefined && Array.isArray(tags);

  return tagIsValid;
};

export const getTagArray = (
  tags: SingleValue<CategorySelectItem> | MultiValue<CategorySelectItem>
): string[] => {
  if (!isValidTagArray(tags)) return [];
  return tags.map((tag) => tag.value);
};

export function TagSelect({ title, ...attributes }: CategorySelectProps) {
  const { options } = attributes;
  const { data } = api.tag.getAll.useQuery(undefined, {
    enabled: !options,
  });

  const label = title === undefined ? "Tags" : title;

  return (
    <>
      <label className="text-lg font-light">{label}</label>
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

export function CommunitySelect({
  title,
  options,
  ...attributes
}: CategorySelectProps) {
  const { data } = api.community.getAll.useQuery(undefined, {
    enabled: !options,
  });

  const label = title === undefined ? "Community" : title;

  return (
    <>
      <label className="text-lg font-light">{label}</label>
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

export function SpeedOfAidSelect({
  title,
  options,
  ...attributes
}: CategorySelectProps) {
  type SpeedOfAidOption = {
    value: string;
    label: string;
  };

  const optionList: SpeedOfAidOption[] = [
    { value: '0', label: "Immediate" },
    { value: '1', label: "Days" },
    { value: '2', label: "Weeks" },
    { value: '3', label: "Months" },
    { value: '4', label: "Years" },
  ];

  return (
    <>
      <label className="text-lg font-light">{title || "Speed of Aid"}</label>
      <Select
        className="mb-2.5"
        {...attributes}
        isClearable
        options={options ? options : optionList}
      />
    </>
  );
}

export function BarriersToEntrySelect({
  title,
  options,
  ...attributes
}: CategorySelectProps) {
  type BarriersToEntryOption = {
    value: string;
    label: string;
  };

  const optionList: BarriersToEntryOption[] = [
    { value: 
      "0", label: "Minimal" },
    { value: "1", label: "Low" },
    { value: "2", label: "Medium" },
    { value: "3", label: "High" },
  ];

  return (
    <>
      <label className="text-lg font-light">
        {title || "Barriers to Entry"}
      </label>
      <Select
        className="mb-2.5"
        {...attributes}
        isClearable
        options={options ? options : optionList}
      />
    </>
  );
}

export const validateMultivalueArray = (
  array: MultiValue<CategorySelectItem> | CategorySelectItem
): array is MultiValue<CategorySelectItem> => {
  return array !== null && array !== undefined && Array.isArray(array);
};

export const getValidMultivalueArray = (
  array: MultiValue<CategorySelectItem> | CategorySelectItem
): MultiValue<CategorySelectItem> => {
  let copy;
  console.log(copy)
  if (validateMultivalueArray(array)) {
    copy = array;
    return copy;
  }
  return [];
};



export const validateSingleValue = (
  value: unknown
): value is SingleValue<CategorySelectItem> => {
  return value !== null && value !== undefined && !Array.isArray(value) && typeof value === "object" && "value" in value && "label" in value;
};

export const getValidSingleValueObject = (
  value: unknown
): SingleValue<CategorySelectItem> => {
  if (validateSingleValue(value)) {
    return value;
  }
  return null;
}

export const getValidSingleValue = (
  value: unknown
): string | undefined => {
  if(value === null || value === undefined) return undefined;
  if (validateSingleValue(value)) {
    return value.value;
  }
  return undefined;
}


export function OrganizationMultiSelect({
  title,
  options,
  ...attributes
}: CategorySelectProps) {
  const { data } = api.organization.getAll.useQuery(undefined, {
    enabled: !options,
  });

  return (
    <>
      <label className="text-lg font-light">{title || "Organization(s)"}</label>
      <Select
        className="mb-2.5"
        {...attributes}
        isMulti={true}
        isClearable
        options={
          options
            ? options
            : data?.map((organization) => ({
                value: organization.id,
                label: organization.name,
              })) ?? []
        }
      />
    </>
  );
}

export function OrganizationSingleSelect({
  options,
  ...attributes
}: CategorySelectProps) {
  const { data } = api.organization.getAll.useQuery(undefined, {
    enabled: !options,
  });

  return (
      <Select
        className="mb-2.5"
        {...attributes}
        options={
          options
            ? options
            : data?.map((organization) => ({
                value: organization.id,
                label: organization.name,
              })) ?? []
        }
      />
  );
}
