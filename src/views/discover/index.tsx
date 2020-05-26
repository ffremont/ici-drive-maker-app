import React, { useState } from 'react';
import './Discover.scss';
import MenuApp from '../../components/menu-app';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import conf from '../../confs';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import Mentions from '../../components/mentions';
import Link from '@material-ui/core/Link';

function Discover(props: any) {
  const [openMentions, setOpenMentions] = useState(false);

  return (
    <div className="discover">
      <MenuApp mode="discover" history={props.history} hideInstallBanner={true} />

      <Paper className=" my-paper main-paper">
        <img src="https://icidrive.b-cdn.net/admin-ici-drive-fr/ici-drive-full.jpg" className="logo-full" alt="ici-drive.fr" />
        <Typography variant="h4">
          Drive de produits locaux
        </Typography>
        <div>
          <Chip label="Simple" color="secondary" variant="outlined" className="my-chip" />, <Chip label="Gratuit" color="secondary" variant="outlined" className="my-chip" /> et <Chip label="Ouvert à tous" color="secondary" variant="outlined" className="my-chip" />, ici-drive est une app de réservation de produits locaux.
          Depuis mon <Chip label="espace producteur" color="secondary" variant="outlined" className="my-chip" />, je propose facilement mes produits.
          Mon exploitation ou ma boutique se transforme en Drive.
          <Chip label="Sans gestion de stocks" color="secondary" variant="outlined" className="my-chip" />, et <Chip label="sans gestion des paiements" color="secondary" variant="outlined" className="my-chip" />, je gère ma vente.
          </div>

          <Link href={conf.signin} target="_blank">
   
        <Button color="primary" variant="contained" className="inscription">S'inscrire</Button>
        
  </Link>
        <div className="demos">
        <Link href={conf.demoAppIciDriveFr} target="_blank" className="demo">
        <Button color="primary" startIcon={<ShoppingCartIcon />} variant="outlined" >Démo app.ici-drive.fr</Button>
        </Link>
        <Link href={conf.demoAdminIciDriveFr} target="_blank" className="demo">
        <Button color="primary" startIcon={<SupervisorAccountIcon />} variant="outlined">Démo admin.ici-drive.fr</Button>
        </Link>
        </div>
      </Paper>

      <Paper className="my-paper purposes-paper">
        <div className="row">
          <div className="number">
            <Avatar variant="circle" color="primary">1</Avatar>
          </div>
          <div className="text">Créer votre espace producteur, enregistrer vos produits une fois la confirmation reçue</div>
        </div>
        <div className="row">
          <div className="number">
            <Avatar variant="circle" color="primary">2</Avatar>
          </div>
          <div className="text">Pilotez les réservations reçues</div>
        </div>
        <div className="row">
          <div className="number">
            <Avatar variant="circle" color="primary">3</Avatar>
          </div>
          <div className="text">Accueillez vos clients pour réaliser la vente</div>
        </div>
      </Paper>

      <div className="why-area">
        <Typography variant="h5" className="title" align="center">
          Pourquoi ce projet ?
        </Typography>
        <Typography variant="body2" className="text">
          Jeune parent actif, je partage comme beaucoup de personnes le goût de consommer local (qualité, circuit court, vente directe). Dernière l'achat de produits locaux, je souhaite découvrir et consommer près de chez moi.


          Aujourd'hui, il n'existe pas de solution pour acheter local, rapidement et facilement autour de chez nous. En tout cas, pas comme je le souhaite.


          La vente en "Drive" est pour tous les actifs une réelle solution. C'est simple, clair, et déjà appliqué dans la grande distribution, pourquoi pas pour les producteurs ?
  
          Et maintenant, pour que cette initiative citoyenne gratuite prenne vie, j'ai besoin de vous.
        </Typography>
        <Typography variant="body2" className="sign" align="right">Florent FREMONT (initiateur)</Typography>

      </div>

      <Paper className=" my-paper features-paper">
        <Typography variant="h5" className="title" align="center">
          Fonctionnalités
        </Typography>

        <div>
          <strong>Depuis l'app ici-drive :</strong>
          <ul>
            <li>près de chez moi, je découvre les producteurs</li>
            <li>consultation des produits du producteur</li>
            <li>réservation 100% en ligne</li>
            <li>rappel automatique</li>
            <li>choix de l'horaire de retrait chez le producteur</li>
          </ul>
          </div>
        <div>
          <strong>Depuis l'espace producteur :</strong>
          <ul>
            <li>pilotage des réservations</li>
            <li>notifications temps réelles</li>
            <li>gestion du catalogue</li>
          </ul>
        </div>
      </Paper>

      <Mentions open={openMentions} onClose={() => setOpenMentions(false)} />

      <div className="footer">
        <div className="mentions" onClick={() => setOpenMentions(true)}>mentions</div>
      </div>
    </div>
  );
}

export default Discover;
