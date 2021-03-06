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

    youtubeTuto: string;
    youtubeStepActivity:string;
    youtubeStepDrive:string;
    youtubeStepDelivery: string;

    defaultStartDriveAfterDays:number;

    demoAppIciDriveFr:string;
    demoAdminIciDriveFr:string;

    publicHolidays:{date:string, public_holiday:boolean, label:string}[],

    mentions:string;
    privacy_policy:string;
    acceptableUsePolicy:string;
    cgu:string;
    cgr:string;
    support:string;

    defaultPlaceholderOrderComment:string;
}