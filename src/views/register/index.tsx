import React from 'react';
import './Register.scss';
import { Maker } from '../../models/maker';
import Fab from '@material-ui/core/Fab';
import MenuApp from '../../components/menu-app';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import StepLabel from '@material-ui/core/StepLabel';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import MakerContact from '../../components/maker/maker-contact';
import MakerShop from '../../components/maker/maker-shop';
import MakerPlace from '../../components/maker/maker-place';
import MakerSlots from '../../components/maker/maker-slots';
import CheckIcon from '@material-ui/icons/Check';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MakerStore } from '../../stores/maker';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Checkbox, FormControlLabel, Link, Switch } from '@material-ui/core';
import conf from '../../confs';
import MakerDelivery from '../../components/maker/maker-delivery';
import { HebdoSlot } from '../../models/hebdo-slot';
import Cgu from '../../components/cgu';
import YouTubeIcon from '@material-ui/icons/YouTube';

class Register extends React.Component<{ history: any, match: any }, { maker: Maker, waiting: boolean, activeStep: number, steps: any, validation: any, youtube: boolean, makerContactValidator:boolean, makerPlaceValidator:boolean, makerSlotsValidator:boolean, makerDeliveryValidator:boolean, cgu:boolean, wantDelivery:boolean }>{

  state = {
    waiting: false, maker: {
      id: '',
      created: (new Date()).getTime(),
      name: '',
      image: '',
      startDriveAfterDays: conf.defaultStartDriveAfterDays,
      email: '',
      description: '',
      prefixOrderRef: 'REF_',
      place: {
        label: '',
        hebdoSlot: {}
      },
      payments: {
        acceptCoins: false,
        acceptCards: false,
        acceptBankCheck: false,
        acceptPaypal: false
      },
      categories: []
    }, cgu:false, wantDelivery:false, makerPlaceValidator:false, makerSlotsValidator:false, makerDeliveryValidator:false, youtube: false, makerContactValidator:false, activeStep: 0, steps: ['Compte', 'Activité', 'Drive', 'Livraison'], validation: { recaptcha: null, disableNext: true, showErrors: false }
  };

  makerContactRef: any;
  makerShopRef: any;
  makerPlaceRef: any;
  makerSlotsRef: any;
  makerDeliveryRef: any;

  currentMaker: any = null;

  componentWillUnmount() {

  }

  componentDidMount() {
    this.makerContactRef = React.createRef();
    this.makerShopRef = React.createRef();
    this.makerPlaceRef = React.createRef();
    this.makerSlotsRef = React.createRef();
    this.makerDeliveryRef = React.createRef();
    this.currentMaker = { ...this.state.maker };
    this.setState({ youtube: false });
  }

  checkStep(newIndexStep: number, cActiveStep: number) {
    const orderRefs = [this.makerContactRef, this.makerShopRef, this.makerPlaceRef, this.makerDeliveryRef];

    const isValid = orderRefs[newIndexStep] && orderRefs[newIndexStep].current ? orderRefs[newIndexStep].current.checkValidity() : false;

    this.setState({ validation: { ...this.state.validation, disableNext: newIndexStep < cActiveStep ? false : !isValid } })

  }

  submit() {
    this.setState({ waiting: true });
    const newMaker:Maker = {...this.state.maker};
    if(!this.state.wantDelivery){
      delete newMaker.delivery;
      delete newMaker.deliveryAvailableFrom;
      delete newMaker.deliveryCost;
      delete newMaker.deliveryDescription;
      delete newMaker.deliveryRadius;
    }
    MakerStore.register(newMaker, this.state.validation.recaptcha)
      .then(() => {
        this.props.history.push('/inscription-reussie');
      }).catch((e: any) => {
        console.error(e);
        this.props.history.push('/error');
      });
  }

  next(newIndexStep: number) {
    window.scrollTo(0, 0);
    const cActiveStep = 0 + this.state.activeStep;
    this.setState({ maker: this.currentMaker, activeStep: newIndexStep });
    this.checkStep(newIndexStep, cActiveStep);
  }

  back(newIndexStep: number) {
    window.scrollTo(0, 0);
    const cActiveStep = 0 + this.state.activeStep;
    this.setState({ maker: this.currentMaker, activeStep: newIndexStep });
    this.checkStep(newIndexStep, cActiveStep);
  }

  onStepChange(newMaker: Maker, isValid: boolean, recaptcha: any = null) {
    this.currentMaker = newMaker;
    this.setState({ maker: newMaker, validation: { ...this.state.validation, disableNext: !isValid, recaptcha } });
  }

  render() {

    return (<div className="register">
      <MenuApp mode="register" hideInstallBanner={true} history={this.props.history} />

      <Stepper alternativeLabel activeStep={this.state.activeStep}>
        {this.state.steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="register-content">
        {this.state.activeStep === 0 && (
          <Alert icon={false} severity="info">
            <AlertTitle>Mon inscription producteur ici-drive</AlertTitle>
Vous êtes producteur et souhaitez développer votre activité <strong>Drive</strong> +/- <strong>livraison</strong> à domicile, adaptée à vos besoins (activité ponctuelle ou permanente).
            <br />Vous êtes au bon endroit !

            <br /><br /><strong>Bienvenue chez ici-drive, plateforme citoyenne entièrement gratuite. </strong>
            <br />Ici-drive vous permet de vendre vos produits :

            <ul>
              <li>autrement</li>
              <li>directement à vos consommateurs</li>
              <li>localement</li>
              <li>sans intérmédiaire</li>
              <li>sans engagement</li>
              <li>par le biais du Drive et des livraisons</li>
            </ul>

            <br /> <a href="https://ici-drive.fr" target="_blank">Pour en savoir plus</a>
          </Alert>
        )}

        {this.state.activeStep === 0 && (
          <Alert severity="info"> Inscription quelques minutes
          </Alert>
        )}


        {this.state.activeStep === 0 && (<FormControlLabel className="lookyoutube"
          control={
            <Checkbox
              checked={this.state.youtube}
              onChange={(e) => { 
                this.setState({ youtube: e.target.checked });
                this.setState({ validation: { ...this.state.validation, disableNext: !e.target.checked || !this.state.makerContactValidator } });
              }}
              name="youtube"
              color="primary"
            />
          }
          label="J'ai pris connaissance des vidéos explicatives Youtube*"
        />)}
        {this.state.activeStep === 0 && (
          <Alert className="tutoriel-area" icon={<YouTubeIcon fontSize="inherit" />} severity="info"> Consulter les vidéos explicatives <Link target="_blank" href={conf.youtubeTuto}>
            (consulter la chaîne youtube ici-drive)
 </Link>
          </Alert>
        )}
        {this.state.activeStep === 0 && (
          <MakerContact ref={this.makerContactRef} id="maker-contact" history={this.props.history} validate={this.state.validation.showErrors} maker={this.state.maker} onChange={(m: Maker, v: boolean) => {
            this.setState({makerContactValidator : v});

            console.log(m);
            this.onStepChange(m, v && this.state.youtube);

          }} />
        )}

        {this.state.activeStep === 1 && (
          <MakerShop ref={this.makerShopRef} id="maker-shop" history={this.props.history} validate={this.state.validation.showErrors} maker={this.state.maker} onChange={(m: Maker, v: boolean) => this.onStepChange(m, v)} />
        )}
        {this.state.activeStep === 1 && (
          <Link href={conf.youtubeStepActivity} target="_blank"><Fab variant="extended" className="help-youtube">
          <YouTubeIcon className="help-icon" />
          Tutoriel
        </Fab></Link>
        )}

        {this.state.activeStep === 2 && (
          <MakerPlace ref={this.makerPlaceRef} id="maker-place" history={this.props.history} validate={this.state.validation.showErrors} maker={this.state.maker} onChange={(m: Maker, v: boolean) => {
            this.setState({makerPlaceValidator: v});
            this.onStepChange(m, v && this.state.makerSlotsValidator);
          }} />
        )}
        {this.state.activeStep === 2 && (
          <MakerSlots ref={this.makerSlotsRef} id="maker-slots" history={this.props.history} validate={this.state.validation.showErrors} slots={this.state.maker.place.hebdoSlot} onChange={(hs: HebdoSlot, v: boolean, re: any) => {
            this.setState({makerSlotsValidator:v});
            const newMaker = {...this.state.maker};
            newMaker.place.hebdoSlot = hs;
            this.onStepChange(newMaker, v && this.state.makerPlaceValidator, re)
          }} />
        )}
        {this.state.activeStep === 2 && (
          <Link href={conf.youtubeStepDrive} target="_blank"><Fab variant="extended" className="help-youtube">
          <YouTubeIcon className="help-icon" />
          Tutoriel
        </Fab></Link>
        )}

{this.state.activeStep === 3 && (<FormControlLabel className="want-delivery"
        control={
          <Switch
            checked={this.state.wantDelivery}
            onChange={(e) => {
              this.setState({wantDelivery: e.target.checked})
              this.onStepChange(this.state.maker, 
                (!e.target.checked || this.state.makerDeliveryValidator) && this.state.cgu, null);
            }}
            name="wantDelivery"
            color="primary"
          />
        }
        label="Je propose des livraisons en plus du Drive"
      />)}
        {this.state.activeStep === 3 && this.state.wantDelivery && (
          <MakerDelivery validateSlots={true} readonly={!this.state.wantDelivery} ref={this.makerSlotsRef} id="maker-delivery" history={this.props.history} validate={this.state.validation.showErrors} maker={this.state.maker} onChange={(m: Maker, v: boolean, re: any) => {
            this.onStepChange(m, (!this.state.wantDelivery || v) && this.state.cgu, re);
            this.setState({makerDeliveryValidator: v});
          }} />
         
        )}
        {this.state.activeStep === 3 && (
          <Cgu  cgu={this.state.cgu} onChange={(cgu:boolean) => {
            this.setState({ cgu });
            this.onStepChange(this.state.maker, cgu && (this.state.makerDeliveryValidator || !this.state.wantDelivery) );

          }}></Cgu>
        )}
        {this.state.activeStep === 2 && (
          <Link href={conf.youtubeStepDelivery} target="_blank"><Fab variant="extended" className="help-youtube">
          <YouTubeIcon className="help-icon" />
          Tutoriel
        </Fab></Link>
        )}

      </div>
      <div className="register-footer">
        {this.state.activeStep !== (this.state.steps.length - 1) && (<Fab color="secondary" aria-label="next" disabled={this.state.validation.disableNext} onClick={() => this.next(this.state.activeStep + 1)} className="next-action">
          <ArrowForwardIosIcon />
        </Fab>)}
        {this.state.activeStep === (this.state.steps.length - 1) && (<Fab onClick={() => this.submit()} disabled={this.state.validation.disableNext} className="check-action" color="secondary" aria-label="back">
          <CheckIcon />
        </Fab>)}
        {this.state.activeStep > 0 && (<Fab onClick={() => this.back(this.state.activeStep - 1)} className="back-action" color="primary" aria-label="back">
          <ArrowBackIosIcon />
        </Fab>)}

      </div>

      {this.state.waiting && (<Backdrop className="backdrop" open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>)}


    </div>);

  }
}


export default Register;
