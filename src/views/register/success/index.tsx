import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import './RegisterSuccess.scss';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert/Alert';
import MenuApp from '../../../components/menu-app';


export default function RegisterSuccess(props:any) {
  return (
    <div className="register-success">
      <MenuApp mode="register-success" history={props.history} />


      <div className="rs-content">
      <CheckCircleIcon className="check-icon"/>
      <h3>Inscription réussie</h3>
      <Alert severity="info">L'activation sera prochainement réalisée. En attendant, vous pouvez préparer votre catalogue produits.</Alert>
      <Button variant="outlined" className="rs-login" color="secondary" onClick={() => props.history.push('/login')}>
        Se connecter
      </Button>
      </div>
    </div>
  );
}
