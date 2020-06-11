import React from 'react';
import './MyDrive.scss';
import { Subscription } from 'rxjs';
import makerStore, { MakerStore } from '../../stores/maker';
import { Maker } from '../../models/maker';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuApp from '../../components/menu-app';
import Chip from '@material-ui/core/Chip';
import conf from '../../confs';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import MakerShop from '../../components/maker/maker-shop';
import { NotifType } from '../../models/notif';
import notifStore from '../../stores/notif';
import SnackAdd from '../../components/snack-add';
import TextField from '@material-ui/core/TextField';


class MyDrive extends React.Component<{ history: any, match: any }, { maker: Maker | null, loading: boolean, canSave: boolean }>{

  state = { maker: null, canSave: false, loading: true };

  subMaker: Subscription | null = null;
  makerShopRef: any;

  myId = 'my-drive';

  componentWillUnmount() {
    this.subMaker?.unsubscribe();
  }

  componentDidMount() {
    this.makerShopRef = React.createRef();
    this.subMaker = makerStore.subscribe((maker: Maker) => {
      if (maker) {
        maker.startDriveAfterDays = maker.startDriveAfterDays || conf.defaultStartDriveAfterDays;

        this.setState({ maker, loading: false });
      }
    });
  }

  onClickSave() {
    this.setState({ loading: true });
    const nMaker = { ...(this.state.maker as any) };
    delete nMaker.products;
    MakerStore.updateSelf(nMaker as any)
      .then(() => {
        this.setState({ canSave: false });
        notifStore.set({ message: 'Enregistrement réussi', type: NotifType.DEFAULT })
      })
      .catch(e => {
        console.error(e);
        this.props.history.push('/error');
      }).finally(() => this.setState({ loading: false }));
  }

  onChange(m: Maker, isValid: boolean) {
    this.setState({ canSave: isValid, maker: m });
  }

  onChangePhone(newPhone:string){
    const newMaker = {...(this.state.maker as any), phone:newPhone};

    this.setState({ canSave: newPhone && (newPhone.length >= 10) && this.makerShopRef.current.checkValidity(), maker: newMaker });
  }


  render() {
    const maker = (this.state.maker as any) as any;

    return (<div className="my-drive">
      <MenuApp mode="light" history={this.props.history} />
      <SnackAdd />
      {maker && (<div className="categories">
        <span className="cat-title">Catégories :</span> {(maker.categories || []).map((catId: any, i: any) => {
          const cat = conf.categories.find(c => c.id === catId);
          return (<Chip size="small" key={`cat_${i}`} color="primary" label={cat ? cat.label : catId} />);
        })}
      </div>)}

      {maker && (<MakerShop ref={this.makerShopRef} id="maker-shop" history={this.props.history} maker={maker} onChange={(m: Maker, v: boolean) => this.onChange(m, v)} />)}

        {maker && (<div className="phone-container"><TextField
        fullWidth
        value={maker.phone}
        label="Téléphone"
        onChange={(e:any) => this.onChangePhone(e.target.value)}
        required
        type="tel"
        inputProps={{
          maxLength:20
        }}
      /></div>)}

      <Fab color="primary" onClick={() => this.onClickSave()} className="save-fab" aria-label="add" disabled={!this.state.canSave}>
        <SaveIcon />
      </Fab>



      <Backdrop className="backdrop" open={this.state.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

    </div>);
  }
}


export default MyDrive;
