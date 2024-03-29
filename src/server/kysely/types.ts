import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { Role, BarriersToEntry, SpeedOfAid } from "./enums";

export type Account = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
};
export type AffiliatedOrgs = {
  A: string;
  B: string;
};
export type AuthorizedUsers = {
  A: string;
  B: number;
};
export type Category = {
  category: string;
  slug: string;
  description: string | null;
};
export type CategoryToTag = {
  A: string;
  B: string;
};
export type Community = {
  name: string;
  id: string;
  slug: string;
  description: string | null;
};
export type ExclusiveOrg = {
  A: string;
  B: string;
};
export type ExclusiveProgram = {
  A: string;
  B: string;
};
export type FavoritesList = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  adminId: string;
  name: Generated<string>;
  notes: string | null;
  public: Generated<number>;
};
export type FavoritesListToOrganization = {
  A: number;
  B: string;
};
export type FavoritesListToProgram = {
  A: number;
  B: string;
};
export type HelpfulOrg = {
  A: string;
  B: string;
};
export type HelpfulProgram = {
  A: string;
  B: string;
};
export type HelpingOrgs = {
  A: string;
  B: string;
};
export type Location = {
  id: string;
  name: string | null;
  description: string | null;
  hours: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  apt: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  orgId: string | null;
};
export type LocationToProgram = {
  A: string;
  B: string;
};
export type Organization = {
  id: string;
  name: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  description: string;
  category: string;
  website: string | null;
  logo: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  adminVerified: Generated<number>;
};
export type OrganizationCategory = {
  A: string;
  B: string;
};
export type OrganizationContact = {
  userId: string;
  orgId: string;
  phone: string | null;
  email: string | null;
};
export type OrganizationRole = {
  userId: string;
  orgId: string;
};
export type OrganizationToTag = {
  A: string;
  B: string;
};
export type OrganizationToUser = {
  A: string;
  B: string;
};
export type Program = {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  phone: string | null;
  organizationId: string;
  category: string;
  barriersToEntry: BarriersToEntry | null;
  barriersToEntryDetails: string | null;
  speedOfAidDetails: string | null;
  free: Generated<number>;
};
export type ProgramContact = {
  userId: string;
  programId: string;
  phone: string | null;
  email: string | null;
};
export type ProgramToTag = {
  A: string;
  B: string;
};
export type Session = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Timestamp;
};
export type SubCommunity = {
  A: string;
  B: string;
};
export type Tag = {
  tag: string;
  name: string;
  description: string | null;
};
export type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Timestamp | null;
  image: string | null;
  admin: Generated<number>;
  role: Generated<Role>;
  currentListId: number | null;
};
export type VerificationToken = {
  identifier: string;
  token: string;
  expires: Timestamp;
};
export type DB = {
  _AffiliatedOrgs: AffiliatedOrgs;
  _AuthorizedUsers: AuthorizedUsers;
  _CategoryToTag: CategoryToTag;
  _ExclusiveOrg: ExclusiveOrg;
  _ExclusiveProgram: ExclusiveProgram;
  _FavoritesListToOrganization: FavoritesListToOrganization;
  _FavoritesListToProgram: FavoritesListToProgram;
  _HelpfulOrg: HelpfulOrg;
  _HelpfulProgram: HelpfulProgram;
  _HelpingOrgs: HelpingOrgs;
  _LocationToProgram: LocationToProgram;
  _OrganizationCategory: OrganizationCategory;
  _OrganizationToTag: OrganizationToTag;
  _OrganizationToUser: OrganizationToUser;
  _ProgramToTag: ProgramToTag;
  _SubCommunity: SubCommunity;
  Account: Account;
  Category: Category;
  Community: Community;
  FavoritesList: FavoritesList;
  Location: Location;
  Organization: Organization;
  OrganizationContact: OrganizationContact;
  OrganizationRole: OrganizationRole;
  Program: Program;
  ProgramContact: ProgramContact;
  Session: Session;
  Tag: Tag;
  User: User;
  VerificationToken: VerificationToken;
};
