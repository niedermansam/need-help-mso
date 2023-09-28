import { MountainLineRoutes } from "@/data/MountainLineRoutes";
import { BUS_ROUTE_COLORS } from "@/utils/constants";

import { NextResponse } from "next/server";

export function createBusRoute(route: (typeof MountainLineRoutes.features)[0]) {
  // if (route.properties.DIR === "IB") return;
  const routeNumber = route.properties.ROUTE;

  const color = BUS_ROUTE_COLORS[routeNumber];
  return {
    name: route.properties.ROUTE_NAME,
    dir: route.properties.DIR,
    number: route.properties.ROUTE,
    color: color,
    path: route.geometry.coordinates[0]?.map((coord) => {
      const [lng, lat] = coord;
      return [lat, lng];
    }),
  };
}

export type BusRoute = ReturnType<typeof createBusRoute>;

const routes = MountainLineRoutes.features.map(createBusRoute);

export function GET() {
  return NextResponse.json(routes);
}
