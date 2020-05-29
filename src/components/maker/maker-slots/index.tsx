import React, {forwardRef} from 'react';
import TextField from '@material-ui/core/TextField';
import { Maker } from '../../../models/maker';

export default forwardRef(function MakerSlots(props: any, ref:any) {
  const [maker, setMaker] = React.useState<any>({});
  const [readonly, setReadonly] = React.useState(false);

  const [slotsDescription, setSlotsDescription] = React.useState('');

  React.useEffect(() => {
    setMaker(props.maker || {});
    if (props.maker) {
      setSlotsDescription(props.maker.place.slotsDescription || '');
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

  const aChange = (makerProviderFn: any) => {
    const newMaker = makerProviderFn();
    setMaker(newMaker);
    const check = (document as any).getElementById(props.id).checkValidity();
    if (props.onChange && check !== undefined) props.onChange(newMaker, check)
  };

  return (
    <form className="msl-container" ref={ref} id={props.id} onSubmit={e => e.preventDefault()}>
      <TextField
        fullWidth
        value={slotsDescription}
        label="Description des horaires"
        type="text"
        onChange={(e: any) => aChange(() => {
          setSlotsDescription(e.target.value);
          const newM = {...maker};
          newM.place.slotsDescription = e.target.value;
          return newM;
        })}
        required={!readonly}
        inputProps={{
          id:`${props.id}_slotsDescription`,
          readOnly: readonly,
          maxLength:256
        }}
      />
    </form>
  );
})
