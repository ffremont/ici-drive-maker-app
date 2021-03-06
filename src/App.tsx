import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Login from './views/login';
import PrivateRoute from './components/private-route';
import NoMatch from './views/no-match';
import { Subscription } from 'rxjs';
import httpClientService from './services/http-client.service';
import fcmService from './services/fcm.service';
import * as moment from 'moment';
import 'moment/locale/fr';
import MyOrders from './views/my-orders';
import Order from './views/order';
import Error from './views/error';
import Catalog from './views/catalog';
import Product from './views/product';
import MyPlace from './views/my-place';
import MyDrive from './views/my-drive';
import Discover from './views/discover';
import Register from './views/register';
import RegisterSuccess from './views/register/success';
import EmailCheck from './views/email-check';

import './main.scss';
import 'react-calendar/dist/Calendar.css';
import 'react-google-places-autocomplete/dist/index.min.css';
import How from './views/how';
import MyCalendar from './views/my-calendar';
import MyDelivery from './views/my-delivery';


// @see https://material-ui.com/customization/palette/
//const theme = createMuiTheme({ "palette": { "common": { "black": "#000", "white": "#fff" }, "background": { "paper": "#fff", "default": "#fafafa" }, "primary": { "light": "rgba(48, 49, 49, 0.84)", "main": "rgba(48, 49, 49, 1)", "dark": "rgba(38, 39, 39, 1)", "contrastText": "#fff" }, "secondary": { "light": "rgba(118, 143, 255, 1)", "main": "rgba(41, 98, 255, 1)", "dark": "rgba(0, 57, 203, 1)", "contrastText": "#fff" }, "error": { "light": "#e57373", "main": "#f44336", "dark": "#d32f2f", "contrastText": "#fff" }, "text": { "primary": "rgba(0, 0, 0, 0.87)", "secondary": "rgba(0, 0, 0, 0.54)", "disabled": "rgba(0, 0, 0, 0.38)", "hint": "rgba(0, 0, 0, 0.38)" } } });
const theme = createMuiTheme({"palette":{"common":{"black":"#000","white":"#fff"},"background":{"paper":"#fff","default":"#fafafa"},"primary":{"light":"rgba(74, 74, 74, 0.77)","main":"rgba(74, 74, 74, 1)","dark":"rgba(61, 61, 62, 1)","contrastText":"#fff"},"secondary":{"light":"rgba(255, 102, 0, 0.79)","main":"rgba(255, 102, 0, 1)","dark":"rgba(192, 77, 0, 1)","contrastText":"#fff"},"error":{"light":"#e57373","main":"#f44336","dark":"#d32f2f","contrastText":"#fff"},"text":{"primary":"rgba(0, 0, 0, 0.87)","secondary":"rgba(0, 0, 0, 0.54)","disabled":"rgba(0, 0, 0, 0.38)","hint":"rgba(0, 0, 0, 0.38)"}}});


class App extends React.Component<{}, {  }>{


  componentDidMount() {
    moment.locale('fr');
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>

        <Router>
          <Switch>
            {/*<Route exact path="/" render={(routeProps) => <Makers {...routeProps} />} />*/}

            <Route path="/decouvrir" component={Discover} />         
            <Route path="/inscription" component={Register} />         
            <Route path="/inscription-reussie" component={RegisterSuccess} />    

            <Route path="/register" component={Register} />         
            <Route path="/register-success" component={RegisterSuccess} />         
            <Route path="/discover" component={Discover} />         
            <Route path="/login" component={Login} /> 
            <Route path="/how" component={How} /> 
            <Route path="/email-check" component={EmailCheck} /> 
            

            <PrivateRoute exact path="/" component={MyOrders} /> 
            <PrivateRoute exact path="/my-orders/:id" component={Order} />           
            <PrivateRoute exact path="/products" component={Catalog} />   
            <PrivateRoute exact path="/products/:id" component={Product} />   
            <PrivateRoute exact path="/my-drive" component={MyDrive} />   
            <PrivateRoute exact path="/my-place" component={MyPlace} />   
            <PrivateRoute exact path="/my-delivery" component={MyDelivery} /> 
            <PrivateRoute exact path="/my-calendar" component={MyCalendar} />   

            <Route path="/error" component={Error} />
            <Route path="*" component={NoMatch} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    );
  }
}
export default App;


// @see https://reacttraining.com/react-router/web/guides/primary-components


