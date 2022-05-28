import axios from "../config/axiosConfig";
import {useUserStore} from "../store";

const logout = () => {
    const setUser = useUserStore.getState().setUser;
    setUser(null);

    return new Promise((resolve => {
        axios.post("users/logout").then(resolve);
    }))

}

export {logout};