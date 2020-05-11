import React from 'react';
import './Catalog.scss';
import MenuApp from '../../components/menu-app';
import { Subscription } from 'rxjs';
import makerStore from '../../stores/maker';
import { Product } from '../../models/product';
import { withStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import AddIcon from '@material-ui/icons/Add';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckIcon from '@material-ui/icons/Check';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import ClearIcon from '@material-ui/icons/Clear';
import { Item } from '../../models/item';
import conf from '../../confs';
import { grey, green,common } from '@material-ui/core/colors';
import Paper from '@material-ui/core/Paper';
import { Maker } from '../../models/maker';
import { Order } from '../../models/order';


interface GraphicProduct extends Product {
  category?: Item
}

const useStyles = (theme: Theme) => ({
  grey:{
    color: theme.palette.getContrastText(grey[500]),
    backgroundColor: grey[500],
  },
  green:{
    color: common.white,
    backgroundColor: green[500],
  }
});

class Catalog extends React.Component<{ history: any, match: any, classes:any }, { products: GraphicProduct[], openPreview: string, maker: Maker | null, activeIndex: number, wantToAdd: Product | null, openCleanCart: boolean, cart: Order | null }>{

  state = { products: [], openCleanCart: false, activeIndex: -1, maker: null, openPreview: '', cart: null, wantToAdd: null };
  subMaker: Subscription | null = null;

  componentWillUnmount() {
    this.subMaker?.unsubscribe();
  }

  componentDidMount() {
    this.subMaker = makerStore.subscribe((maker: Maker) => {
      if(maker){
        const products = (maker.products || []).map((p: GraphicProduct) => {
          p.category = conf.categories.find(c => c.id === p.categoryId);
          return p;
        });

        this.setState({
          maker, products
        })
      }
    })
  }

  render() {
    return (
      <div className="maker">
        <MenuApp mode="catalog" history={this.props.history} />

        <Fab size="large" onClick={() => this.props.history.push(`/products/0000`)} color="primary" className="add-product"  aria-label="add product">
          <AddIcon />
        </Fab>

        <Modal
          open={!!this.state.openPreview}
          onClose={() => this.setState({ openPreview: '' })}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <Paper className="preview-paper" onClick={() => this.setState({ openPreview: '' })}>
            <img src={this.state.openPreview} alt="preview" />
          </Paper>
        </Modal>

        <Grid className="products-grid" container alignContent="center" alignItems="center" justify="center" spacing={0}>
          {this.state.products.map((p: GraphicProduct, i: number) => (
            <Grid item key={i}>
              <Card className="product-card" >
                {p.available && (<CardHeader
                  title={p.label}
                  subheader={p.category?.label}
                  avatar={
                    <Avatar aria-label="recipe" className={this.props.classes.green}><CheckIcon/></Avatar>
                  }
                />)}{!p.available && (<CardHeader
                  title={p.label}
                  subheader={p.category?.label}
                  avatar={
                    <Avatar aria-label="recipe" className={this.props.classes.grey}><ClearIcon/></Avatar>
                  }
                />)}
                <CardMedia onClick={() => this.setState({ openPreview: p.image })}
                  component="img"
                  alt="product"
                  height="140"
                  className="maker-media"
                  image={p.image}
                  title={p.label}
                />
                <CardContent className="content-price">
                <Fab size="large" onClick={() => this.props.history.push(`/products/${p.ref}`)} color="secondary" className="look-product"  aria-label="edit product">
                    <SearchIcon />
                  </Fab>
                </CardContent>
                <CardActions disableSpacing className="cardaction-product">
                <Typography className="typo-price" variant="h5" color="textSecondary">
                    <div className="price">
                      {parseFloat(`${p.price}`).toFixed(2)}<sup>€</sup>
                    </div>
                    
                  </Typography>
                  <IconButton
                    className={(this.state.activeIndex === i ? 'expandOpen' : 'expanded')}
                    onClick={() => this.state.activeIndex === i ? this.setState({ activeIndex: -1 }) : this.setState({ activeIndex: i })}
                    aria-expanded={this.state.activeIndex === i}
                    aria-label="voir plus"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>
                <Collapse in={this.state.activeIndex === i} timeout="auto" unmountOnExit>
                  <CardContent>
                    {p.volume && (<Typography className="my-p" paragraph>Volume: {parseFloat(`${p.volume}`).toFixed(2)}L</Typography>)}
                    {p.weight && (<Typography className="my-p" paragraph>Poids: {p.weight > 1000 ? parseFloat(`${p.weight / 1000}`).toFixed(1) + 'k' : parseFloat(`${p.weight}`).toFixed(0)}g</Typography>)}

                    {p.description && (<Typography className="my-p" paragraph>
                      {p.description}
                    </Typography>)}

                  </CardContent>
                </Collapse>
              </Card>
            </Grid>

          ))}


        </Grid>
      </div>
    );
  }
}

export default withStyles(useStyles)(Catalog);

