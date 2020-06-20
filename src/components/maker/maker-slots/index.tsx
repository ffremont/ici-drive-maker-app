import React, { forwardRef } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Place } from '../../../models/place';
import Slot from '../../slot/slot';
import conf from '../../../confs';
import { OfficeSlot } from '../../../models/hebdo-slot';
import Typography from '@material-ui/core/Typography';
/*import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
  GoogleReCaptcha
} from 'react-google-recaptcha-v3';*/
import Checkbox from '@material-ui/core/Checkbox';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    slots: {
      marginTop: "20px"
    },
    cgu: {
      display: 'flex',
      marginTop: '20px',
      alignItems: 'center'
    },
    mslContainer: {
      marginBottom:'80px'
    }

  }),
);
export default forwardRef(function MakerSlots(props: any, ref: any) {
  const classes = useStyles();
  const [maker, setMaker] = React.useState<any>({});
  const [standalone, setStandalone] = React.useState(true);
  const [recaptcha, setRecaptcha] = React.useState<any>("1");
  const [checkCgu, setCheckCgu] = React.useState(false);
  const [readonly, setReadonly] = React.useState(false);

  const [slotsDescription, setSlotsDescription] = React.useState('');

  React.useEffect(() => {
    setMaker(props.maker || {});
    if (props.maker) {
      setSlotsDescription(props.maker.place.slotsDescription || '');
    }
  }, [props.maker]);

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


  const aChange = (makerProviderFn: any) => {
    const newMaker = makerProviderFn();
    setMaker(newMaker);

    let check = Object.keys(maker.place.hebdoSlot).some(day => maker.place.hebdoSlot[day]) && (document as any).getElementById(props.id).checkValidity();
    if(!standalone){
      console.log(recaptcha, Object.keys(maker.place.hebdoSlot).some(day => maker.place.hebdoSlot[day]), (document as any).getElementById(props.id).checkValidity())
      check = check && (recaptcha||false);
    }
    
    if (props.onChange && check !== undefined) props.onChange(newMaker, check, recaptcha)
  };

  const aChangeOnSlot = (day: string) => {
    return (officeSlot: OfficeSlot | null) => {
      aChange(() => {
        const newMaker = { ...maker };
        newMaker.place.hebdoSlot[day] = officeSlot;
        return newMaker;
      })
    };
  }

  //const { executeRecaptcha } = useGoogleReCaptcha();  
  const place = maker && (maker as any).place ? (maker as any).place as Place : null;
  return (
    <form className={`${classes.mslContainer} msl-container`} ref={ref} id={props.id} onSubmit={e => e.preventDefault()}>
      <TextField
        fullWidth
        value={slotsDescription}
        label="Description des horaires"
        helperText="ex: Habituellement ouvert tous les mardi/jeudi/vendredi/samedi de 9h-13h / 16h-18h30"
        type="text"
        onChange={(e: any) => aChange(() => {
          setSlotsDescription(e.target.value);
          const newM = { ...maker };
          newM.place.slotsDescription = e.target.value;
          return newM;
        })}
        required={!readonly}
        inputProps={{
          id: `${props.id}_slotsDescription`,
          readOnly: readonly,
          maxLength: 256
        }}
      />

      {place && (<div className={classes.slots}>
        <Slot id="lundi" officeSlot={place.hebdoSlot.lundi || null} onChange={aChangeOnSlot('lundi')} day="Lundi" />
        <Slot id="mardi" officeSlot={place.hebdoSlot.mardi || null} onChange={aChangeOnSlot('mardi')} day="Mardi" />
        <Slot id="mercredi" officeSlot={place.hebdoSlot.mercredi || null} onChange={aChangeOnSlot('mercredi')} day="Mercredi" />
        <Slot id="jeudi" officeSlot={place.hebdoSlot.jeudi || null} onChange={aChangeOnSlot('jeudi')} day="Jeudi" />
        <Slot id="vendredi" officeSlot={place.hebdoSlot.vendredi || null} onChange={aChangeOnSlot('vendredi')} day="Vendredi" />
        <Slot id="samedi" officeSlot={place.hebdoSlot.samedi || null} onChange={aChangeOnSlot('samedi')} day="Samedi" />
        <Slot id="dimanche" officeSlot={place.hebdoSlot.dimanche || null} onChange={aChangeOnSlot('dimanche')} day="Dimanche" />
      </div>)}

      {!standalone && (<div className={classes.cgu}>
        <Checkbox
          checked={checkCgu}
          required
          onChange={(e) => aChange(() => {
            
            /*if(executeRecaptcha)
              setRecaptcha(executeRecaptcha('register'));*/

            setCheckCgu(e.target.checked);
            return maker;
          })}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        /> <Typography variant="body1" className="accept-cgu">Accepter les <a href={conf.cgr} rel="noopener noreferrer" target="_blank">Conditions Générales d'utilisation</a></Typography>
      </div>)}

      {/*{!standalone && (<GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_RECAPTCH_SITEKEY}>
        <GoogleReCaptcha onVerify={token => setRecaptcha(token)} />
      </GoogleReCaptchaProvider>)}*/}

    </form>
  );
})
