import type {
  OrganizationSearchListProps,
  OrganizationSearchProps,
} from "./page";

export const orgIsFilteredByString = (
  org: OrganizationSearchProps,
  searchTerm: string
) => {
  const nameMatch = org.name.toLowerCase().includes(searchTerm.toLowerCase());
  const descriptionMatch = org.description
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const tagMatch = org.tags.some((tag) =>
    tag.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const categoryMatch = org.categories.some((category) =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return nameMatch || descriptionMatch || tagMatch || categoryMatch;
};

export const filterOrganizationsByString = (
  searchOptions: OrganizationSearchListProps,
  searchTerm: string
) => {
  return searchOptions.filter((org) => {
    const nameMatch = org.name.toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = org.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const tagMatch = org.tags.some((tag) =>
      tag.tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const categoryMatch = org.categories.some((category) =>
      category.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return nameMatch || descriptionMatch || tagMatch || categoryMatch;
  });
};
