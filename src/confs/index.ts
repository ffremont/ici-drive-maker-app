
import { Configuration } from "./configuration";


const DEV_API_BASEURL = 'http://localhost:5001/ici-drive/us-central1/api/api';
const other: Configuration = {
    cgu: 'https://docs.google.com/document/d/e/2PACX-1vRxz61BpPZL-YJXX2E6tvdYsI0PG1vxv1eGjxQ7TMfqififiO-Snb5pZU21bkjZgTHyENu3I5nFzxRZ/pub',
    cgr: 'https://docs.google.com/document/d/e/2PACX-1vTQkz2Kno4710sHi1MDtQwbIRU3tkddacvc5mlkHKfcJtOpcGLdKxxWDbPyxm4-mnLdeSyRVL4tjJKB/pub',
    acceptableUsePolicy:'https://docs.google.com/document/d/e/2PACX-1vTDZdAk4Eg5oBqaT6IMNagPLsX3---VBud8Qm2WjJCzhMWTeC-j3xlsyqNJfgd61RJIADouTWUDXzwj/pub',
    privacy_policy:'https://docs.google.com/document/d/e/2PACX-1vQp5YBhJywagTbos-519cIP2hwKv4GyxE3C0FGPIrZOsYa-2FA1WZwSbfoWudsGYt9508AUwdoYWqrN/pub',
    mentions:'https://docs.google.com/document/d/e/2PACX-1vR68Ij4_PaCqHJrq7Fv-ytuTgkfdC1SIJcMXeiGM0xqK06TsSLPKxwY3pb6dWA3IWPpM2GiGjj9g3Xc/pub',
    support: 'https://forms.gle/q4KYieunhwWVn1BR6',
    signin: 'https://forms.gle/fZrFyvJShxZLRQjt8',
    demoAdminIciDriveFr: 'https://www.loom.com/share/076161f8abe045218bfd249153e83851',
    demoAppIciDriveFr: 'https://www.loom.com/share/f84e9d674b9f4299aeb9744fd4303d44',
    defaultStartDriveAfterDays:5,
    baseURL: 'https://app.ici-drive.fr',
    fcmPublicVapidKey: 'BO7yESbBXsx7ddVzYqvkNpWf-3S6sjqQxEoolQQ1OG02D0-nmrpowEsYRHuoGEzT4w5Np6Gdwto5FiLsS--sONw',
    API: {
        /*self: () => `${DEV_API_BASEURL}/makers/self.json`,
        products: (ref?:string) => `${DEV_API_BASEURL}/makers/self.json?ref=${ref}`,
        //orders: (ref?:string) => `${DEV_API_BASEURL}/my-orders.json?ref=${ref}`,
        orders: (ref?:string) => `${DEV_API_BASEURL}/empty.json`,*/
        self: () => `${DEV_API_BASEURL}/admin/makers/self`,
        products: (ref?:string) => `${DEV_API_BASEURL}/admin/makers/self/products/${ref||''}`,
        orders: (ref?:string) => `${DEV_API_BASEURL}/admin/my-orders/${ref || ''}`,
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
    cgr: 'https://docs.google.com/document/d/e/2PACX-1vTQkz2Kno4710sHi1MDtQwbIRU3tkddacvc5mlkHKfcJtOpcGLdKxxWDbPyxm4-mnLdeSyRVL4tjJKB/pub',
    acceptableUsePolicy:'https://docs.google.com/document/d/e/2PACX-1vTDZdAk4Eg5oBqaT6IMNagPLsX3---VBud8Qm2WjJCzhMWTeC-j3xlsyqNJfgd61RJIADouTWUDXzwj/pub',
    privacy_policy:'https://docs.google.com/document/d/e/2PACX-1vQp5YBhJywagTbos-519cIP2hwKv4GyxE3C0FGPIrZOsYa-2FA1WZwSbfoWudsGYt9508AUwdoYWqrN/pub',
    mentions:'https://docs.google.com/document/d/e/2PACX-1vR68Ij4_PaCqHJrq7Fv-ytuTgkfdC1SIJcMXeiGM0xqK06TsSLPKxwY3pb6dWA3IWPpM2GiGjj9g3Xc/pub',
    
    demoAdminIciDriveFr: 'https://www.loom.com/share/076161f8abe045218bfd249153e83851',
    demoAppIciDriveFr: 'https://www.loom.com/share/f84e9d674b9f4299aeb9744fd4303d44',

    defaultStartDriveAfterDays:5,

    signin: 'https://forms.gle/fZrFyvJShxZLRQjt8',
    support: 'https://forms.gle/q4KYieunhwWVn1BR6',
    baseURL: 'https://app.ici-drive.fr',
    fcmPublicVapidKey: 'BO7yESbBXsx7ddVzYqvkNpWf-3S6sjqQxEoolQQ1OG02D0-nmrpowEsYRHuoGEzT4w5Np6Gdwto5FiLsS--sONw',
    API: {
        self: () => `${API_BASEURL}/admin/makers/self`,
        products: (ref?:string) => `${API_BASEURL}/admin/makers/self/products/${ref||''}`,
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