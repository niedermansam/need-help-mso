import type { User } from "@prisma/client";
import { create } from "zustand";

export const AdminRoles:Record<User['role'], number> = {
  USER: 0,
  VOLUNTEER: 1,
  ADMIN: 2,
  SUPERADMIN: 3,
}

export const userHasPermission = (userRole: User['role'] | undefined | null, requiredRole: User['role']) => {
  if(!userRole) return false
  return AdminRoles[userRole] >= AdminRoles[requiredRole]
}

type UserRole = User['role']

type UserStore = {
  userId: string | null;
  loggedIn: boolean;
  admin: boolean | null; 
  role: UserRole | null;
  loading: boolean;
  setUser: (userId: string | null, loggedIn: boolean, admin: boolean, role: UserRole ) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  userId: null,
  loggedIn: false,
  admin: null,
  role: null,
  loading: true,
  setUser: (userId: string | null, loggedIn: boolean, admin: boolean, role: 
    UserRole) =>
    set({ userId, loggedIn, admin, role, loading: false }),
}));

type FavoriteOrgsStore = {
  favoriteOrgs: string[];
  favoriteListId: number | undefined;
  setFavoriteOrgs: (orgs: string[]) => void;
  addFavoriteOrg: (orgId: string) => void;
  removeFavoriteOrg: (orgId: string) => void;
  toggleFavoriteOrg: (orgId: string) => void;

  setFavoriteListId: (listId: number | undefined) => void;
};

export const useFavoriteOrgStore = create<FavoriteOrgsStore>((set) => ({
  favoriteOrgs: [],
  favoriteListId: undefined,
  setFavoriteOrgs: (favoriteOrgs: string[]) => set({ favoriteOrgs }),
  addFavoriteOrg: (orgId: string) =>
    set((state) => ({ favoriteOrgs: [...state.favoriteOrgs, orgId] })),
  removeFavoriteOrg: (orgId: string) =>
    set((state) => ({
      favoriteOrgs: state.favoriteOrgs.filter((org) => org !== orgId),
    })),
  toggleFavoriteOrg: (orgId: string) =>
    set((state) => ({
      favoriteOrgs: state.favoriteOrgs.includes(orgId)
        ? state.favoriteOrgs.filter((org) => org !== orgId)
        : [...state.favoriteOrgs, orgId],
    })),
  setFavoriteListId: (favoriteListId: number | undefined) =>
    set({ favoriteListId }),
}));


type FavoriteProgramStore = {
  favoritePrograms: string[];
  setFavoritePrograms: (favoritePrograms: string[]) => void;
  addFavoriteProgram: (programId: string) => void;
  removeFavoriteProgram: (programId: string) => void;
  toggleFavoriteProgram: (programId: string, programName: string) => void;
};

export const useFavoriteProgramStore = create<FavoriteProgramStore>((set) => ({
  favoritePrograms: [],
  setFavoritePrograms: (favoritePrograms: string[]) =>
    set({ favoritePrograms }),
  addFavoriteProgram: (programId: string) =>
    set((state) => ({
      favoritePrograms: [...state.favoritePrograms, programId],
    })),
  removeFavoriteProgram: (programId: string) =>
    set((state) => ({
      favoritePrograms: state.favoritePrograms.filter(
        (program) => program !== programId
      ),
    })),
  toggleFavoriteProgram: (programId: string) =>
    set((state) => ({
      favoritePrograms: state.favoritePrograms.includes(programId)
        ? state.favoritePrograms.filter((program) => program !== programId)
        : [...state.favoritePrograms, programId],
    })),
}));
