import React from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//import InputLabel from '@material-ui/core/InputLabel';
//import FormControl from '@material-ui/core/FormControl';
import conf from '../../confs';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
//import NativeSelect from '@material-ui/core/NativeSelect';
import { OfficeSlot } from '../../models/hebdo-slot';
import TextField from '@material-ui/core/TextField';

interface SlotProps {
    id: string,
    day: string,
    officeSlot: OfficeSlot | null
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        field: {
            margin: '0px 5px'
        },
    }),
);

export default function Slot(props: SlotProps) {
    const classes = useStyles();
    const [officeSlot, setOfficeSlot] = React.useState({ openAt: '8:00', closeAt: '12:00' });

    //on parcours tous les créneaux pour le jour "ouvert"
    let start = new Date(); start.setHours(6); start.setMinutes(0); start.setSeconds(0);
    const end = new Date(); end.setHours(23); end.setMinutes(0); end.setSeconds(0);
    const slotsQty = parseInt(`${(end.getTime() - start.getTime()) / conf.slotQuantity}`, 10) + 1;
    const results = [];
    for (let j = 0; j < slotsQty; j++) {
        start = new Date(start.getTime() + ((j > 0) ? conf.slotQuantity : 0));
        results.push(new Date(start));
    }

    React.useEffect(() => {
        if (props.officeSlot) {
            setOfficeSlot(props.officeSlot)
        } else {
            setOfficeSlot({ openAt: '8:00', closeAt: '18:00' });
        }
    }, [props.officeSlot])


    return (<ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${props.id}_content`} id={`${props.id}_content`} >
            <Typography>{props.day}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
            <TextField
                fullWidth
                value={officeSlot.openAt}
                label="Ouverture"
                inputProps={{
                    readOnly: true
                }}
            />
            <TextField
                fullWidth
                value={officeSlot.closeAt}
                label="Fermeture"
                inputProps={{
                    readOnly: true
                }}
            />
            {/*<FormControl className={classes.field} fullWidth>
                <InputLabel>Ouverture</InputLabel>
                <NativeSelect
                    value={officeSlot.openAt}
                    onChange={(e) => onChange(e.target.value as any)}
                    inputProps={{
                        name: `openAt_${props.id}`,
                        id: `openAt_${props.id}`
                    }}
                >
                    {results.map((slot, i) => {
                        const v = `${slot.getHours()}:${slot.getMinutes() < 10 ? '0' + slot.getMinutes() : slot.getMinutes()}`;
                        return <option key={`${props.id}_${i}`} value={v}>{v}</option>
                    })}
                </NativeSelect>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Fermeture</InputLabel>
                <NativeSelect
                    value={officeSlot.closeAt}
                    onChange={(e) => onChange(e.target.value as any)}
                    inputProps={{
                        name: `closeAt_${props.id}`,
                        id: `closeAt_${props.id}`,
                    }}
                >
                    {results.map((slot, i) => {
                        const v = `${slot.getHours()}:${slot.getMinutes() < 10 ? '0' + slot.getMinutes() : slot.getMinutes()}`;
                        return <option key={`${props.id}_${i}`} value={v}>{v}</option>
                    })}
                </NativeSelect>
            </FormControl>*/}

        </ExpansionPanelDetails>
    </ExpansionPanel>)
}