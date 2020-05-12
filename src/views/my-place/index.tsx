import React from 'react';
import './MyPlace.scss';
import { Subscription } from 'rxjs';
import makerStore from '../../stores/maker';
import { Maker } from '../../models/maker';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuApp from '../../components/menu-app';
import TextField from '@material-ui/core/TextField';
import { Place } from '../../models/place';
import Slot from './slot';

class MyPlace extends React.Component<{ history: any, match: any }, { maker: Maker | null }>{

  state = { maker: null };

  subMaker: Subscription | null = null;

  componentWillUnmount() {
    this.subMaker?.unsubscribe();
  }

  componentDidMount() {
    this.subMaker = makerStore.subscribe((maker: Maker) => {
      if (maker) {
        this.setState({ maker });
      }
    });
  }

  render() {
    const place = this.state.maker && (this.state.maker as any).place ? (this.state.maker as any).place as Place : null;

    return (<div className="my-place">
      <MenuApp mode="light" history={this.props.history} />

      {place && (<div className="area">
        <div className="image">
          <img src={place.image} alt="retrait et livraison" />
        </div>


        <TextField
          fullWidth
          value={place.label}
          label="Titre du lieu"
          type="text"
          inputProps={{
            readOnly: true
          }}
        />
        <TextField
          fullWidth
          value={place.slotsDescription}
          label="Description des horaires"
          type="text"
          multiline
          rows={2}
          inputProps={{
            readOnly: true
          }}
        />
        <TextField
          fullWidth
          value={place.address}
          label="Adresse"
          type="text"
          inputProps={{
            readOnly: true
          }}
        />

        <TextField
          fullWidth
          value={place.description}
          label="Description du lieu"
          multiline
          rows={2}
          type="text"
          inputProps={{
            readOnly: true
          }}
        />

        <div className="slots">
          { place.hebdoSlot.lundi && (<Slot id="lundi" officeSlot={place.hebdoSlot.lundi || null} day="Lundi" />)}
          { place.hebdoSlot.mardi && (<Slot id="mardi" officeSlot={place.hebdoSlot.mardi || null} day="Mardi" />)}
          { place.hebdoSlot.mercredi && (<Slot id="mercredi" officeSlot={place.hebdoSlot.mercredi || null} day="Mercredi" />)}
          { place.hebdoSlot.jeudi && (<Slot id="jeudi" officeSlot={place.hebdoSlot.jeudi || null} day="Jeudi" />)}
          { place.hebdoSlot.vendredi && (<Slot id="vendredi" officeSlot={place.hebdoSlot.vendredi || null} day="Vendredi" />)}
          { place.hebdoSlot.samedi && (<Slot id="samedi" officeSlot={place.hebdoSlot.samedi || null} day="Samedi" />)}
          { place.hebdoSlot.dimanche && (<Slot id="dimanche" officeSlot={place.hebdoSlot.dimanche || null} day="Dimanche" />)}



        </div>
      </div>)}
      {!place && (<Backdrop className="backdrop" open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>)}

    </div>);

  }
}


export default MyPlace;
