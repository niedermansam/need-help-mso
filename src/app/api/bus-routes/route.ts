import { MountainLineRoutes } from "@/data/MountainLineRoutes";
import { BUS_ROUTE_COLORS } from "@/utils/constants";

import { NextResponse } from "next/server";

type MountainLineRoute =  typeof MountainLineRoutes.features[number];
export type BusRouteNumber = MountainLineRoute["properties"]["ROUTE"];

// type RouteColor = typeof BUS_ROUTE_COLORS[BusRouteNumber];


export function createBusRoute(route: (typeof MountainLineRoutes.features)[number]) {
  // if (route.properties.DIR === "IB") return;
  const routeNumber = route.properties.ROUTE;
  if(routeNumber > 12 || routeNumber <0) return;

  const color = BUS_ROUTE_COLORS[routeNumber];
  return {
    name: route.properties.ROUTE_NAME,
    dir: route.properties.DIR,
    number: route.properties.ROUTE,
    color: color,
    path: route.geometry.coordinates[0]?.map((coord) => {
      const [lng, lat] = coord;
      return [lat, lng];
    }) as [number, number][],
  };
}


export type BusRoute = ReturnType<typeof createBusRoute>;

const routes = MountainLineRoutes.features.map(createBusRoute);

export function GET() {
  return NextResponse.json(routes);
}
