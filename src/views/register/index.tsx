import React, { RefObject } from 'react';
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

class Register extends React.Component<{ history: any, match: any }, { maker: Maker, activeStep: number, steps: any, validation:any }>{

  state = { maker: {
    id:'', 
    created:(new Date()).getTime(),
    name: '',
    image: '',
    email: '',
    description: '',
    prefixOrderRef: 'REF_',
    place: {
      label: '',
      hebdoSlot: {}
    },
    categories:[]
   }, activeStep: 1, steps: ['Contact', 'Commerce', 'Retrait',  'Horaires'], validation:{disableNext:true, showErrors:false} };

  makerContactRef:any;
  makerShopRef:any;

  currentMaker :any = null;

  componentWillUnmount() {
    
  }

  componentDidMount() {
    this.makerContactRef = React.createRef();
    this.makerShopRef = React.createRef();
    this.currentMaker = {...this.state.maker};
  }

  checkStep(newIndexStep:number){
    if(newIndexStep === 0){
      const isValid = this.makerContactRef.current ? this.makerContactRef.current.checkValidity(): false;
      this.setState({validation : {...this.state.validation, disableNext: !isValid, showErrors: !isValid}})
    }else if(newIndexStep === 1){
      const isValid = this.makerShopRef.current ? this.makerShopRef.current.checkValidity(): false;
      this.setState({validation : {...this.state.validation, disableNext: !isValid, showErrors: !isValid}})
    }else{
      this.setState({validation:{...this.state.validation, showErrors:false}});
    }
  }

  next(newIndexStep:number) {
    window.scrollTo(0,0);
    this.setState({ maker: this.currentMaker, activeStep: newIndexStep });
    this.checkStep(newIndexStep);
  }

  back(newIndexStep:number){
    window.scrollTo(0,0);
    this.setState({maker: this.currentMaker, activeStep: newIndexStep});
    this.checkStep(newIndexStep);
  }

  onMakerContactChange(newMaker:Maker, isValid:boolean){
    console.log('onMakerContactChange', newMaker, isValid);
    this.currentMaker = newMaker;
    this.setState({validation : {...this.state.validation, disableNext: !isValid}});
  }

  onMakerShopChange(newMaker:Maker, isValid:boolean){
    console.log('onMakerShopChange', newMaker, isValid);
    this.currentMaker = newMaker;
    this.setState({validation : {...this.state.validation, disableNext: !isValid}});
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
          <MakerContact ref={this.makerContactRef} id="maker-contact" validate={this.state.validation.showErrors} maker={this.state.maker} onChange={(m:Maker,v:boolean) => this.onMakerContactChange(m,v)} />
        )}

        {this.state.activeStep === 1 && (
          <MakerShop ref={this.makerShopRef} id="maker-shop" validate={this.state.validation.showErrors} maker={this.state.maker} onChange={(m:Maker,v:boolean) => this.onMakerShopChange(m,v)} />
        )}

      </div>
      <div className="register-footer">
        <Fab color="secondary" aria-label="next" disabled={this.state.validation.disableNext} onClick={() => this.next(this.state.activeStep+1)} className="next-action">
          <ArrowForwardIosIcon />
        </Fab>
        {this.state.activeStep > 0 && (<Fab onClick={() => this.back(this.state.activeStep-1)} className="back-action" color="primary" aria-label="back">
          <ArrowBackIosIcon />
        </Fab>)}
      </div>



    </div>);

  }
}


export default Register;
