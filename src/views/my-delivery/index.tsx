import React from 'react';
import './MyDelivery.scss';
import { Subscription } from 'rxjs';
import makerStore, { MakerStore } from '../../stores/maker';
import { Maker } from '../../models/maker';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuApp from '../../components/menu-app';
import { Place } from '../../models/place';
import MakerSlots from '../../components/maker/maker-slots';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import SnackAdd from '../../components/snack-add';
import notifStore from '../../stores/notif';
import { NotifType } from '../../models/notif';
import { TextField } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { HebdoSlot } from '../../models/hebdo-slot';
import MakerDelivery from '../../components/maker/maker-delivery';


class MyDelivery extends React.Component<{ history: any, match: any }, { maker: Maker | null, canSave: boolean, loading: boolean, makerDeliveryValidator:boolean, makerSlotsValidator:boolean }>{

  state = { maker: null, canSave: false, loading: true, makerDeliveryValidator:false, makerSlotsValidator:false };

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
        this.setState({ maker, loading: false });
      }

    });
  }

  onChange(newMaker: Maker, isValid: boolean) {
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
    const maker: any = this.state.maker;

    return (<div className="my-delivery">
      <MenuApp mode="my-delivery" history={this.props.history} />
      <SnackAdd />
      <div className="content-my-delivery">
      <Alert severity="info">
        <AlertTitle>Fonctionnement des livraisons</AlertTitle>
          <strong>En plus du Drive obligatoire</strong>, je paramètre ici mes créneaux de livraisons (facultatif).<br/> <strong>Dès qu'un créneau sera renseigné, la fonctionnalité sera activée</strong>.
      </Alert>

      {place && (<MakerDelivery id="my_delivery" validateSlots={false} maker={maker} onChange={(m:Maker,v:boolean) =>{ 
        this.setState({makerDeliveryValidator:v});
        this.onChange(m, v);
      }}

      ></MakerDelivery>)}


      <Fab color="primary" onClick={() => this.onClickSave()} className="save-fab" aria-label="add" disabled={!this.state.canSave}>
        <SaveIcon />
      </Fab>
      <Backdrop className="backdrop" open={this.state.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      </div>
    </div>);

  }
}

export default MyDelivery;