import React from 'react';
import MenuApp from '../../components/menu-app';
import Typography from '@material-ui/core/Typography';
import './MyCalendar.scss';
import Calendar from 'react-calendar'
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import makerStore, { MakerStore } from '../../stores/maker';
import { Subscription } from 'rxjs';
import { Maker } from '../../models/maker';
import { NotifType } from '../../models/notif';
import notifStore from '../../stores/notif';
import makerService from '../../services/maker.service';
import Alert from '@material-ui/lab/Alert';
import * as moment from 'moment';
import conf from '../../confs';


const n = new Date();
const myMaxDate = new Date(n.getFullYear(), 11, 31, 23, 59, 59);

class MyCalendar extends React.Component<{ history: any, location: any }, { maker: Maker | null, maxDate: Date, firstSlot: string, loading: Boolean, minDate: Date, canSave: boolean, close: number[] }> {

    state = { firstSlot: '', maker: null, minDate: new Date(), maxDate: myMaxDate, close: [], canSave: false, loading: true };

    subMaker: Subscription | null = null;

    componentDidMount() {
        this.subMaker = makerStore.subscribe((maker: Maker) => {
            if (maker) {
                const nextSlots = makerService.getSlots(maker, 1);
                this.setState({
                    maker,
                    close: (maker.weekCloses || []).concat([]),
                    firstSlot: nextSlots.length ? moment.default(nextSlots[0]).format('ddd D MMM à HH:mm') : '',
                    loading: false
                });
            }
        });
    }

    /**
     * classname de la cellule de la date
     * @param date 
     * @param view 
     */
    tileClassName(date: any, view: any) {
        const week: number = moment.default(date).week();
        return view === 'month' && this.state.close.findIndex(c => c === week) > -1 ? 'wc' : '';
    }

    /**
     * Si on clique sur un date, on ajoute / retire la semaine de fermeture
     * @param date 
     */
    onClickDay(date: any) {
        const newClose = this.state.close.concat([]);
        const week: any = moment.default(date).week();
        const i = newClose.findIndex(c => c === week);
        if (i === -1)
            (newClose as number[]).push(week);
        else {
            newClose.splice(i, 1);
        }
        const newMaker = { ...(this.state.maker as any) };
        newMaker.weekCloses = newClose;

        const nextSlots = makerService.getSlots(newMaker,1);

        this.setState({
            close: newClose,
            canSave: true,
            firstSlot: nextSlots.length ? moment.default(nextSlots[0]).format('ddd D MMM à HH:mm') : ''
        });
    }

    onClickSave() {
        this.setState({ loading: true });
        const nMaker = { ...(this.state.maker as any) };
        nMaker.weekCloses = this.state.close;

        delete nMaker.products;
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
        return (<div className="my-calendar">
            <MenuApp mode="my-calendar" history={this.props.history} />

            <Typography className="my-title" variant="h5">
                Mes absences
</Typography>

            <Typography align="center" className="close-description" variant="body1">
                Calendrier des fermetures du Drive / Livraison à l'année.
</Typography>

            {this.state.firstSlot && false && (<Alert severity="info" className="info-drive">
                Exemple, créneau Drive possible au plus tôt dans {(this.state.maker as any).startDriveAfterDays|| conf.defaultStartDriveAfterDays}j soit le <strong>{this.state.firstSlot}</strong></Alert>)}
                <Alert severity="info" className="info-drive">
        Veuillez renseigner précisément toutes les <strong>semaines</strong> où vous souhaitez fermer le Drive et les livraisons (congés, rupture des stocks, activité saisonnière...). <br/>Vous êtes libre de fermer autant que vous le souhaitez et de modifier selon vos besoins ce planning.
        <br/>Les fermetures sont faites à la semaine entière.
                    </Alert>

            <div className="container-calendar">
                {this.state.maker && (<Calendar
                    className="my-element"
                    defaultView="month"
                    maxDate={this.state.maxDate}
                    minDate={this.state.minDate}
                    onClickDay={(value: any) => this.onClickDay(value)}
                    tileClassName={(props: any) => this.tileClassName(props.date, props.view)}
                    locale="fr-FR"
                ></Calendar>)}
            </div>

            <Fab color="primary" onClick={() => this.onClickSave()} className="save-fab" aria-label="add" disabled={!this.state.canSave}>
                <SaveIcon />
            </Fab>
            <Backdrop className="backdrop" open={this.state.loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>)
    }
}


export default MyCalendar;