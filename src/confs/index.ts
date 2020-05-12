
import { Configuration } from "./configuration";


const DEV_API_BASEURL = '/api-mock';
const other: Configuration = {
    cgu: 'https://docs.google.com/document/d/e/2PACX-1vRxz61BpPZL-YJXX2E6tvdYsI0PG1vxv1eGjxQ7TMfqififiO-Snb5pZU21bkjZgTHyENu3I5nFzxRZ/pub',
    cgr: 'http://google.fr',
    support: 'https://forms.gle/q4KYieunhwWVn1BR6',
    baseURL: 'https://app.ici-drive.fr',
    fcmPublicVapidKey: 'BO7yESbBXsx7ddVzYqvkNpWf-3S6sjqQxEoolQQ1OG02D0-nmrpowEsYRHuoGEzT4w5Np6Gdwto5FiLsS--sONw',
    API: {
        self: () => `${DEV_API_BASEURL}/makers/self.json`,
        products: (ref?:string) => `${DEV_API_BASEURL}/makers/self.json?ref=${ref}`,
        orders: (ref?:string) => `${DEV_API_BASEURL}/my-orders.json?ref=${ref}`,
    },
    slotQuantity:900000, // 15 minutes par créneau
    categories:[
        { "label": "Viandes", "id": "viandes"},
        { "label": "Oeufs", "id": "oeufs"},
        { "label": "Laitiers", "id": "laitiers"},
        { "label": "Epiceries", "id": "epiceries"},
        { "label": "Fruits / Légumes", "id": "fruit-leg"},
        { "label": "Mer", "id": "mer"},
        { "label": "Glaces", "id": "glace"},
        { "label": "Boissons", "id": "boissons"},
    ]
} ;

const API_BASEURL = '/api';
const prod: Configuration = {
    cgu: 'https://docs.google.com/document/d/e/2PACX-1vRxz61BpPZL-YJXX2E6tvdYsI0PG1vxv1eGjxQ7TMfqififiO-Snb5pZU21bkjZgTHyENu3I5nFzxRZ/pub',
    cgr: '',
    support: 'https://forms.gle/q4KYieunhwWVn1BR6',
    baseURL: 'https://app.ici-drive.fr',
    fcmPublicVapidKey: 'BO7yESbBXsx7ddVzYqvkNpWf-3S6sjqQxEoolQQ1OG02D0-nmrpowEsYRHuoGEzT4w5Np6Gdwto5FiLsS--sONw',
    API: {
        self: () => `${API_BASEURL}/admin/makers/self`,
        products: (ref?:string) => `${API_BASEURL}/admin/makers/self/products/${ref}`,
        orders: (ref?:string) => `${API_BASEURL}/admin/my-orders/${ref || ''}`,
    },
    slotQuantity:900000, // 15 minutes par créneau
    categories:[
        { "label": "Viandes", "id": "viandes"},
        { "label": "Oeufs", "id": "oeufs"},
        { "label": "Laitiers", "id": "laitiers"},
        { "label": "Epiceries", "id": "epiceries"},
        { "label": "Fruits / Légumes", "id": "fruit-leg"},
        { "label": "Mer", "id": "mer"},
        { "label": "Glaces", "id": "glace"},
        { "label": "Boissons", "id": "boissons"},
    ]
} ;

const config = process.env.REACT_APP_STAGE === 'prod'  ? prod : other;

  export default { ...config};