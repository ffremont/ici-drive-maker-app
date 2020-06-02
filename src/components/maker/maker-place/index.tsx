import React, { forwardRef } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import imageCompression from 'browser-image-compression';
import { Maker } from '../../../models/maker';
import Button from '@material-ui/core/Button';
import conf from '../../../confs';
import TextField from '@material-ui/core/TextField';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { Place } from '../../../models/place';

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
  const [description, setDescription] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [readonly, setReadonly] = React.useState(false);
  const [image, setImage] = React.useState(conf.baseURL + '/default_image.jpg');
  let autocomplete: any = null;

  /*  var input = document.getElementById(`${props.id}_address`);
    if(!input)return;
    const maps = (window as any).google.maps
    var options = {
      componentRestrictions: { country: 'fr' }
    };
    
    if(autocomplete){
      autocomplete.unbindAll();
      maps.event.clearInstanceListeners(input );
    }
    autocomplete = new maps.places.Autocomplete(input, options);

    autocomplete.addListener('place_changed', () => {
      var place = autocomplete.getPlace();
      console.log(place);

      aChange(() => {
        setAddress(place.formatted_address);
        return { ...maker?.place, address: place.formatted_address } as any;
      })
    });*/

  React.useEffect(() => {
    let fnChange: any = null;

    if (process.env.REACT_APP_STAGE !== 'prod') {
      fnChange = (e: any) => {
        aChange(() => {
          setAddress(e.target.value);
          return { ...maker?.place, address: e.target.value } as any;
        })
      };
      (document as any).getElementById(`${props.id}_address`).addEventListener('change', fnChange);
    }

    return () => {
      if (fnChange) (document as any).getElementById(`${props.id}_address`).removeEventListener('change', fnChange);
    }
  });

  React.useEffect(() => {
    setMaker(props.maker || null);
    if (props.maker) {
      if (props.maker.place.image) setImage(props.maker.place.image)
      setLabel(props.maker.place.label);
      if (props.maker.place.address) setAddress(props.maker.place.address)
      if (props.maker.place.description) setDescription(props.maker.place.description)
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
    if (!imageFile) return;

    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024} KB`);

    const options = {
      maxSizeMB: 150 / 1024,
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
          return { ...(maker as any).place, image: newImage };
        });
      })
      .catch(function (error) {
        console.error(error);
        props.history.push('/error');
      });
  };

  const onSelectAddress = (newAddress: string) => {
    geocodeByAddress(newAddress)
      .then(results => getLatLng(results[0]))
      .then( ({ lat, lng }) =>{

        aChange(() => {
          setAddress(newAddress.replace(', France', ''));
          return { ...maker?.place, address: newAddress, point: {latitude:lat, longitude:lng}} as any;
        });
      
      });
  }

  const aChange = (makerProviderFn: any) => {
    const place: Place = makerProviderFn();
    const newMaker: any = { ...maker, place: place };
    setMaker(newMaker);
    const check = newMaker.place.image && (document as any).getElementById(props.id).checkValidity();
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
            return { ...maker?.place, label: e.target.value } as any;
          })}
          required={!readonly}
          inputProps={{
            readOnly: readonly,
            maxLength: 256,
            name: 'label'
          }}
        />


        {process.env.REACT_APP_STAGE !== 'prod' && (<TextField
          fullWidth
          value={address}
          label="Adresse complète"
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
            placeholder: ''
          }}
        />)}
        {process.env.REACT_APP_STAGE === 'prod' && (
          <GooglePlacesAutocomplete
            placeholder='Adresse complète'
            autocompletionRequest={{
              componentRestrictions: {
                country: ['fr'],
              }
            }}
            onSelect={(place: any) => onSelectAddress(place.description)}
          />
        )}

        <TextField
          fullWidth
          value={description}
          label="Description du lieu"
          type="text"
          onChange={(e: any) => aChange(() => {
            setDescription(e.target.value);
            console.log('place', maker?.place);
            return { ...maker?.place, description: e.target.value } as any;
          })}
          multiline={true}
          rows={1}
          rowsMax={3}
          required={!readonly}
          inputProps={{
            readOnly: readonly,
            maxLength: 256,
            name: 'description'
          }}
        />





      </div>

    </form>
  );
})