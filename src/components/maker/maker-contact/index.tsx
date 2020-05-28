import React, {forwardRef} from 'react';
import TextField from '@material-ui/core/TextField';
import { Maker } from '../../../models/maker';

export default forwardRef(function MakerContact(props: any, ref:any) {
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
    setMaker({...maker, email} as any);
    const check = (document as any).getElementById(props.id).checkValidity();
    if(props.onChange && check !== undefined) props.onChange(maker, check)
  };

  const phoneChange = (phone:string) => {
    setPhone(phone);
    setMaker({...maker, phone} as any);
    const check = (document as any).getElementById(props.id).checkValidity();
    if(props.onChange && check !== undefined) props.onChange(maker, check)
  };

  return (
    <form className="mc-container" ref={ref} id={props.id} onSubmit={e => e.preventDefault()}>
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
        value={phone}
        label="Téléphone"
        onChange={(e:any) => phoneChange(e.target.value)}
        required={!readonly}
        type="tel"
        inputProps={{
          readOnly: readonly,
          maxLength:20
        }}
      />
    </form>
  );
})
