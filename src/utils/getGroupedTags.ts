export function getGroupedTags(
  optionMap: Map<string, string[]> | undefined,
  selectedCategory: string
) {
  const selectedOptions = optionMap?.get(selectedCategory)?.map((x) => {
    return { value: x, label: x };
  });

  const otherOptions = new Set(
    optionMap?.get('all')?.filter((x) => {
        return !optionMap?.get(selectedCategory)?.includes(x);
    })
  );

  return [
    { label: selectedCategory, options: selectedOptions || [] },
    {
      label: "Other",
      options: [...otherOptions].map((x) => {
        return { value: x, label: x };
      }),
    },
  ];
}
