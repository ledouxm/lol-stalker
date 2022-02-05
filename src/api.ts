import axios from "axios";
import electronIsDev from "electron-is-dev";
const baseURL = electronIsDev ? "http://localhost:8080/" : "https://back.chainbreak.dev/";
export const api = axios.create({ baseURL });
