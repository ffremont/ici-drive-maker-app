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

    static async updateProduct(p:Product, file:Blob|null = null){
        const myform = new FormData();
        myform.append('data', JSON.stringify(p));
        if(file)
            myform.append('file',file);

        await httpClientService.axios.put(conf.API.products(p.ref), myform);
    }

    static async deleteProduct(ref:string){
        await httpClientService.axios.delete(conf.API.products(ref));
    }



    /**
     * @param product 
     */
    static async addProduct(p:Product, file:Blob|null = null){
        const myform = new FormData();
        myform.append('data', JSON.stringify(p));
        if(file)
            myform.append('file',file);
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