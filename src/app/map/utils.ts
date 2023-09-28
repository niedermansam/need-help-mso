import type { LocationData } from "./page";

export function isOrgInView({
  latitude,
  longitude,
  boundingBox,
}: {
  latitude: number;
  longitude: number;
  boundingBox: {
    northEast: {
      lat: number;
      lng: number;
    };
    southWest: {
      lat: number;
      lng: number;
    };
  };
}) {
  const { northEast, southWest } = boundingBox;
  const { lat: north, lng: east } = northEast;
  const { lat: south, lng: west } = southWest;
  if (latitude > north || latitude < south) return false;
  if (longitude > east || longitude < west) return false;
  return true;
}


export function jitter(num: number) {
  return num + Math.random() * 0.0001;
}

export function getDistanceFromCenter({
  point,
  center,
}: {
  point: {
    lat: number;
    lng: number;
  };
  center: {
    lat: number;
    lng: number;
  };
}) {
  const { lat: pointLat, lng: pointLng } = point;
  const { lat: centerLat, lng: centerLng } = center;

  const latDiff = Math.abs(pointLat - centerLat);

  const lngDiff = Math.abs(pointLng - centerLng);

  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
}

export function sortLocationsByDistanceFromCenter({
  a,
  b,
  center,
}: {
  a: {
    latitude: number;
    longitude: number;
  };
  b: {
    latitude: number;
    longitude: number;
  };
  center: {
    lat: number;
    lng: number;
  };
}) {
  const aDistance = getDistanceFromCenter({
    point: {
      lat: a.latitude,
      lng: a.longitude,
    },
    center,
  });

  const bDistance = getDistanceFromCenter({
    point: {
      lat: b.latitude,
      lng: b.longitude,
    },
    center,
  });

  return aDistance - bDistance;
}


export const filterLocationsByString = (
  location: LocationData[number],
  search: string
) => {
  const { org } = location;
  if (!org) return false;
  const { name, description, category, categories, tags, programs } = org;
  if (!name || !description) return false;
  const searchTerms = search.split(" ");

  const categoriesString = categories
    .map((category) => category.category)
    .join(" ");
  const tagsString = tags.map((tag) => tag.tag).join(" ");

  for (const term of searchTerms) {
    if (name.toLowerCase().includes(term.toLowerCase())) return true;
    if (description.toLowerCase().includes(term.toLowerCase())) return true;
    if (category?.toLowerCase().includes(term.toLowerCase())) return true;
    if (categoriesString?.toLowerCase().includes(term.toLowerCase()))
      return true;
    if (tagsString?.toLowerCase().includes(term.toLowerCase())) return true;

    for (const program of programs) {
      const tagsString = program.tags.map((tag) => tag.tag).join(" ");

      const { name, description, category } = program;
      if (!name || !description) return false;
      if (name.toLowerCase().includes(term.toLowerCase())) return true;
      if (description.toLowerCase().includes(term.toLowerCase())) return true;
      if (category?.toLowerCase().includes(term.toLowerCase())) return true;
      if (tagsString?.toLowerCase().includes(term.toLowerCase())) return true;
    }
  }
  return false;
};

export function createGoogleMapsLink({
  from,
  to
}: {
  from: {
    latitude: number;
    longitude: number;
  };
  to: {
    latitude: number;
    longitude: number;
  };
}) {
  return `https://www.google.com/maps/dir/${from.latitude},${from.longitude}/@${to.latitude},${to.longitude}`;
}