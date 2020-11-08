import React, { forwardRef } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import MakerSlots from '../../../components/maker/maker-slots';
import { HebdoSlot } from '../../../models/hebdo-slot';
import { Maker } from '../../../models/maker';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    notice: {
      marginBottom: "10px"
    },
    formControl: {
      marginTop: "25px"
    },
    container: {},
    field:{
      margin: "8px 0px"
    }
  }),
);

export default forwardRef(function MakerDelivery(props: any, ref: any) {
  const classes = useStyles();
  const [deliveryValidator, setDeliveryValidator] = React.useState<boolean>(false);
  const [maker, setMaker] = React.useState<any>({});
  const [readonly, setReadonly] = React.useState(false);
  const [validateSlots, setValidateSlots] = React.useState(true);

  React.useEffect(() => {
    setMaker(props.maker ? {...props.maker} : {});
  }, [props.maker]);

  React.useEffect(() => {
    const vs = props.validateSlots === true ? true : false;
    setValidateSlots(vs);
    setDeliveryValidator(!vs)
  }, [props.validateSlots]);

  React.useEffect(() => {
    setReadonly(props.readOnly);
  }, [props.readOnly]);

  React.useEffect(() => {
    if (props.validate) {
      (document as any).getElementById(props.id).reportValidity();
    }
  }, [props.validate]);

  const aChange = (m: any, v:boolean) => {
    setMaker(m);
    const check = (document as any).getElementById(props.id).checkValidity();
    if (props.onChange && check !== undefined) props.onChange(m, check && v)
  }

  return (
    <div className="make-delivery"><form className={`${classes.container} mc-container`} ref={ref} id={props.id} onSubmit={e => e.preventDefault()}>
     
      <div className={classes.field}> <TextField
        fullWidth
        disabled={readonly}
        value={maker.deliveryAvailableFrom}
        label="Minimum d'achat (€) pour la livraison"
        onChange={(e: any) => {
          aChange({ ...maker, deliveryAvailableFrom: parseInt(e.target.value,10) }, deliveryValidator)
        }}
        required
        type="number"
        inputProps={{
          id: `${props.id}_deliveryAvailableFrom`,
          readOnly: readonly,
          maxLength: 20,
          min:0
        }}
      /></div>

      <div className={classes.field}>
        <TextField
          fullWidth
          disabled={readonly}
          value={maker.deliveryRadius}
          label="Mon rayon de livraison (km)"
          onChange={(e: any) => { aChange({ ...maker, deliveryRadius:  parseInt(e.target.value,10)  }, deliveryValidator) }}
          required
          type="number"
          inputProps={{
            id: `${props.id}_deliveryRadius`,
            readOnly: readonly,
            maxLength: 20,
            min:0
          }}
        />
      </div>

      <div className={classes.field}>
        <TextField
          fullWidth
          disabled={readonly}
          value={maker.deliveryCost}
          label="Montant de la livraison (€)"
          onChange={(e: any) => { aChange({ ...maker, deliveryCost:  parseInt(e.target.value,10)  }, deliveryValidator) }}
          required
          type="number"
          inputProps={{
            id: `${props.id}_deliveryCost`,
            readOnly: readonly,
            maxLength: 20,
            min:0
          }}
        />
        </div>

        <div className={classes.field}>
          <TextField
            fullWidth
            value={maker.deliveryDescription}
            label="Précision sur le mode de livraison (facultatif)"
            helperText="ex: A mon arrivée, je vous téléphone / Mon véhicule est blanc / En cas de retard, je vous enverrai un SMS."
            onChange={(e: any) => { aChange({ ...maker, deliveryDescription: e.target.value }, deliveryValidator) }}
            type="text"
            rows={2}
            disabled={readonly}
            multiline
            inputProps={{
              id: `${props.id}_deliveryDescription`,
              readOnly: readonly,
              maxLength: 20
            }}
          />
        </div>

       

    </form>
    <MakerSlots readonly={readonly} id={`${props.id}_slots`} history={props.history} slots={maker.delivery} onChange={(d: HebdoSlot, v: boolean) => {
        const newMaker = {...maker};
        newMaker.delivery = d;
        setDeliveryValidator(validateSlots ? v: true);
        aChange(newMaker, validateSlots ? v: true);
      }} /></div>
  );
})
