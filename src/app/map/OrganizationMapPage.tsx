"use client";
import React from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import type { LocationData } from "./page";
import Link from "next/link";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import "leaflet-defaulticon-compatibility";
import { FavoriteOrgButton } from "../_components/DisplayCard/client";
import { BusRoute } from "../api/bus-routes/route";
import { OrganizationMap } from "./OrganizationMap";
import { ProgramModal } from "../_components/DisplayCard/server";

export function PaginatedList({
  allLocations,
  className,
  search,
  ...props
}: {
  allLocations: LocationData;
  className?: string;
  props?: React.ComponentProps<"div">;
  search: string;
}) {
  const resultsPerPage = 5;
  const [page, setPage] = React.useState(1);
  const maxPage = Math.ceil(allLocations.length / resultsPerPage);

  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;

  const [locationList, setLocationList] = React.useState(
    allLocations.slice(start, end)
  );

  React.useEffect(() => {
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;
    setLocationList(allLocations.slice(start, end));
  }, [page, allLocations]);

  React.useEffect(() => {
    setPage(1);
  }, [allLocations]);

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
            <div className="flex">
              <FavoriteOrgButton orgId={org.id} />
              <Link href={`/org/${org.id}`}>
                <h2 className="text-lg font-semibold hover:text-rose-600">
                  {org.name}
                </h2>
              </Link>
            </div>
            <div className="flex gap-2 flex-wrap"> 
            {org.programs.length > 0 && ( 
              org.programs.map((program) => (
                <ProgramModal program={program} key={program.id} search={search} />
              ))

      )}
              </div>
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

function MapSearchBar({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) {
  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.type);
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex items-center pb-2">
      <label className="mr-2 text-lg font-light">Search:</label>
      <input
        className="w-full rounded-md border border-gray-300 p-2"
        type="text"
        value={search}
        placeholder="Enter a keyword like 'food' or 'shelter'"
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={onEnter}
      />
    </div>
  );
}

export default function OrganizationMapSection({
  locations,
  busRoutes,
}: {
  locations: LocationData;
  busRoutes: BusRoute[];
}) {
  const [search, setSearch] = React.useState("");

  return (
    <div>
      <MapSearchBar search={search} setSearch={setSearch} />
      <OrganizationMap
        locations={locations}
        search={search}
        busRoutes={busRoutes}
      />
    </div>
  );
}
