import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import conf from '../../confs';
import Checkbox from '@material-ui/core/Checkbox';
import NativeSelect from '@material-ui/core/NativeSelect';
import { OfficeSlot } from '../../models/hebdo-slot';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';

interface SlotProps {
    id: string,
    day: string,
    onChange?:any,
    readonly?:boolean,
    officeSlot: OfficeSlot | null
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content:{
        marginTop:0,
        marginBottom:0
    }
    
  }),
);
export default function Slot(props: SlotProps) {
    const classes = useStyles();
    const [readonly, setReadonly] = React.useState(false);
    const [officeSlot, setOfficeSlot] = React.useState({ openAt: '8:00', closeAt: '12:00' });
    const [enable, setEnable] = React.useState(false);

    React.useEffect(() => {
        setReadonly(props.readonly||false);
      }, [props.readonly]);


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
            setOfficeSlot(props.officeSlot);
            setEnable(true);
        } else {
            setOfficeSlot({ openAt: '8:00', closeAt: '18:00' });
            setEnable(false);
        }
    }, [props.officeSlot])

    const checkChange = (e:any) => {
        setEnable(e.target.checked);
        if(props.onChange) props.onChange(e.target.checked ? officeSlot: null);
    };
    const slotChange = (slotProviderFn: any) => {
        const newSlot = slotProviderFn();
        setOfficeSlot(newSlot);
        if(props.onChange) props.onChange(enable ? newSlot:null)
      };


    return (<ExpansionPanel>
        
        <ExpansionPanelSummary classes={{content : classes.content}} expandIcon={<ExpandMoreIcon />} aria-controls={`${props.id}_content`} id={`${props.id}_content`} >
            {readonly && (<Typography>{props.day}</Typography>)}
            {!readonly && (<FormControlLabel
            aria-label="Jour"
            onClick={(event:any) => event.stopPropagation()}
            onFocus={(event:any) => event.stopPropagation()}
            control={<Checkbox checked={enable} onChange={checkChange} />}
            label={props.day}
          />)}
        </ExpansionPanelSummary>

        {!readonly && (<ExpansionPanelDetails>
            <FormControl fullWidth>
                <InputLabel>Ouverture</InputLabel>
                <NativeSelect
                    value={officeSlot.openAt}
                    onChange={(e: any) => slotChange(() => {
                        const newSlot = { ...officeSlot, openAt: e.target.value };
                        setOfficeSlot(newSlot)
                        return newSlot;
                      })}                    
                    inputProps={{
                        name: `openAt_${props.id}`,
                        id: `openAt_${props.id}`,
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
                    onChange={(e: any) => slotChange(() => {
                        const newSlot = { ...officeSlot, closeAt: e.target.value };
                        setOfficeSlot(newSlot)
                        return newSlot;
                      })}                    
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
            </FormControl>
        </ExpansionPanelDetails>)}

        {readonly && (<ExpansionPanelDetails>
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
        </ExpansionPanelDetails>)}
    </ExpansionPanel>)
}