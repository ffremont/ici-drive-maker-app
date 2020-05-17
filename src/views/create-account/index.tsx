import React from 'react';
import './CreateAccount.scss';
import Typography from '@material-ui/core/Typography';
import IciDriveIcon from '../../assets/images/ici-drive-icon.png';
import Avatar from '@material-ui/core/Avatar';
import conf from '../../confs';
import Button from '@material-ui/core/Button';

class CreateAccount extends React.Component<{history:any,location:any}, {}> { 
  render(){
    return (
      <div className="create-account">
        <div className="paper">
              <Avatar className="avatar" src={IciDriveIcon} alt="ici drive logo"/>
              <Typography component="h1" variant="h5">
                Inscription
          </Typography>

          <Typography variant="body1" className="description">
            La procédure se déroule via un formulaire en ligne. Une fois votre demande d'inscription faite, elle sera vérifiée.
          </Typography>

          <Button
                type="button"
                fullWidth
                size="medium"
                color="primary"
                onClick={() => window.location.href=conf.signin}
                className="provider google"
              >
                Accèder au formulaire
            </Button>
        </div>
      </div>
    );
  }
}

export default CreateAccount;
