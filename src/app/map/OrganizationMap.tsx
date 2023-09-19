"use client";
import React from "react";
import {
  TileLayer,
  Marker,
  MapContainer,
  useMapEvents,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LocationData } from "./page";
import Link from "next/link";

function jitter(num: number) {
  return num + Math.random() * 0.0001;
}

function isOrgInView({
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

function getDistanceFromCenter({
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

function sortLocationsByDistanceFromCenter({
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

function ZoomHandler({
  locations,
  setLocations,
  search,
}: {
  locations: LocationData;
  setLocations: (locations: LocationData) => void;
  search: string;
}) {
  const map = useMapEvents({
    zoomend: () => {
      const boundingBox = map.getBounds();

      const northEast = boundingBox.getNorthEast();
      const southWest = boundingBox.getSouthWest();

      const center = map.getCenter();

      const searchBox = {
        northEast,
        southWest,
      };

      const newLocations = locations.filter((location) => {
        const isFiltered = filterLocations(location, search);
        if (!isFiltered) return false;
        const { latitude, longitude } = location;
        if (!latitude || !longitude) return false;
        return isOrgInView({ latitude, longitude, boundingBox: searchBox });
      });

      setLocations(
        newLocations.sort((a, b) => {
          const { latitude, longitude } = a;
          if (!latitude || !longitude) return 1;

          const { latitude: bLatitude, longitude: bLongitude } = b;
          if (!bLatitude || !bLongitude) return -1;

          const aPoint = {
            latitude: latitude,
            longitude: longitude,
          };

          const bPoint = {
            latitude: bLatitude,
            longitude: bLongitude,
          };

          return sortLocationsByDistanceFromCenter({
            a: aPoint,
            b: bPoint,
            center,
          });
        })
      );
    },
    moveend: () => {
      const boundingBox = map.getBounds();

      const northEast = boundingBox.getNorthEast();
      const southWest = boundingBox.getSouthWest();

      const searchBox = {
        northEast,
        southWest,
      };

      const center = map.getCenter();

      const newLocations = locations.filter((location) => {
        const isFiltered = filterLocations(location, search);
        if (!isFiltered) return false;
        const { latitude, longitude } = location;
        if (!latitude || !longitude) return false;
        return isOrgInView({ latitude, longitude, boundingBox: searchBox });
      });

      setLocations(
        newLocations.sort((a, b) => {
          const { latitude, longitude } = a;
          if (!latitude || !longitude) return 1;

          const { latitude: bLatitude, longitude: bLongitude } = b;
          if (!bLatitude || !bLongitude) return -1;

          const aPoint = {
            latitude: latitude,
            longitude: longitude,
          };

          const bPoint = {
            latitude: bLatitude,
            longitude: bLongitude,
          };

          return sortLocationsByDistanceFromCenter({
            a: aPoint,
            b: bPoint,
            center,
          });
        })
      );
    },
  });

  return null;
}

function PaginatedList({ locations, className, ...props }: { locations: LocationData, className?:string; props?: React.ComponentProps<"div"> }) {
  const resultsPerPage = 5;
  const [page, setPage] = React.useState(1);
  const maxPage = Math.ceil(locations.length / resultsPerPage);

  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;

  const [locationList, setLocationList] = React.useState(
    locations.slice(start, end)
  );

  React.useEffect(() => {
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;
    setLocationList(locations.slice(start, end));
  }, [page, locations]);

  React.useEffect(() => {
    setPage(1);
  }, [locations]);

  return (
    <div {...props} className={className}>
      {locationList.map((location) => {
        const { org } = location;
        if (!org) return null;
        return (
          <div
            key={org.id}
            className="mb-2 rounded-md border border-gray-300 bg-white p-2"
          >
            <Link href={`/org/${org.id}`}>
            <h2 className="text-lg font-semibold hover:text-rose-600">{org.name}</h2>
            </Link>
            <p>{org.description}</p>
          </div>
        );
      })}
      <div className="flex justify-center">
        <button
          className="m-2 rounded-md bg-gray-200 p-2"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="m-2 p-2">
          Page {page} of {maxPage}
        </span>
        <button
          className="m-2 rounded-md bg-gray-200 p-2"
          onClick={() => setPage(page + 1)}
          disabled={page === maxPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const filterLocations = (location: LocationData[number], search: string) => {
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

function OrganizationMap({
  locations,
  search,
}: {
  locations: LocationData;
  search: string;
}) {
  const [displayedMapLocations, setDisplayedMapLocations] =
    React.useState(locations);

  React.useEffect(() => {
    if (!search) {
      setDisplayedMapLocations(locations);
      return;
    }
    const filteredLocations = locations.filter((location) =>
      filterLocations(location, search)
    );

    setDisplayedMapLocations(filteredLocations);
  }, [search, locations]);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3">
      <PaginatedList
        className="order-last col-span-2 py-4 xl:order-first xl:col-span-1 xl:px-4"
        locations={displayedMapLocations}
      />
      <div          className="col-span-2 "
>
        <MapContainer
          center={[46.873, -114]}
          zoom={13}
          style={{
            height: 500,
            width: "100%",
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {displayedMapLocations.map((location) => {
            const { latitude, longitude, org } = location;
            if (!latitude || !longitude) return null;
            if (!org) return null;
            if (!org.name) return null;
            return (
              <Marker
                key={`${latitude}, ${longitude}, ${org.name} ${Math.random()}`}
                position={[jitter(latitude), jitter(longitude)]}
              >
                <Tooltip className="block max-w-sm">
                  <div className="flex max-w-xs flex-wrap ">
                    <h2>{org.name}</h2>
                    {location.address &&
                      location.city &&
                      location.state &&
                      location.zip && (
                        <p>
                          {location.address}, {location.city}, {location.state}{" "}
                          {location.zip}
                        </p>
                      )}
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
          <ZoomHandler
            locations={locations}
            setLocations={setDisplayedMapLocations}
            search={search}
          />
        </MapContainer>
        <p className="text-xs md:text-sm xl:text-base font-light text-center">Enter a search phrase above, or zoom/scroll the map to filter organizations in the list <span className="xl:hidden">below.</span><span className="hidden  xl:inline">to the left.</span> Locations closer to the center of the map will appear in the list first.</p>
      </div>
    </div>
  );
}

function MapSearchBar({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) {
  return (
    <div className="flex items-center pb-2">
      <label className="mr-2 text-lg font-light">Search:</label>
      <input
        className="w-full rounded-md border border-gray-300 p-2"
        type="text"
        value={search}
        placeholder="Enter a keyword like 'food' or 'shelter'"
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default function OrganizationMapSection({
  locations,
}: {
  locations: LocationData;
}) {
  const [search, setSearch] = React.useState("");
  return (
    <div>
      <MapSearchBar search={search} setSearch={setSearch} />
      <OrganizationMap locations={locations} search={search} />
    </div>
  );
}
