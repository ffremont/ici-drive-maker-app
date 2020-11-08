
import React from 'react';
import conf from '../../confs';
import './Cgu.scss';
import { Checkbox, Typography } from '@material-ui/core';

const Cgu = (props: any) => {
    const [cgu, setCgu] = React.useState(false);

  React.useEffect(() => {
      setCgu(props.cgu);
    }, [props.cgu])


  return (
    <form className="cgu mc-container">
    <Checkbox
      checked={cgu}
      required
      onChange={(e) =>{
        setCgu(e.target.checked);
        props.onChange(e.target.checked);
      }}
      inputProps={{ 'aria-label': 'primary checkbox' }}
    /> <Typography variant="body1" className="accept-cgu">Accepter les <a href={conf.cgu} rel="noopener noreferrer" target="_blank">Conditions Générales d'utilisation</a></Typography>
  </form>
  );
}

export default Cgu;