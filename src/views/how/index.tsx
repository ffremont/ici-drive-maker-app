import React from 'react';
import './How.scss';
import MenuApp from '../../components/menu-app';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Card from '@material-ui/core/Card';
import conf from '../../confs';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import EuroIcon from '@material-ui/icons/Euro';
import YouTubeIcon from '@material-ui/icons/YouTube';
import ClearIcon from '@material-ui/icons/Clear';
import { Fab } from '@material-ui/core';

class How extends React.Component<{ history: any, match: any }, {}>{


  componentWillUnmount() {
  }

  componentDidMount() {

  }

  render() {

    return (<div className="how">
      <MenuApp mode="light" history={this.props.history} />
<div className="how-content">

  <Link href={conf.youtubeTuto} target="_blank"><Fab variant="extended" className="how-youtube">
          <YouTubeIcon className="help-icon" />
          Tutoriels
        </Fab></Link>
      <Typography variant="h5">Premiers pas</Typography>

      <Stepper orientation="vertical">

        <Step active={true} key="reservation">
          <StepLabel>Je propose mon catalogue en Drive + Livraison (facultatif)</StepLabel>
          <StepContent>
          <Typography variant="body1">
            
          Sur l'application des consommateurs, la réservation est effectuée avec l'option Drive ou livraison en fonction des préférences du consommateur. 
          Votre planning Drive / Livraison est configurable dans le menu latéral de ce site.          
          </Typography>
            
          </StepContent>
        </Step>
        <Step active={true} key="verify">
          <StepLabel>Je vérifie</StepLabel>
          <StepContent>
            <Typography variant="body1">Pour les commandes prévues :</Typography>
            <ul>
              <li>- 5j : j'ai maximum 24h pour vérifier la commande, et elle est automatiquement confirmée</li>
              <li>+ 5j : j'ai jusqu'à 3 jours avant la date du Drive / livraison pour vérifier la commande
                <ul>
                  <li>Pour éviter tous oublis, une confirmation est demandée au client</li>
                </ul>
              </li>
            </ul>
            <Typography variant="body1">Le producteur s'assure d'avoir le stock suffisant pour honorer la réservation. Le cas échéant une note pourra être transmise.</Typography>
          </StepContent>
        </Step>
        <Step active={true} key="retrat">
          <StepLabel>Retrait / livraison</StepLabel>
          <StepContent>
          <Typography variant="body1">Le retrait / livraison se fera à la date choisie lors de la réservation sur le lieu du Drive du producteur ou au domicile du client.
Toutes les informations se trouvent sur votre app dans "mes réservations".</Typography>
          </StepContent>
        </Step>
      </Stepper>

      <Card>
        <CardHeader avatar={
          <Avatar aria-label="euro">
            <EuroIcon/>
          </Avatar>
        } title="Paiement"/>
        <CardContent>
          <Typography variant="body1">
          Les paiements sont du ressort du producteur. Ils se dérouleront soit via PayPal ou sur le lieu du retrait en fonction des préférences du producteur.
          </Typography>
        </CardContent>
        </Card>

        <Card>
        <CardHeader avatar={
          <Avatar aria-label="clear">
            <ClearIcon/>
          </Avatar>
        } title="Annuler"/>
        <CardContent>
          <Typography variant="body1">
          Le producteur et le consommateur peuvent annuler la réservation depuis leur espace respectif.
          </Typography>
        </CardContent>
        </Card>
        </div>
    </div>);
  }
}


export default How;
