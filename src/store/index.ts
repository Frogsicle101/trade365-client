import create from 'zustand';


interface UserState {
    user: User | null;
    setUser: (user: User) => void;
}

const useStore = create<UserState>((set) => ({
    user: null,
    setUser: (user: User) => set(() => {
        return {user: user}
    }),
}))

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

export {useSearchStore};