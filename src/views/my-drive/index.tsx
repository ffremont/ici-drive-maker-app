import React from 'react';
import './MyDrive.scss';
import { Subscription } from 'rxjs';
import makerStore from '../../stores/maker';
import { Maker } from '../../models/maker';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuApp from '../../components/menu-app';
import Chip from '@material-ui/core/Chip';
import conf from '../../confs';
import TextField from '@material-ui/core/TextField';

class MyDrive extends React.Component<{ history: any, match: any }, { maker: Maker | null }>{

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
    const maker = (this.state.maker as any) as Maker;

    return (<div className="my-drive">
      <MenuApp mode="light" history={this.props.history} />

      {maker && (<div className="area">
        <div className="image">
          <img src={maker.image} alt="producteur" />
        </div>

        <div className="categories">
          {(maker.categories || []).map((catId,i) => {
            const cat = conf.categories.find(c => c.id === catId);
            return (<Chip size="small" key={`cat_${i}`} color="primary" label={cat ? cat.label : catId} />);
          })}
        </div>

        <TextField
          fullWidth
          value={maker.name}
          label="Titre"
          type="text"
          inputProps={{
            readOnly: true
          }}
        />
        <TextField
          fullWidth
          value={maker.phone}
          label="Téléphone"
          type="text"
          inputProps={{
            readOnly: true
          }}
        />
        <TextField
          fullWidth
          value={maker.description}
          label="Description"
          multiline
          rows={2}
          type="text"
          inputProps={{
            readOnly: true
          }}
        />

        <div className="categories payments">
          {maker.payments?.acceptPaypal && (<Chip key="acceptPaypal" size="small" color="secondary" label="Paypal" />)}
          {maker.payments?.acceptBankCheck && (<Chip key="acceptBankCheck" size="small" color="secondary" label="Chèques" />)}
          {maker.payments?.acceptCoins && (<Chip key="acceptCoins" size="small" color="secondary" label="Espèces" />)}
          {maker.payments?.acceptCards && (<Chip key="acceptCards" size="small" color="secondary" label="Carte bleue" />)}

        </div>
        <TextField
          fullWidth
          value={maker.prefixOrderRef}
          label="Préfix de références produits"
          type="text"
          inputProps={{
            readOnly: true
          }}
        />
        <TextField
          fullWidth
          value={maker.webPage}
          label="Page web"
          type="text"
          inputProps={{
            readOnly: true
          }}
        />
      </div>)}

      {!maker && (<Backdrop className="backdrop" open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>)}

    </div>);
  }
}


export default MyDrive;
