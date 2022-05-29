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

interface HeaderState {
    searchText: string | null;
    setSearchText: (text: string) => void;
    loginOpen: boolean;
    setLoginOpen: (bool: boolean) => void;
}

const useHeaderStore = create<HeaderState>((set) => ({
    searchText: "",
    setSearchText: (text: string) => set(() => {
        return {searchText: text}
    }),
    loginOpen: false,
    setLoginOpen: (bool: boolean) => set(() => {
        return {loginOpen: bool}
    }),

}))

export {useUserStore, useHeaderStore};