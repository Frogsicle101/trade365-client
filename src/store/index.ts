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
export const useUserStore = useStore;