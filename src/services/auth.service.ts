import { BehaviorSubject } from "rxjs";
import makerStore from '../stores/maker';

export class AuthService{
    public subToken = new BehaviorSubject<string|null>(null);
    public isAuth = false;

    public async authenticated(): Promise<any> {
        if(!this.isAuth){
            this.isAuth = true;
            return await makerStore.load();
        }else{
            this.isAuth = true;
            return Promise.resolve();
        }
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