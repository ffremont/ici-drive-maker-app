import React from 'react';
import './MyPlace.scss';
import { Subscription } from 'rxjs';
import makerStore, { MakerStore } from '../../stores/maker';
import { Maker } from '../../models/maker';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuApp from '../../components/menu-app';
import { Place } from '../../models/place';
import MakerPlace from '../../components/maker/maker-place';
import MakerSlots from '../../components/maker/maker-slots';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import SnackAdd from '../../components/snack-add';
import notifStore from '../../stores/notif';
import { NotifType } from '../../models/notif';
import { HebdoSlot } from '../../models/hebdo-slot';


class MyPlace extends React.Component<{ history: any, match: any }, { maker: Maker | null, canSave:boolean, loading:boolean }>{

  state = { maker: null, canSave:false, loading:true };

  makerPlaceRef: any;
  makerSlotsRef: any;

  subMaker: Subscription | null = null;

  componentWillUnmount() {
    this.subMaker?.unsubscribe();
  }

  componentDidMount() {
    this.makerPlaceRef = React.createRef();
    this.makerSlotsRef = React.createRef();
    this.subMaker = makerStore.subscribe((maker: Maker) => {
      if (maker) {
        this.setState({ maker, loading:false });
      }

    });
  }

  onChange(newMaker:Maker, isValid:boolean){
    this.setState({ canSave: isValid, maker: newMaker });
  }

  onClickSave() {
    this.setState({ loading: true });
    const nMaker = { ...(this.state.maker as any) };
    
    MakerStore.updateSelf(nMaker as any)
      .then(() => {
        makerStore.load();
        this.setState({ canSave: false });
        notifStore.set({ message: 'Enregistrement réussi', type: NotifType.DEFAULT })
      })
      .catch(e => {
        console.error(e);
        this.props.history.push('/error');
      }).finally(() => this.setState({ loading: false }));
  }

  render() {
    const place = this.state.maker && (this.state.maker as any).place ? (this.state.maker as any).place as Place : null;

    return (<div className="my-place">
      <MenuApp mode="my-place" history={this.props.history} />
      <SnackAdd />
      {place && (<MakerPlace ref={this.makerPlaceRef} id="maker-shop_edit" history={this.props.history} maker={this.state.maker} onChange={(m: Maker, v: boolean) => this.onChange(m, v)} />)}
      {place && (<MakerSlots ref={this.makerSlotsRef} id="maker-slots_edit" history={this.props.history} slots={place.hebdoSlot} onChange={(hs: HebdoSlot, v: boolean) => {
        const newMaker = {...(this.state.maker as any)};
        newMaker.place.hebdoSlot = hs
        this.onChange(newMaker, v);
      }} />)}

      <Fab color="primary" onClick={() => this.onClickSave()} className="save-fab" aria-label="add" disabled={!this.state.canSave}>
        <SaveIcon />
      </Fab>
      <Backdrop className="backdrop" open={this.state.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

    </div>);

  }
}


export default MyPlace;
