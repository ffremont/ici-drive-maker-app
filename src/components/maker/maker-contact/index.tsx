import React, {forwardRef} from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({

    formControl: {
      marginTop: "25px"
    },
    container: {}
  }),
);

export default forwardRef(function MakerContact(props: any, ref:any) {
  const classes = useStyles();
  const [maker, setMaker] = React.useState<any>({});
  const [readonly, setReadonly] = React.useState(false);

  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');

  React.useEffect(() => {
    setMaker(props.maker || {});
    if (props.maker) {
      setEmail(props.maker.email || '');
      setPhone(props.maker.phone || '');
    }
  }, [props.maker]);

  React.useEffect(() => {
    setReadonly(props.readOnly);
  }, [props.readOnly]);

  React.useEffect(() => {
    if(props.validate){
      (document as any).getElementById(props.id).reportValidity();
    }
  }, [props.validate]);

  const emailChange = (email:string) => {
    setEmail(email);
    const newMaker = {...maker, email} as any;
    setMaker(newMaker);
    const check = (document as any).getElementById(props.id).checkValidity();
    if(props.onChange && check !== undefined) props.onChange(newMaker, check)
  };

  const phoneChange = (phone:string) => {
    setPhone(phone);
    var n = {...maker, phone} as any;
    setMaker(n);
    const check = (document as any).getElementById(props.id).checkValidity();
    if(props.onChange && check !== undefined) props.onChange(n, check)
  };

  return (
    <form  className={`${classes.container} mc-container`} ref={ref} id={props.id} onSubmit={e => e.preventDefault()}>
      <TextField
        fullWidth
        value={email}
        label="Email"
        type="email"
        onChange={(e:any) => emailChange(e.target.value)}
        required={!readonly}
        inputProps={{
          id:`${props.id}_email`,
          readOnly: readonly,
          maxLength:256
        }}
      />
      <TextField
        fullWidth
        className={classes.formControl}
        value={phone}
        label="Téléphone"
        helperText="ex: 0601010101"
        onChange={(e:any) => phoneChange(e.target.value)}
        required={!readonly}
        type="text"
        inputProps={{
          readOnly: readonly,
          pattern:"[0-9]{10}",
          maxLength:10
        }}
      />
    </form>
  );
})
