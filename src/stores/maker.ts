import {BehaviorSubject, Subscription} from 'rxjs';
import { Maker } from '../models/maker';
import { Store } from './store';
import httpClientService from '../services/http-client.service';
import conf from '../confs';
import {AxiosResponse} from 'axios';

class MakerStore implements Store<Maker|null>{
    private sub = new BehaviorSubject<Maker|null>(null);

    public set(maker: Maker|null): void{
        this.sub.next(maker);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }

    public load():void{
        httpClientService.axios.get(conf.API.self())
        .then((response: AxiosResponse<any>) => {
            this.set(response.data);    
        }).catch((e:any) => {
            console.error(e);
        });
    }
}

export default new MakerStore() ;