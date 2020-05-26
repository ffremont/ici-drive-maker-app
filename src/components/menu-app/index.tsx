import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BugReportIcon from '@material-ui/icons/BugReport';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import IciDriveTypoIcon from '../../assets/images/ici-drive-icon.png';
import IciDriveBannerIcon from '../../assets/images/ici-drive-banner.png';
import './MenuApp.scss';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import RoomIcon from '@material-ui/icons/Room';
import conf from '../../confs';
import authService from '../../services/auth.service';
import StorefrontIcon from '@material-ui/icons/Storefront';
import makerStore from '../../stores/maker';
import { Maker } from '../../models/maker';
import pwaService from '../../services/pwa.service';
import ClearIcon from '@material-ui/icons/Clear';
import { grey } from '@material-ui/core/colors';
import GetAppIcon from '@material-ui/icons/GetApp';
import Button from '@material-ui/core/Button';
import ShareIcon from '@material-ui/icons/Share';
import Mentions from '../mentions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    firstButton: {
      marginRight: theme.spacing(2),
    },
    appBar: {
      color: theme.palette.grey[900],
      background: theme.palette.common.white
    },
    title: {
      flexGrow: 1,
      paddingRight:50,
    },
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
    installBar:{
      color: theme.palette.common.white,
      backgroundColor: grey[500],
      marginBottom: 10,
      padding: '10px 10px'
    },
    getApp:{
      color: theme.palette.common.white,
      borderColor: theme.palette.common.white
    }
  }),
);

const MenuApp = (props: any) => {
  const classes = useStyles();
  const [mode, setMode] = useState('full');
  const [auth] = useState(false);
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [hideInstallBanner, setHideInstallBanner] = useState(true);
  const [openMentions, setOpenMentions] = useState(false);

  React.useEffect(() => {
    setMode(props.mode);
    setHideInstallBanner(props.hideInstallBanner);
  }, [props.mode, props.hideInstallBanner]);

  useEffect(() => {
    const subMaker = makerStore.subscribe((maker:Maker) =>{
      if(maker && maker.email)
        setEmail(maker.email.substr(0, maker.email.indexOf('@')));
    });
    const subInstalled = pwaService.installed.subscribe((installed) => {
      if(installed)
        setShowInstall(false)
    });
    const subCancelled = pwaService.cancelled.subscribe((cancelled) => {
      if(cancelled)
        setShowInstall(false)
    });
    const subBeforeinstallprompt = pwaService.beforeinstallprompt.subscribe((beforeinstallprompt) => {
      if(beforeinstallprompt)
        setShowInstall(true)
    });
    return () => {
      // Nettoyage de l'abonnement
      subMaker.unsubscribe();
      subInstalled.unsubscribe();
      subCancelled.unsubscribe();
      subBeforeinstallprompt.unsubscribe();
    };
  });

  const logout = () => {
    if(window.confirm('Voulez-vous déconnecter votre appareil de votre compte ?')){
      authService.signout();
      window.location.reload();
    }
  }

  const shareDiscover = () => {
    (window as any).navigator.share({
      title: `Drive de produits locaux`,
      text: `Simple, gratuit, ouvert à tous les producteurs, rendez-vous sur https://admin.ici-drive.fr/decouvrir et inscrivez-vous !`,
    }); // partage l'URL de MDN
    
  };
  
  return (
    
    <div className={classes.root}>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List className="drawer-list">
        {email && (<ListItem selected button key="connected">
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary="Connecté" secondary={email} />
          </ListItem>)}
         
          <ListItem button key="catalog" onClick={() => props.history.push('/products')}>
            <ListItemIcon><ImportContactsIcon /></ListItemIcon>
            <ListItemText primary="Catalogue produits" />
          </ListItem>
          <ListItem button key="point" onClick={() => props.history.push('/my-place')}>
            <ListItemIcon><RoomIcon /></ListItemIcon>
            <ListItemText primary="Retrait &amp; livraison" />
          </ListItem>
          <ListItem button key="account" onClick={() => props.history.push('/my-drive')}>
            <ListItemIcon><StorefrontIcon /></ListItemIcon>
            <ListItemText primary="Mon drive" />
          </ListItem>

          <ListItem button key="support" onClick={() => window.open(conf.support)}>
            <ListItemIcon><BugReportIcon /></ListItemIcon>
            <ListItemText primary="Support" secondary="Déclarer un incident" />
          </ListItem>
          <ListItem button key="mentions" onClick={() => setOpenMentions(true)}>
            <ListItemIcon><LibraryBooksIcon /></ListItemIcon>
            <ListItemText primary="Mentions" secondary="CGU, CGR, ..." />
          </ListItem>
          
          {email && (<ListItem button key="logout" onClick={logout}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Se déconnecter" secondary="Dissocier cet appareil" />
          </ListItem>)}
        </List>
      </Drawer>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          {mode === 'full' && (
            <IconButton edge="start" className={classes.firstButton} onClick={() => setOpen(true)} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          )}
          {mode !== 'full' && mode !== 'discover' && (
            <IconButton edge="start" className={classes.firstButton} onClick={() => props.history.goBack()} color="inherit" aria-label="précédent">
              <ArrowBackIosIcon />
            </IconButton>
          )}


          {mode === 'full' && (
            <Typography variant="h6" className={classes.title}>
              <img alt="icon ici drive" className="ici-drive-icon" src={IciDriveBannerIcon} />
            </Typography>
          )}
          {['light'].indexOf(mode) > -1 && (
            <Typography variant="h6" align="center" className={classes.title}>
              <img alt="icon ici drive" className="ici-drive-icon" src={IciDriveTypoIcon} />

            </Typography>
          )}
          {['discover'].indexOf(mode) > -1 && (
            <Typography variant="h6" className={classes.title}>
              <img alt="icon ici drive" className="ici-drive-icon" src={IciDriveBannerIcon} />

            </Typography>
          )}
         
          {['my-orders'].indexOf(mode) > -1 && (
            <Typography variant="h6" align="center" className={classes.title}>
              Mes réservations
            </Typography>
          )}
          {['catalog'].indexOf(mode) > -1 && (
            <Typography variant="h6" align="center" className={classes.title}>
              Catalogue
            </Typography>
          )}
          {['product-edit'].indexOf(mode) > -1 && (
            <Typography variant="h6" align="center" className={classes.title}>
              Editer produit
            </Typography>
          )}
          {['product-new'].indexOf(mode) > -1 && (
            <Typography variant="h6" align="center" className={classes.title}>
              Ajouter produit
            </Typography>
          )}
          
         
          {['discover'].indexOf(mode) > -1 && (
            <IconButton aria-label="se connecter" onClick={() => props.history.push('/login')} color="inherit">
              <AccountCircleIcon />
            </IconButton>
          )}

          {(['discover'].indexOf(mode) > -1 )&&  (window as any).navigator.share && (<IconButton aria-label="partager" onClick={shareDiscover} color="inherit">
            <ShareIcon />
          </IconButton>)}

          {auth && (
            <div>
              <IconButton
                aria-label="Mes réservations"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>


            </div>
          )}
        </Toolbar>
      </AppBar>
      <div className="ghost-appbar"></div>
      { !hideInstallBanner && showInstall && (<div className={`install-bar ${classes.installBar}`}>
        <div className="install-close" onClick={() => pwaService.close()}>
            <ClearIcon/>
        </div>
        <div className="install-content">
          <div className="install-icon">
            <img src={IciDriveTypoIcon} alt="logo" />
          </div>
          <div className="install-title">
            Drive de producteurs locaux
          </div>
        </div>
        <div className="install-actions">
        
        <Button onClick={() => pwaService.install()} variant="outlined" startIcon={<GetAppIcon/>} className={classes.getApp}>Installer</Button>
        </div>
      </div>)}

      <Mentions open={openMentions} onClose={() => setOpenMentions(false)} />
    </div>
  );
}

export default MenuApp;