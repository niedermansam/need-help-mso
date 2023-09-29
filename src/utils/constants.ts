//import { env } from "@/env.mjs";

export const SITE_URL = "https://www.needhelpmissoula.org";
// export const SITE_URL = "https://www.needhelpmissoula.org";

export const SITE_NAME = "Need Help Missoula";

export const SITE_DESCRIPTION = "A directory of resources for Missoula, Montana.";

const ROUTE_1_COLOR = "#F44336";
const ROUTE_2_COLOR = "#FF9800";
const ROUTE_3_COLOR = "#FFEB3B";
const ROUTE_4_COLOR = "#4CAF50";
const ROUTE_5_COLOR = "#2196F3";
const ROUTE_6_COLOR = "#9C27B0";
const ROUTE_7_COLOR = "#607D8B";
const ROUTE_8_COLOR = "#795548";
const ROUTE_9_COLOR = "#FF5722";
const ROUTE_10_COLOR = "#E91E63";
const ROUTE_11_COLOR = "#3F51B5";
const ROUTE_12_COLOR = "#00BCD4";
const ROUTE_14_COLOR = "#FFC107";

 const BUS_ROUTE_COLORS_obj = {
    1: ROUTE_1_COLOR,
    2: ROUTE_2_COLOR,
    3: ROUTE_3_COLOR,
    4: ROUTE_4_COLOR,
    5: ROUTE_5_COLOR,
    6: ROUTE_6_COLOR,
    7: ROUTE_7_COLOR,
    8: ROUTE_8_COLOR,
    9: ROUTE_9_COLOR,
    10: ROUTE_10_COLOR,
    11: ROUTE_11_COLOR,
    12: ROUTE_12_COLOR,
    14: ROUTE_14_COLOR,
} as const;

export const BUS_ROUTE_COLOR_ACCENTS = 
{
    1: `accent-[${ROUTE_1_COLOR}]`,
    2: `accent-[${ROUTE_2_COLOR}]`,
    3: `accent-[${ROUTE_3_COLOR}]`,
    4: `accent-[${ROUTE_4_COLOR}]`,
    5: `accent-[${ROUTE_5_COLOR}]`,
    6: `accent-[${ROUTE_6_COLOR}]`,
    7: `accent-[${ROUTE_7_COLOR}]`,
    8: `accent-[${ROUTE_8_COLOR}]`,
    9: `accent-[${ROUTE_9_COLOR}]`,
    10: `accent-[${ROUTE_10_COLOR}]`,
    11: `accent-[${ROUTE_11_COLOR}]`,
    12: `accent-[${ROUTE_12_COLOR}]`,
    14: `accent-[${ROUTE_14_COLOR}]`,
    
} as const;



export const BUS_ROUTE_COLORS = BUS_ROUTE_COLORS_obj;
