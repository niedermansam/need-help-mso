export const Role = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  VOLUNTEER: "VOLUNTEER",
  USER: "USER",
} as const;
export type Role = (typeof Role)[keyof typeof Role];
export const BarriersToEntry = {
  MINIMAL: "MINIMAL",
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;
export type BarriersToEntry =
  (typeof BarriersToEntry)[keyof typeof BarriersToEntry];
