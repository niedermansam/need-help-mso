import { create } from 'zustand';

type UserStore = {
    userId: string | null;
    loggedIn: boolean;  
    admin: boolean;
    setUser:(userId: string | null, loggedIn: boolean, admin: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => (
    
    {
    userId: null,
    loggedIn: false,
    admin: false,
    setUser: (userId: string | null, loggedIn: boolean, admin: boolean) => set({ userId, loggedIn, admin })
    }
));

type FavoriteArray = {
    orgId: string;
    orgName: string;
}[]

type FavoriteStore = {
    favoriteOrgs: string[];
    favoriteListId: number | undefined;
    setFavoriteOrgs: (orgs:string[]) => void;
    addFavoriteOrg: (orgId: string) => void;
    removeFavoriteOrg: (orgId: string) => void;
    toggleFavoriteOrg: (orgId: string) => void;

    setFavoriteListId: (listId: number | undefined) => void;
}

export const useFavoriteStore = create<FavoriteStore>((set) => ({
    favoriteOrgs: [],
    favoriteListId: undefined,
    setFavoriteOrgs: (favoriteOrgs: string[]) => set({ favoriteOrgs }),
    addFavoriteOrg: (orgId: string) => set((state) => ({ favoriteOrgs: [...state.favoriteOrgs, orgId] })),
    removeFavoriteOrg: (orgId: string) => set((state) => ({ favoriteOrgs: state.favoriteOrgs.filter((org) => org !== orgId) })),
    toggleFavoriteOrg: (orgId: string) => set((state) => ({ favoriteOrgs: state.favoriteOrgs.includes(orgId) ? state.favoriteOrgs.filter((org) => org !== orgId) : [...state.favoriteOrgs, orgId] })),
    setFavoriteListId: (favoriteListId: number | undefined) => set({ favoriteListId })
}));