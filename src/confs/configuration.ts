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

    demoAppIciDriveFr:string;
    demoAdminIciDriveFr:string;

    mentions:string;
    privacy_policy:string;
    acceptableUsePolicy:string;
    cgu:string;
    cgr:string;
    support:string;
}