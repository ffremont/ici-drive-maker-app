import React from 'react';
import './Error.scss';
import MenuApp from '../../components/menu-app';
import BugReportIcon from '@material-ui/icons/BugReport';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import conf from '../../confs';
import Link from '@material-ui/core/Link';

function Error(props: any) {
  return (
    <div className="error">
      <MenuApp mode="light" history={props.history} />

      <div className="area">
        <BugReportIcon />
        <Typography variant="h4">Une erreur est survenue</Typography>
        
        <Link href={conf.support} target="_blank">
        <Button color="secondary">Déposer un ticket</Button>
        </Link>
      </div>
    </div>
  );
}

export default Error;
