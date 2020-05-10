import { Item } from "../models/item";

interface APIS{
    orders:any;
    self:any;
}

export interface Configuration{
    API: APIS,
    categories: Item[],
    baseURL: string,
    fcmPublicVapidKey:string,

    cgu:string;
    cgr:string;
    support:string;
}