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

class Register extends React.Component<{ history: any, match: any }, { maker: Maker, waiting:boolean, activeStep: number, steps: any, validation:any }>{

  state = { waiting:false, maker: {
    id:'', 
    created:(new Date()).getTime(),
    name: '',
    image: '',
    startDriveAfterDays:5,
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
    categories:[]
   }, activeStep: 0, steps: ['Contact', 'Commerce', 'Retrait',  'Horaires'], validation:{recaptcha:null, disableNext:true, showErrors:false} };

  makerContactRef:any;
  makerShopRef:any;
  makerPlaceRef:any;
  makerSlotsRef:any;

  currentMaker :any = null;

  componentWillUnmount() {
    
  }

  componentDidMount() {
    this.makerContactRef = React.createRef();
    this.makerShopRef = React.createRef();
    this.makerPlaceRef = React.createRef();
    this.makerSlotsRef = React.createRef();
    this.currentMaker = {...this.state.maker};
  }

  checkStep(newIndexStep:number, cActiveStep: number){
    const orderRefs = [this.makerContactRef, this.makerShopRef, this.makerPlaceRef, this.makerSlotsRef];

    const isValid = orderRefs[newIndexStep] && orderRefs[newIndexStep].current ? orderRefs[newIndexStep].current.checkValidity(): false;
    
    this.setState({validation : {...this.state.validation, disableNext: newIndexStep < cActiveStep ? false : !isValid}})
    
  }

  submit() {
    this.setState({waiting:true});
    MakerStore.register(this.state.maker, this.state.validation.recaptcha)
      .then(() => {
        this.props.history.push('/inscription-reussie');
      }).catch((e:any) => {
        console.error(e);
        this.props.history.push('/error');
      });
  }

  next(newIndexStep:number) {
    window.scrollTo(0,0);
    const cActiveStep = 0+this.state.activeStep;
    this.setState({ maker: this.currentMaker, activeStep: newIndexStep });
    this.checkStep(newIndexStep, cActiveStep);
  }

  back(newIndexStep:number){
    window.scrollTo(0,0);
    const cActiveStep = 0+this.state.activeStep;
    this.setState({maker: this.currentMaker, activeStep: newIndexStep});
    this.checkStep(newIndexStep, cActiveStep);
  }

  onStepChange(newMaker:Maker, isValid:boolean, recaptcha:any = null){
    console.log('step change', newMaker, isValid, recaptcha);
    this.currentMaker = newMaker;
    this.setState({validation : {...this.state.validation, disableNext: !isValid, recaptcha}});
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
          <MakerContact ref={this.makerContactRef} id="maker-contact" history={this.props.history} validate={this.state.validation.showErrors} maker={this.state.maker} onChange={(m:Maker,v:boolean) => this.onStepChange(m,v)} />
        )}

        {this.state.activeStep === 1 && (
          <MakerShop ref={this.makerShopRef} id="maker-shop" history={this.props.history} validate={this.state.validation.showErrors} maker={this.state.maker} onChange={(m:Maker,v:boolean) => this.onStepChange(m,v)} />
        )}

        {this.state.activeStep === 2 && (
          <MakerPlace ref={this.makerPlaceRef} id="maker-place" history={this.props.history} validate={this.state.validation.showErrors} maker={this.state.maker} onChange={(m:Maker,v:boolean) => this.onStepChange(m,v)} />
        )}

        {this.state.activeStep === 3 && (
          <MakerSlots standalone={false} ref={this.makerSlotsRef} id="maker-slots" history={this.props.history} validate={this.state.validation.showErrors} maker={this.state.maker} onChange={(m:Maker,v:boolean, re:any) => this.onStepChange(m,v, re)} />
        )}

      </div>
      <div className="register-footer">
        { this.state.activeStep !== (this.state.steps.length -1) && (<Fab color="secondary" aria-label="next" disabled={this.state.validation.disableNext} onClick={() => this.next(this.state.activeStep+1)} className="next-action">
          <ArrowForwardIosIcon />
        </Fab>)}
        {this.state.activeStep === (this.state.steps.length -1) && (<Fab onClick={() => this.submit()} disabled={this.state.validation.disableNext} className="check-action" color="secondary" aria-label="back">
          <CheckIcon />
        </Fab>)}
        {this.state.activeStep > 0  && (<Fab onClick={() => this.back(this.state.activeStep-1)} className="back-action" color="primary" aria-label="back">
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
