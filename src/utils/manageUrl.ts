export const encodeTag = (category: string) =>
  encodeURI(category.replaceAll(" ", "-").toLowerCase());

export const decodeTag = (category: string) =>
  decodeURI(category).replaceAll("-", " ");


export const prettyWebsite = (website: string) => {
  const url = new URL(website);

  const urlString = url.hostname + url.pathname

  return urlString.replace(/^www\./, "").replace(/\/$/, "");
}
