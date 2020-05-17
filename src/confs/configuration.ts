import { Item } from "../models/item";

interface APIS{
    orders:any;
    self:any;
    products:any;
}

export interface Configuration{
    API: APIS,
    categories: Item[],
    baseURL: string,
    fcmPublicVapidKey:string,
    slotQuantity: number;
    signin:string;

    cgu:string;
    cgr:string;
    support:string;
}