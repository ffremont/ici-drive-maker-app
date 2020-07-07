import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { autoPlay } from 'react-swipeable-views-utils';
import SwipeableViews from 'react-swipeable-views';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import MobileStepper from '@material-ui/core/MobileStepper';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const tutorialSteps = [
    {
        label: 'Réservation en ligne ici-drive',
        imgPath:
            'https://icidrive.b-cdn.net/extra-assets-adminappicidrivefr/1_app-to-admin.png',
    },
    {
        label: 'Recevez vos notifications sur mobile',
        imgPath:
            'https://icidrive.b-cdn.net/extra-assets-adminappicidrivefr/2-notif.png',
    },
    {
        label: 'Vérifiez vos réservations',
        imgPath:
            'https://icidrive.b-cdn.net/extra-assets-adminappicidrivefr/3-resa.png',
    },
    {
        label: 'Gérez votre catalogue',
        imgPath:
            'https://icidrive.b-cdn.net/extra-assets-adminappicidrivefr/4-catalogue.png',
    },
    {
        label: 'Modifier vos horaires',
        imgPath:
            'https://icidrive.b-cdn.net/extra-assets-adminappicidrivefr/5-horaires.png',
    }
    
];
const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 400,
        flexGrow: 1,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        paddingLeft: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
    img: {
        height: 255,
        display: 'block',
        maxWidth: '100%',
        overflow: 'hidden',
        width: 'auto',
        margin:'auto',
    },
    tutoContent:{
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'
    },
    dialogTitle:{
        paddingBottom:0
    }
}));

const TutoModal = (props: any) => {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = tutorialSteps.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    React.useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    const handleClose = () => {
        setOpen(false);
        props.onClose();
    };

    const handleConfirm = () => {
        setOpen(false);
        props.onIGetIt();
    };

    const handleFirstStep = () => {
        setOpen(false);
        props.onFirstStep();
    };

    return (
        <Dialog maxWidth='sm' fullWidth open={open} onClose={handleClose} aria-labelledby="tuto-modal-dialog-title">
            <DialogTitle id="tuto-modal-dialog-title" className={classes.dialogTitle}>Découvrir ici-drive</DialogTitle>
            <DialogContent className={classes.tutoContent}>

                <div className={classes.root}>
                    <Paper square elevation={0} className={classes.header}>
                        <Typography>{tutorialSteps[activeStep].label}</Typography>
                    </Paper>
                    <AutoPlaySwipeableViews
                            interval={10000}
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                    >
                        {tutorialSteps.map((step, index) => (
                            <div key={step.label}>
                                {Math.abs(activeStep - index) <= 2 ? (
                                    <img className={`${classes.img}`} src={step.imgPath} alt={step.label} />
                                ) : null}
                            </div>
                        ))}
                    </AutoPlaySwipeableViews>
                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        variant="dots"
                        activeStep={activeStep}
                        nextButton={
                            <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                                Suivant
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                            </Button>
                        }
                        backButton={
                            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Précédent
          </Button>
                        }
                    />
                </div>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Fermer
          </Button>
          <Button onClick={handleFirstStep} color="primary">
                    Premiers pas
          </Button>
                <Button onClick={handleConfirm} color="primary">
                    J'ai compris
          </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TutoModal;