import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import './Confirm.scss';
import { ProductChoice } from '../../../models/order';


export default function Confirm(props:any) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const [productsChecked, setProductsChecked] = React.useState([]);
  const [confirmChoices, setConfirmChoices] = React.useState([]);

  React.useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  React.useEffect(() => {
    setConfirmChoices(props.confirmChoices);
    if(props.confirmChoices)
      setProductsChecked(props.confirmChoices.map((c:ProductChoice) => c.product.ref));
    
  }, [props.confirmChoices]);

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  const handleConfirm = () => {
    setOpen(false);
    props.onConfirm(text, productsChecked);
  };
  const handleChangeConfirmChoices = (e:any) => {
    setProductsChecked(e.target.value);

    if(props.onChange){
      props.onChange(text, e.target.value);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.message}
          </DialogContentText>

          {props.children}
          

          {confirmChoices && confirmChoices.length && (<FormControl fullWidth>
        <InputLabel id="confirmChoices-mutiple-name-label">Vérifier les produits présents</InputLabel>
            <Select
            labelId="confirmChoices-mutiple-checkbox-label"
            id="confirmChoices-mutiple-checkbox"
            className="confirmChoices"
            autoWidth={true}
            multiple
            value={productsChecked}
            onChange={handleChangeConfirmChoices}
            input={<Input />}
            renderValue={(selected : any) => 
              (confirmChoices as any).filter((c:any) => selected.indexOf(c.product.ref) > -1 ).map((c:any) => c.product.label).join(', ')}
          >
            {confirmChoices.map((choice:any) => (
              <MenuItem key={choice.product.ref} value={choice.product.ref}>
                <Checkbox checked={(productsChecked as string[]).indexOf(choice.product.ref) > -1} /> 
                <ListItemText primary={choice.product.label} />
              </MenuItem>
            ))}
          </Select></FormControl>
          )}
          {props.withText && <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
            margin="dense"
            id="remarque"
            label="Remarque"
            type="text"
            inputProps={{ maxLength: 100 }}
            fullWidth
          />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirm} color="primary">
            {props.okText || "Valider"}
          </Button>
        </DialogActions>
      </Dialog>
  );
}
