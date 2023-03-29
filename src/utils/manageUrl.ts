export const encodeTag = (category: string) =>
  encodeURI(category.replaceAll(" ", "-").toLowerCase());

export const decodeTag = (category: string) =>
  decodeURI(category).replaceAll("-", " ");


