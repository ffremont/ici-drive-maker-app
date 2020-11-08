import React, { forwardRef } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Slot from '../../slot/slot';
import { HebdoSlot, OfficeSlot } from '../../../models/hebdo-slot';
/*import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
  GoogleReCaptcha
} from 'react-google-recaptcha-v3';*/


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    slots: {
      marginTop: "20px"
    },
    mslContainer: {
      marginBottom:'40px'
    }

  }),
);
export default forwardRef(function MakerSlots(props: any, ref: any) {
  const classes = useStyles();
  const [maker, setMaker] = React.useState<any>({});
  const [slots, setSlots] = React.useState<any>({});
  const [standalone, setStandalone] = React.useState(true);
  const [recaptcha, setRecaptcha] = React.useState<any>("1");
  const [checkCgu, setCheckCgu] = React.useState(false);
  const [readonly, setReadonly] = React.useState(false);

  React.useEffect(() => {
    setMaker(props.maker || {});
  }, [props.maker]);

  React.useEffect(() => {
    setSlots(props.slots || {});
  }, [props.slots]);

  React.useEffect(() => {
    setStandalone(props.standalone);
  }, [props.standalone]);

  React.useEffect(() => {
    setReadonly(props.readonly);
  }, [props.readonly]);

  React.useEffect(() => {
    if (props.validate) {
      (document as any).getElementById(props.id).reportValidity();
    }
  }, [props.validate]);


  const aChange = (slotsProviderFn: any) => {
    const newSlots = slotsProviderFn();
    setSlots(newSlots);

    let check = Object.keys(slots).some(day =>slots[day]) && (document as any).getElementById(props.id).checkValidity();
    if(!standalone){
      check = check && (recaptcha||false);
    }
    
    if (props.onChange && check !== undefined) props.onChange(newSlots, check, recaptcha)
  };

  const aChangeOnSlot = (day: string) => {
    return (officeSlot: OfficeSlot | null) => {
      aChange(() => {
        if(officeSlot)
          slots[day] = officeSlot;
        else{
          if(slots[day]) delete slots[day];
        }
        
        if(Object.values(slots).length === 0) return null;
        else return slots;
      })
    };
  }

  //const { executeRecaptcha } = useGoogleReCaptcha();  
  return (
    <form className={`${classes.mslContainer} msl-container mc-container`} ref={ref} id={props.id} onSubmit={e => e.preventDefault()}>
      

      {slots && (<div className={classes.slots}>
        <Slot id="lundi" officeSlot={slots.lundi || null} onChange={aChangeOnSlot('lundi')} day="Lundi" />
        <Slot id="mardi" officeSlot={slots.mardi || null} onChange={aChangeOnSlot('mardi')} day="Mardi" />
        <Slot id="mercredi" officeSlot={slots.mercredi || null} onChange={aChangeOnSlot('mercredi')} day="Mercredi" />
        <Slot id="jeudi" officeSlot={slots.jeudi || null} onChange={aChangeOnSlot('jeudi')} day="Jeudi" />
        <Slot id="vendredi" officeSlot={slots.vendredi || null} onChange={aChangeOnSlot('vendredi')} day="Vendredi" />
        <Slot id="samedi" officeSlot={slots.samedi || null} onChange={aChangeOnSlot('samedi')} day="Samedi" />
        <Slot id="dimanche" officeSlot={slots.dimanche || null} onChange={aChangeOnSlot('dimanche')} day="Dimanche" />
      </div>)}

      {/*{!standalone && (<GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_RECAPTCH_SITEKEY}>
        <GoogleReCaptcha onVerify={token => setRecaptcha(token)} />
      </GoogleReCaptchaProvider>)}*/}


    </form>
  );
})
