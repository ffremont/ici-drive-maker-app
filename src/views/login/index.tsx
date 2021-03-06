import React from 'react';
import './Login.scss';
import {
  Redirect
} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import GoogleIcon from '../../assets/images/google.svg';
import MailIcon from '../../assets/images/mail.svg';
import IciDriveIcon from '../../assets/images/ici-drive-icon.png';
import authService from '../../services/auth.service';
import conf from '../../confs';
import { FirebaseStub } from '../../stubs/firebase';

if (process.env.REACT_APP_STAGE !== 'prod') {
  (window as any).firebase = (new FirebaseStub()).init();
}

class Login extends React.Component<{ history: any, location: any }, { loading: boolean, isSignedIn: boolean, from: string }> {
  unregisterAuthObserver: any = null;

  // The component's Local state.
  state = {
    loading: true, // waiting onAuthStateChanged
    isSignedIn: false, // Local signed-in state.
    from: '/'
  };

  private sign(provider: any) {
    (window as any).firebase.auth().signInWithRedirect(provider);
  }

  signEmail() {
    const f = (window as any).firebase;

    if(f){
      const email:any = window.prompt('Merci de saisir votre email ');

      f.auth().sendSignInLinkToEmail(email, {
        url: window.location.origin,
        handleCodeInApp: true,

      })
      .then(function() {
        window.localStorage.setItem('emailForSignIn', email);
        alert('Un message vous a été envoyé');
      })
    }
  }

  signGoogle() {
    const provider: any = process.env.REACT_APP_STAGE === 'prod' ? new (window as any).firebase.auth.GoogleAuthProvider() : new ((window as any).firebase.auth.GoogleAuthProvider());
    provider.addScope('profile');
    provider.addScope('email');
    this.sign(provider);
  }

  componentDidMount() {
    this.registerOnFirebase();

    if (this.props.location) {
      if (this.props.location.state) {
        this.setState({ from: this.props.location.state.fromPathname });
      } else {
        this.setState({ from: '/' });
      }
    }
  }

  private registerOnFirebase() {
    this.unregisterAuthObserver = (window as any).firebase.auth().onAuthStateChanged(
      (user: any) => {
        if (user) {
          (window as any).firebase.auth().currentUser.getIdToken().then((token: string) => authService.setIdToken(token));
          // avec le idToken, self() marchera
          authService.authenticated()
            .then(() => {
              // déclenche la redirection
              this.setState({ loading: false, isSignedIn: !!user })
            }).catch(e => {
              authService.signout();
              this.setState({ from: '/inscription', loading: false, isSignedIn: !!user });
            });


        } else {
          // déclenche la redirection
          this.setState({ loading: false, isSignedIn: !!user })
          // no authenticated, noop show buttons
        }
      }
    );
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    if (this.unregisterAuthObserver) {
      this.unregisterAuthObserver();
    }
  }

  render() {
    if (this.state.loading) {
      return <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      ><CircularProgress className="wait-auth" /></div>;
    } else {
      if (this.state.isSignedIn) {
        return <Redirect
          to={{
            pathname: this.state.from,
            state: { from: '/login' }
          }}
        />;
      } else {
        return <div className="login">
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className="paper">
              <Avatar className="avatar" src={IciDriveIcon} alt="ici drive logo" />
              <Typography component="h1" variant="h5">
                Connexion
          </Typography>
              <Typography variant="body1">
                Plateforme de drive pour vendeurs locaux
          </Typography>

              <Button
                type="button"
                fullWidth
                size="medium"
                color="default"
                onClick={() => this.props.history.push('/inscription')}
                className="signin"
              >
                S'inscrire
            </Button>
              <Button
                type="button"
                fullWidth
                size="large"
                variant="contained"
                color="default"
                onClick={() => this.signGoogle()}
                className="provider google"
              >
                <img alt="google" src={GoogleIcon} /> Connexion par Google
            </Button>
              <Button
                type="button"
                fullWidth
                disabled={false}
                color="primary"
                size="large"
                onClick={() => this.signEmail()}
                variant="contained"
                className="provider email"
              >
                <img alt="mail" src={MailIcon} /> Connexion par email
            </Button>
            </div>
          </Container>

        </div>;
      }
    }



  }
}


export default Login;
