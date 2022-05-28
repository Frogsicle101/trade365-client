import create from 'zustand';
import {persist} from "zustand/middleware";


interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
}

const useUserStore = create(persist<UserState>((set) => ({
    user: null,
    setUser: (user: User | null) => set(() => {
        return {user: user}
    }),
})));

interface SearchState {
    searchText: string | null;
    setSearchText: (text: string) => void;
}

const useSearchStore = create<SearchState>((set) => ({
    searchText: "",
    setSearchText: (text: string) => set(() => {
        return {searchText: text}
    }),
}))

export {useUserStore, useSearchStore};