"use client";
import React from "react";
import {
  TileLayer,
  Marker,
  MapContainer,
  Tooltip,
  Polyline,
  Popup,
  useMapEvents,
} from "react-leaflet";
import type { LocationData } from "./page";
import type * as _L from "leaflet";
import { orgIsFilteredByString } from "../search/utils";
import type { BusRoute } from "../api/bus-routes/route";
import { PaginatedList } from "./OrganizationMapPage";
import { isOrgInView, sortLocationsByDistanceFromCenter } from "./utils";
import { twJoin, twMerge } from "tailwind-merge";
import { BUS_ROUTE_COLOR_ACCENTS } from "@/utils/constants";

const ACCENT_COLORS = {
  1: "accent-rose-500",
  2: "accent-rose-400",
  3: "accent-rose-300",
}

export function OrganizationMap({
  locations,
  search,
  busRoutes,
}: {
  locations: LocationData;
  search: string;
  busRoutes: BusRoute[];
}) {
  const [displayedMapLocations, setDisplayedMapLocations] =
    React.useState(locations);


  React.useEffect(() => {
    if (!search) {
      setDisplayedMapLocations(locations);
      return;
    }
    const filteredLocations = locations.filter((location) => {
      if (!location.org) return false;
      return orgIsFilteredByString(location.org, search);
    });

    setDisplayedMapLocations(filteredLocations);
  }, [search, locations]);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3">
      <PaginatedList
        className="order-last col-span-2 py-4 xl:order-first xl:col-span-1 xl:px-4"
        allLocations={displayedMapLocations}
        search={search}
      />
      <div className="col-span-2 ">
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
          <OrganizationMarkers locations={displayedMapLocations} />

          <BusRoutes busRoutes={busRoutes} />

          <ZoomHandler
            locations={locations}
            setLocations={setDisplayedMapLocations}
            search={search}
          />
        </MapContainer>
        <p className="text-center text-xs font-light md:text-sm xl:text-base">
          Enter a search phrase above, or zoom/scroll the map to filter
          organizations in the list <span className="xl:hidden">below.</span>
          <span className="hidden  xl:inline">to the left.</span> Locations
          closer to the center of the map will appear in the list first.
        </p>
      </div>
    </div>
  );
}
export function ZoomHandler({
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
        if (!location.org) return false;
        const isFiltered = orgIsFilteredByString(location.org, search);
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
        if (!location.org) return false;
        const isFiltered = orgIsFilteredByString(location.org, search);
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

function OrganizationMarker({ location }: { location: LocationData[0] }) {
  const { latitude, longitude, org } = location;
  if (!latitude || !longitude) return null;
  if (!org) return null;
  if (!org.name) return null;
  return (
    <>
      <Marker position={[latitude, longitude]}>
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
    </>
  );
}

function OrganizationMarkers({ locations }: { locations: LocationData }) {
  return (
    <>
      {locations.map((location) => {
        return (
          <OrganizationMarker
            location={location}
            key={`${location.latitude || ""}, ${
              location.longitude || ""
            } , ${Math.random()}`}
          />
        );
      })}
    </>
  );
}

function BusRoutes({ busRoutes }: { busRoutes: BusRoute[] }) {

  const filteredBusRoutes = busRoutes.filter(route => route && route.number)

  const routeNames =[...new Set( busRoutes.filter(route => 
    {
      if(!route) return false
      return route?.name !== undefined
      
    }).map((route) => {
    return route.number
  }))].sort(
    (a,b) => {
      

      //otherwise sort by the number  
      return a - b

    }
  )

  const [visibleRoutes, setVisibleRoutes] = React.useState<BusRoute['number'][]>(routeNames)

  const [isMinimized, setIsMinimized] = React.useState(false)

  function addVisibleRoute(routeId: BusRoute["number"]) {
    setVisibleRoutes([...visibleRoutes, routeId]);
  }

  function removeVisibleRoute(routeId: BusRoute["number"]) {
    setVisibleRoutes(visibleRoutes.filter((id) => id !== routeId));
  }

  function toggleVisibleRoute(routeId: BusRoute["number"]) {
    if (visibleRoutes.includes(routeId)) {
      removeVisibleRoute(routeId);
    } else {
      addVisibleRoute(routeId);
    }
  }

  return (
    <>
      {visibleRoutes.map((name) => {
        const route = busRoutes.find((route) => route?.number === name);
        if (!route) return null;
        return (
          <Polyline
            key={route.name + Math.random().toString()}
            positions={route.path as _L.LatLngExpression[]}
            pathOptions={{ color: route.color }}
          >
            <Popup className="block max-w-sm">
              <div className="flex max-w-xs flex-wrap ">
                <h2>{route.name}</h2>
              </div>
            </Popup>
          </Polyline>
        );
      })}
      <div
        className={
          "absolute  bottom-[17px] right-0 z-[10000] w-fit rounded-tl border border-stone-200 bg-white p-1"
        }
      >
        <div className="flex items-center">
          <label className="mb-1 font-bold">Bus Routes</label>{" "}
          <button
            className="rounded-full w-4 h-4 border border-stone-200 bg-stone-100 flex items-center justify-center align-top pb-0.5"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? "+" : "-"}
          </button>
        </div>
        <form
          className={"flex flex-col"}
        >
          <button
            className="rounded border border-stone-200 bg-stone-100 "
            onClick={(e) => {
              e.preventDefault();
              setVisibleRoutes([])}}
          >
            Hide All
          </button>
          <button
            className="my-1 rounded border border-stone-200 bg-stone-100"
            onClick={(e) => {
              e.preventDefault();
              setVisibleRoutes(routeNames)}}
          >
            Show All
          </button>

          <div className={twMerge(' animate-height', isMinimized ? "h-0 overflow-hidden" : "h-fit", )}>
            {routeNames.map((route) => {
              const color = busRoutes.find(
                (busRoute) => busRoute?.number === route
              )?.color;

              const accentColor = busRoutes.find(
                (busRoute) => busRoute?.number === route
              )?.accentColor;
              return (
                <div className="flex w-full items-center justify-between gap-1" key={`${route}`}>
                  <input
                    type="checkbox"
                    className={ BUS_ROUTE_COLOR_ACCENTS[route]}
                    key={route}
                    id={route.toString()}
                    name={route.toString()}
                    onChange={() => toggleVisibleRoute(route)}
                    checked={visibleRoutes.includes(route)}
                  />
                  <label htmlFor={route.toString()}>Route {route} </label>
                  <span
                    style={{
                      color: color,
                    }}
                    className="text-lg"
                  >
                    &#9679;
                  </span>
                </div>
              );
            })}
          </div>
        </form>
      </div>
    </>
  );
}
