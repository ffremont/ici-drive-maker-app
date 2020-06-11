import {BehaviorSubject, Subscription} from 'rxjs';
import { Maker } from '../models/maker';
import { Store } from './store';
import httpClientService from '../services/http-client.service';
import conf from '../confs';
import {AxiosResponse} from 'axios';
import { Product } from '../models/product';

export class MakerStore implements Store<Maker|null>{
    private sub = new BehaviorSubject<Maker|null>(null);

    public set(maker: Maker|null): void{
        this.sub.next(maker);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }

    static async updateSelf(maker:Maker){
        const myform = new FormData();
        myform.append('data', JSON.stringify(maker));

        if(maker.image.startsWith('blob:')){
            let blobImage = await fetch(maker.image).then(r => r.blob());
            myform.append('fileImage',blobImage, `${Math.random().toString(36).substring(2)}.jpg`);
        }
        const placeImage = maker?.place.image || '';
        if(placeImage.startsWith('blob:')){
            let blobPlaceImage = await fetch(maker?.place.image || '').then(r => r.blob());
            myform.append('filePlaceImage',blobPlaceImage, `${Math.random().toString(36).substring(2)}.jpg`);
        }

        await httpClientService.axios.put(`${conf.API.self()}`, myform);
    }

    static async register(maker:Maker, recaptcha:any){
        const myform = new FormData();
        myform.append('data', JSON.stringify(maker));

        let blobImage = await fetch(maker.image).then(r => r.blob());
        myform.append('fileImage',blobImage, `${Math.random().toString(36).substring(2)}.jpg`);

        let blobPlaceImage = await fetch(maker?.place.image || '').then(r => r.blob());
        myform.append('filePlaceImage',blobPlaceImage, `${Math.random().toString(36).substring(2)}.jpg`);

        await httpClientService.axios.post(`${conf.API.self()}?recaptcha=${encodeURIComponent(recaptcha)}`, myform);
    }

    static async updateProduct(p:Product, file:Blob|null = null, fileName:string = ''){
        const myform = new FormData();
        myform.append('data', JSON.stringify(p));
        if(file)
            myform.append('file',file, fileName.trim().endsWith('blob') ? fileName.replace('.blob','.jpg'):fileName);

        await httpClientService.axios.put(conf.API.products(p.ref), myform);
    }

    static async deleteProduct(ref:string){
        await httpClientService.axios.delete(conf.API.products(ref));
    }

    /**
     * @param product 
     */
    static async addProduct(p:Product, file:Blob|null = null, fileName:string = ''){
        const myform = new FormData();
        myform.append('data', JSON.stringify(p));
        if(file)
            myform.append('file',file, fileName.trim().endsWith('blob') ? fileName.replace('.blob','.jpg'):fileName);
        await httpClientService.axios.post(conf.API.products(), myform);
    }

    public load():void{
        return httpClientService.axios.get(conf.API.self())
        .then((response: AxiosResponse<any>) => {
            this.set(response.data);  
            return response;  
        }).catch((e:any) => {
            console.error(e);
            return Promise.reject(e);
        });
    }
}

export default new MakerStore() ;