import { Maker } from "../models/maker";
import { BehaviorSubject } from "rxjs";
import makerStore from '../stores/maker';

export class AuthService{
    public subToken = new BehaviorSubject<string|null>(null);
    public isAuth = false;

    public authenticated(): void {
        if(!this.isAuth){
            makerStore.load();
        }
        this.isAuth = true;
    }

    public setIdToken(idToken:string){
        this.subToken.next(idToken);
    }

    signout() {
        this.isAuth = false;
        this.subToken.next(null);
        
        if((window as any).firebase){
            (window as any).firebase.auth().signOut();
        }
    }
}

export default new AuthService() ;