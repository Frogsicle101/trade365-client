import axios from "axios";
import {rootUrl} from "./root";

const instance = axios.create({
    baseURL: rootUrl,
    timeout: 1000,
});


export default instance;