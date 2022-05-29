import axios from "axios";
import {rootUrl} from "./root";
import {useUserStore} from "../store";

const instance = axios.create({
    baseURL: rootUrl,
    timeout: 1000,
});

instance.interceptors.request.use((config) => {
    const user = useUserStore.getState().user;

    if (user) {
        if (config.headers) {
            config.headers['X-Authorization'] = user.token;
        } else {
            config.headers = {'X-Authorization': user.token}
        }

    }
    return config;
})


export default instance;