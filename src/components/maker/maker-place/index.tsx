import React, { forwardRef } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import imageCompression from 'browser-image-compression';
import { Maker } from '../../../models/maker';
import Button from '@material-ui/core/Button';
import conf from '../../../confs';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

    formControl: {
      width: "100%",
      marginTop: "25px"
    },
    container: {
      marginBottom: "60px"
    }
  }),
);

export default forwardRef(function MakerPlace(props: any, ref: any) {
  const classes = useStyles();

  const [maker, setMaker] = React.useState<Maker | null>(null);
  const [label, setLabel] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [readonly, setReadonly] = React.useState(false);
  const [image, setImage] = React.useState(conf.baseURL + '/default_image.jpg');

  React.useEffect(() => {
    if (process.env.REACT_APP_STAGE === 'prod') {
      const maps = (window as any).google.maps

      var input = document.getElementById(`${props.id}_address`);
      var options = {
        componentRestrictions: { country: 'fr' }
      };

      const autocomplete = new maps.places.Autocomplete(input, options);
      console.log("o");

      autocomplete.addListener('place_changed', () => {
        var place = autocomplete.getPlace();
        console.log(place);

        aChange(() => {
            setAddress(place.formatted_address);
            return { ...maker, address: place.formatted_address } as any;
          })        
      });
    }
  });

  React.useEffect(() => {
    setMaker(props.maker || null);
    if (props.maker) {
      if (props.maker.image) setImage(props.maker.image)
      setLabel(props.maker.place.label);
      if (props.maker.place.address) setAddress(props.maker.place.address)
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
        console.log(error.message);
      });
  };

  const aChange = (makerProviderFn: any) => {
    const newMaker = makerProviderFn();
    setMaker(newMaker);
    const check = (document as any).getElementById(props.id).checkValidity();
    if (props.onChange && check !== undefined) props.onChange(newMaker, check)
  };

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
            required
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
          value={label}
          label="Nom du lieu"
          type="text"
          onChange={(e: any) => aChange(() => {
            setLabel(e.target.value);
            return { ...maker, name: e.target.value } as any;
          })}
          required={!readonly}
          inputProps={{
            readOnly: readonly,
            maxLength: 256,
            name: 'label'
          }}
        />


        <TextField
          fullWidth
          value={address}
          label=""
          type="text"
          multiline={true}
          rows={1}

          rowsMax={5}
          onChange={(e: any) => setAddress(e.target.value)}
          required={!readonly}
          inputProps={{
            readOnly: readonly,
            id: `${props.id}_address`,
            maxLength: 512,
            name: 'address',
            placeholder: 'Adresse complète'
          }}
        />





      </div>

    </form>
  );
})