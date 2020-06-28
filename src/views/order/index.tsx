import React from 'react';
import './Order.scss';
import ordersStore, { OrdersStore } from '../../stores/orders';
import { Subscription } from 'rxjs';
import * as O from '../../models/order';
import * as moment from 'moment';
import { withStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import { deepOrange, grey, green } from '@material-ui/core/colors';
import Chip from '@material-ui/core/Chip';
import Fab from '@material-ui/core/Fab';
import { Maker } from '../../models/maker';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ClearIcon from '@material-ui/icons/Clear';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import PrintIcon from '@material-ui/icons/Print';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import PhoneIcon from '@material-ui/icons/Phone';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';

import Confirm from './confirm';
import MenuApp from '../../components/menu-app';
import SnackAdd from '../../components/snack-add';


import notifStore from '../../stores/notif';
import { NotifType } from '../../models/notif';

const actions = [
  { icon: <PrintIcon />, name: 'print', label: 'Imprimer' },
  { icon: <PhoneIcon />, name: 'phone', label: 'Contacter' },
  { icon: <AlternateEmailIcon />, name: 'copy-email', label: 'Copier' },
  { icon: <ClearIcon />, name: 'cancel', label: 'Annuler' }
];

const useStyles = (theme: Theme) => ({
  table: {
    minWidth: 650,
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  grey: {
    color: theme.palette.getContrastText(grey[500]),
    backgroundColor: grey[500],
  },
  green: {
    color: theme.palette.common.white,
    backgroundColor: green[500],
  }
});

class Order extends React.Component<{ history: any, classes: any, match: any }, { openVerifiedDialog: boolean, openRefusedDialog: boolean, openCancelDialog: boolean, order: O.Order | null, open: boolean, hidden: boolean }>{

  state = { order: null, open: false, hidden: false, openCancelDialog: false, openRefusedDialog: false, openVerifiedDialog: false };
  status: any = {};
  sub: Subscription | null = null;


  componentWillUnmount() {
    this.sub?.unsubscribe();
  }

  componentDidMount() {
    this.status[O.OrderState.PENDING] = { label: 'A vérifier', color: this.props.classes.orange };
    this.status[O.OrderState.CANCELLED] = { label: 'Annulée', color: this.props.classes.grey };
    this.status[O.OrderState.VERIFIED] = { label: 'En attente de confirmation', color: this.props.classes.orange };
    this.status[O.OrderState.CONFIRMED] = { label: 'Confirmée', color: this.props.classes.green };
    this.status[O.OrderState.REFUSED] = { label: 'Refusée', color: this.props.classes.grey }

    const id: string = this.props.match.params.id;
    this.sub = ordersStore.subscribe((orders: O.Order[]) => {
      console.log('Order > ordersStore.sub ', orders);
      if (orders && orders.length) {
        this.setState({ order: orders[0] });
      }
    });

    // charge la liste des commandes
    ordersStore.load(id);
  }

  onClickVerifiedOrder(txt: string) {
    const newOrder: O.Order = { ...(this.state.order as any) };
    newOrder.reasonOf = txt;
    newOrder.status = O.OrderState.VERIFIED;
    OrdersStore.update(newOrder)
      .then(() => ordersStore.load(this.props.match.params.id))
      .catch(() => this.props.history.push('/error'));
  }

  onClickRefusedOrder(txt: string) {
    const newOrder: O.Order = { ...(this.state.order as any) };
    newOrder.reasonOf = txt;
    newOrder.status = O.OrderState.REFUSED;
    OrdersStore.update(newOrder)
      .then(() => ordersStore.load(this.props.match.params.id))
      .catch(() => this.props.history.push('/error'));
  }


  cancel(text: string) {
    const newOrder: O.Order = { ...(this.state.order as any) };
    newOrder.reasonOf = text;
    newOrder.status = O.OrderState.CANCELLED;
    OrdersStore.update(newOrder)
      .then(() => this.props.history.push('/my-orders'))
      .catch(() => this.props.history.push('/error'));
  }

  onClickDialAction(action: any) {
    this.setState({ open: false });
    if (action && (action.name === 'print')) {
      window.print();
    } else if (action && (action.name === 'cancel')) {
      this.setState({ openCancelDialog: true });
    } else if (action && (action.name === 'phone')) {
      window.open(`tel:${(this.state.order as any).maker.phone}`);
    } else if (action && (action.name === 'copy-email')) {
      const copyText = document.querySelector('#customer_email') as any;
      if (copyText) {
        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");

        notifStore.set({ message: 'Copier dans le presse-papier', type: NotifType.DEFAULT })
      }
    }
  }

  render() {
    const currentOrder: O.Order = (this.state.order as any) as O.Order;
    const maker: Maker = (currentOrder?.maker as any) as Maker;



    let paymentsLabels = '';
    if (maker && maker.payments && !maker.payments.acceptPaypal) {
      paymentsLabels = [
        maker.payments?.acceptCards ? `par carte` : null,
        maker.payments?.acceptBankCheck ? `par chèque` : null,
        maker.payments?.acceptCoins ? `en espèce` : null].filter(c => c !== null).join(' / ');
    } else if (maker && maker.payments && maker.payments.acceptPaypal) {
      paymentsLabels = 'en ligne via Paypal';
    }

    return (<div className="order">
      <MenuApp mode="light" history={this.props.history} />
      {currentOrder && (<Grid container direction="column" justify="center" spacing={1}>

        <SnackAdd />
        <Grid item>
          <Chip label={this.status[(currentOrder.status as any)].label} className={this.status[(currentOrder.status as any)].color} />
        </Grid>

        {(currentOrder.status === O.OrderState.CONFIRMED) && paymentsLabels && (<Grid item>
          <Alert severity="warning">
            <strong>Consignes de paiement : </strong>{paymentsLabels}
          </Alert>
        </Grid>)}

        {currentOrder.reasonOf && (<Grid item>
          <Alert severity="info">{currentOrder.reasonOf}</Alert>
        </Grid>)}


        <Grid item>
          <Grid container direction="column" justify="center" spacing={1}>
            <Grid item>
              <TextField label="Référence" variant="filled" fullWidth={true} value={currentOrder.ref} inputProps={{ readOnly: true }} />
            </Grid>
            <Grid item>
              <TextField label="Réalisée le" variant="filled" fullWidth={true} value={moment.default(currentOrder.created).format('ddd D MMM à HH:mm')} inputProps={{ readOnly: true }} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid className="my-group" container direction="column" justify="center" spacing={1}>
            <Grid item>
              <TextField label="Vendeur" variant="filled" fullWidth={true} value={maker.name} inputProps={{ readOnly: true }} />
            </Grid>
            {maker.phone && (<Grid item>
              <TextField label="Téléphone" variant="filled" fullWidth={true} value={maker.phone} inputProps={{ readOnly: true }} />
            </Grid>)}
            {maker.address && (<Grid item>
              <TextField label="Adresse" variant="filled" fullWidth={true} value={maker.address} inputProps={{ readOnly: true }} />
            </Grid>)}
          </Grid>
        </Grid>
        <Grid item>
          <Grid container className="my-group" direction="column" justify="center" spacing={1}>
            <Grid item>
              <TextField label="@ Client" id="customer_email" variant="filled" fullWidth={true} value={currentOrder.customer?.email} inputProps={{ readOnly: true }} />
            </Grid>
            {currentOrder.customer?.lastname && currentOrder.customer?.firstname && (<Grid item>
              <TextField label="Nom / Prénom" variant="filled" fullWidth={true} value={`${currentOrder.customer?.lastname} ${currentOrder.customer?.firstname}`} inputProps={{ readOnly: true }} />
            </Grid>)}
            {currentOrder.customer?.phone && (<Grid item>
              <TextField label="Téléphone" id="customer_phone" variant="filled" fullWidth={true} value={currentOrder.customer?.phone} inputProps={{ readOnly: true }} />
            </Grid>)}
            {currentOrder.customer?.address && (<Grid item>
              <TextField label="Adresse" variant="filled" fullWidth={true} value={currentOrder.customer?.address} inputProps={{ readOnly: true }} />
            </Grid>)}
          </Grid>
        </Grid>


        <Grid item>
          <Grid container direction="column" justify="center" spacing={1}>
            <Grid item>
              <TextField label="Retrait / livraison" variant="filled" fullWidth={true} value={maker.place.label} inputProps={{ readOnly: true }} />
            </Grid>
            <Grid item>
              <TextField label="Adresse" variant="filled" fullWidth={true} value={maker.place.address} inputProps={{ readOnly: true }} />
            </Grid>
            <Grid item>
              <TextField label="Horaire du retrait" variant="filled" fullWidth={true} value={moment.default(currentOrder.slot).format('ddd D MMM à HH:mm')} inputProps={{ readOnly: true }} />
            </Grid>
          </Grid>
        </Grid>


      </Grid>)}

      {currentOrder && currentOrder.choices && (<TableContainer>
        <Table className={this.props.classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Quantité</TableCell>
              <TableCell align="center">Réf.</TableCell>
              <TableCell align="center">P.U.</TableCell>
              <TableCell align="center">Libellé</TableCell>
              <TableCell align="center">Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOrder.choices.map((pc: O.ProductChoice, i) => (
              <TableRow key={`pc_${i}`}>
                <TableCell align="center">{pc.quantity}</TableCell>
                <TableCell align="center">{pc.product.ref}</TableCell>
                <TableCell align="center">{pc.product.price}</TableCell>
                <TableCell align="center">{pc.product.label}</TableCell>
                <TableCell align="center">{pc.product.description}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">Total</TableCell>
              <TableCell align="center">{currentOrder.total || 'ERREUR'}€</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>)}

      <Confirm title="Annuler la réservation" withText={true} onClose={() => this.setState({ openCancelDialog: false })} onConfirm={(txt: string) => this.cancel(txt)} message="Je souhaite annuler pour le motif :" open={this.state.openCancelDialog} />


      <Confirm title="Vérification de stocks"
        withText={true}
        onClose={() => this.setState({ openVerifiedDialog: false })}
        onConfirm={(txt: string) => this.onClickVerifiedOrder(txt || '')}
        okText={`J'ai vérifié`}
        message="Merci de préciser s'il manque ou non des produits."
        open={this.state.openVerifiedDialog} />

      <Confirm title="Refuser la demande"
        withText={true}
        onClose={() => this.setState({ openRefusedDialog: false })}
        onConfirm={(txt: string) => this.onClickRefusedOrder(txt || '')}
        okText={`Je refuse`}
        message="La réservation passera à l'état 'refuser'. Merci d'indiquer un motif."
        open={this.state.openRefusedDialog} />



      {/* Actions en fonction des états */}

      {currentOrder && currentOrder.status !== O.OrderState.PENDING && (<SpeedDial
        ariaLabel="SpeedDial tooltip example"
        className="my-speed-dial"
        hidden={this.state.hidden}
        icon={<SpeedDialIcon />}
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        open={this.state.open}
      >
        {actions.filter(a => ((currentOrder.status === O.OrderState.CANCELLED) || (
          currentOrder.status === O.OrderState.REFUSED) )&& a.name === 'cancel' ? false : true)
        .map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.label}
            tooltipOpen
            onClick={() => this.onClickDialAction(action)}
          />
        ))}
      </SpeedDial>)}

      {currentOrder && currentOrder.status === O.OrderState.PENDING && (
        <div className="fab-actions">

          <Fab size="large" color="default" onClick={() => this.setState({ openRefusedDialog: true })} aria-label="add" className="fab-cancelled">
            <CloseIcon />
          </Fab>

          <Fab size="large" color="secondary" onClick={() => this.setState({ openVerifiedDialog: true })} aria-label="add" className="fab-verified">
            <CheckIcon />
          </Fab>

        </div>
      )}

    </div>);
  }
}

export default withStyles(useStyles)(Order);
