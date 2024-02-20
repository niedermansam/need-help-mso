"use client";
import type { OrganizationSearchProps } from "./page";

export const organizationIsInSearch = (
  org: OrganizationSearchProps,
  searchTerm: string,
  orgInclude: {
    name: boolean;
    description: boolean;
    tags: boolean;
    categories: boolean;
    programs: boolean;
  },
  programInclude: {
    name: boolean;
    description: boolean;
    tags: boolean;
    category: boolean;
  },
  tagOptions: {
    selected: Set<string>;
    hidden: Set<string>;
  }
) => {
  const orgTags = org.tags.map((tag) => tag.tag);

  const orgHasHiddenTag = orgTags.some((tag) => tagOptions.hidden.has(tag));
 
 

  if (orgHasHiddenTag) {
    return false;
  }

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

  const programMatch = org.programs.some((program) => {
    const nameMatch = program.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const descriptionMatch =
      program.description &&
      program.description.toLowerCase().includes(searchTerm.toLowerCase());

    const tagMatch = program.tags.some((tag) =>
      tag.tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const categoryMatch = program.category
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let includeMatch = false;

    switch (true) {
      case programInclude.name && nameMatch:
        includeMatch = true;
        break;
      case programInclude.description && descriptionMatch:
        includeMatch = true;
        break;
      case programInclude.tags && tagMatch:
        includeMatch = true;
        break;
      case programInclude.category && categoryMatch:
        includeMatch = true;
        break;
    }

    return includeMatch;
  });

  let includeMatch = false;

  if (orgInclude.name && nameMatch) {
    includeMatch = true;
  }

  if (orgInclude.description && descriptionMatch) {
    includeMatch = true;
  }

  if (orgInclude.tags && tagMatch) {
    includeMatch = true;
  }

  if (orgInclude.categories && categoryMatch) {
    includeMatch = true;
  }

  if (orgInclude.programs && programMatch) {
    includeMatch = true;
  }

  return includeMatch;
};

export const programHasSearchTerm = (
  program: OrganizationSearchProps["programs"][0],
  searchTerm: string | undefined,
  programInclude: {
    name: boolean;
    description: boolean;
    tags: boolean;
    category: boolean;
  }
) => {
  if (!searchTerm) {
    return false;
  }
  const nameMatch = program.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  const descriptionMatch =
    program.description &&
    program.description.toLowerCase().includes(searchTerm.toLowerCase());

  const tagMatch = program.tags.some((tag) =>
    tag.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const categoryMatch = program.category
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  let includeMatch = false;

  if (programInclude.name && nameMatch) {
    includeMatch = true;
  }

  if (programInclude.description && descriptionMatch) {
    includeMatch = true;
  }

  if (programInclude.tags && tagMatch) {
    includeMatch = true;
  }

  if (programInclude.category && categoryMatch) {
    includeMatch = true;
  }

  return includeMatch;
};
