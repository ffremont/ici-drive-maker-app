import React, {forwardRef} from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import imageCompression from 'browser-image-compression';
import { Maker, PaymentMaker } from '../../../models/maker';
import Button from '@material-ui/core/Button';
import conf from '../../../confs';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    
    formControl: {
      width: "100%",
      marginTop:"25px"
    },
    container:{
      marginBottom: "60px"
    }
  }),
);

export default forwardRef(function MakerShop(props: any, ref:any) {
  const classes = useStyles();

  const [maker, setMaker] = React.useState<Maker | null>(null);
  const [name, setName] = React.useState('');
  const [startDriveAfterDays, setStartDriveAfterDays] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [webPage, setWebPage] = React.useState('');
  const [prefixOrderRef, setPrefixOrderRef] = React.useState('');
  const [payments, setPayments] = React.useState<PaymentMaker>({
    acceptBankCheck: false,
    acceptCards: false,
    acceptCoins: false,
    acceptPaypal: false
  });

  const [readonly, setReadonly] = React.useState(false);
  const [image, setImage] = React.useState(conf.baseURL + '/default_image.jpg');

  React.useEffect(() => {
    setMaker(props.maker || null);
    if (props.maker) {
      if (props.maker.image) setImage(props.maker.image)
      setName(props.maker.name);
      setDescription(props.maker.description);
      setPrefixOrderRef(props.maker.prefixOrderRef);
      if (props.maker.payments) setPayments(props.maker.payments);
      if (props.maker.webPage) setWebPage(props.maker.webPage);
      if (props.maker.startDriveAfterDays) setStartDriveAfterDays(props.maker.startDriveAfterDays);
    }
  }, [props.maker]);

  React.useEffect(() => {
    setReadonly(props.readOnly);
  }, [props.readOnly]);

  React.useEffect(() => {
    if (props.validate) {
      (document as any).getElementById(props.id).reportValidity();
    }
  }, [props.validate]);

  const onChangeUpload = (t: any) => {
    const imageFile = t.files[0];
    if(!imageFile)return;

    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024} KB`);

    const options = {
      maxSizeMB: 100 / 1024,
      maxWidthOrHeight: 1024,
      useWebWorker: true
    }

    imageCompression(imageFile, options)
      .then((compressedFile) => {
        console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        console.log(`compressedFile size ${compressedFile.size / 1024} KB`); // smaller than maxSizeMB

        const newImage = (window as any).URL.createObjectURL(compressedFile);
        //let blob = await fetch(url).then(r => r.blob());
        aChange(() => {
          setImage(newImage);
          return { ...maker, image: newImage } as any;
        });
      })
      .catch(function (error) {
        console.error(error);
        props.history.push('/error');
      });
  };

  /**
   * Changement de l'état de l'étape
   * @param makerProviderFn 
   */
  const aChange = (makerProviderFn: any) => {
    const newMaker = makerProviderFn();
    setMaker(newMaker);
    const check = (document as any).getElementById(props.id).checkValidity() && newMaker.image
      && (newMaker.payments.acceptBankCheck || newMaker.payments.acceptCards
        || newMaker.payments.acceptCoins || newMaker.payments.acceptPaypal);

    if (props.onChange && check !== undefined) props.onChange(newMaker, check)
  };

  const aPaymentChange = (e:any) => aChange(() => {
    const newP = { ...payments, [e.target.name]: e.target.checked };
    setPayments(newP);
    return { ...maker, payments: newP } as any;
  });

  return (
    <form ref={ref} className={`${classes.container} ms-container`} id={props.id} onSubmit={e => e.preventDefault()}>

      <div className="area">
        <div className="image">
          <img src={image} alt="apercu produit" />
        </div>
        {!readonly && (<div className="action">

          <input
            className="input-upload"
            id="upload_product_image"
            type="file"
            name="image"
            accept="image/jpeg"
            onChange={(e: any) => onChangeUpload(e.target)}
          />
          <label htmlFor="upload_product_image">
            <Button color="primary" component="span">
              Changer l'image
        </Button>
          </label>

        </div>)}

        <TextField
          fullWidth
          value={name}
          label="Nom"
          type="text"
          onChange={(e: any) => aChange(() => {
            setName(e.target.value);
            return { ...maker, name: e.target.value } as any;
          })}
          required={!readonly}
          inputProps={{
            readOnly: readonly,
            maxLength:256,
            name:'name'
          }}
        />

      <TextField
          fullWidth
          value={description}
          label="Description courte"
          type="text"
          multiline={true}
          rows={1}
          
          rowsMax={5}
          onChange={(e: any) => aChange(() => {
            setDescription(e.target.value);
            return { ...maker, description: e.target.value } as any;
          })}
          required={!readonly}
          inputProps={{
            readOnly: readonly,
            maxLength:512,
            name:'description'
          }}
        />

<TextField
          fullWidth
          value={startDriveAfterDays}
          label="Retrait au plus tôt avant (jours ouvrables)"
          type="number"          
          onChange={(e: any) => aChange(() => {
            const v = parseInt(e.target.value) >= 5 ? e.target.value : 5;
            setStartDriveAfterDays(v);
            return { ...maker, startDriveAfterDays: v } as any;
          })}
          required={!readonly}
          inputProps={{
            readOnly: readonly,
            maxLength:10,
            max:100,
            min:5,
            name:'startDriveAfterDays'
          }}
        />

        <TextField
          fullWidth
          value={webPage}
          label="Page web existante"
          type="url"
          onChange={(e: any) => aChange(() => {
            setWebPage(e.target.value);
            return { ...maker, webPage: e.target.value } as any;
          })}
          inputProps={{
            readOnly: readonly,
            maxLength:1024,
            name:'webPage'
          }}
        />

      <TextField
          fullWidth
          value={prefixOrderRef}
          label="Préfixe de référence"
          type="text"
          onChange={(e: any) => aChange(() => {
            setPrefixOrderRef(e.target.value);
            return { ...maker, prefixOrderRef: e.target.value } as any;
          })}
          inputProps={{
            readOnly: readonly,
            maxLength:10,
            name:'prefixOrderRef'
          }}
        />

      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Moyens de paiement</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={payments.acceptCards} onChange={aPaymentChange} name="acceptCards" />}
            label="Carte bancaire"
          />
          <FormControlLabel
            control={<Checkbox checked={payments.acceptCoins} onChange={aPaymentChange} name="acceptCoins" />}
            label="Espèces"
          />
          <FormControlLabel
            control={<Checkbox checked={payments.acceptBankCheck} onChange={aPaymentChange} name="acceptBankCheck" />}
            label="Chèques"
          />
          <FormControlLabel
            control={<Checkbox checked={payments.acceptPaypal} onChange={aPaymentChange} name="acceptPaypal" />}
            label="Paypal en ligne"
          />
          
        </FormGroup>
      </FormControl>

      </div>

    </form>
  );
})