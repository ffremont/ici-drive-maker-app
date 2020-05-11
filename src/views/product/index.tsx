import React from 'react';
import { Subscription } from 'rxjs';
import makerStore, { MakerStore } from '../../stores/maker';
import { Maker } from '../../models/maker';
import * as P from '../../models/product';
import MenuApp from '../../components/menu-app';
import Button from '@material-ui/core/Button';
import conf from '../../confs';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import './Product.scss';

// @see formik https://stackworx.github.io/formik-material-ui/docs/api/material-ui
class Product extends React.Component<{ history: any, match: any }, { editMode: boolean, maker: Maker | null, product: P.Product, isSubmitting: boolean }>{

  state = { maker: null, editMode: false, isSubmitting: false, product: { maxInCart: 10, ref: '', image: conf.baseURL + '/default_image.jpg', label: '', price: 0, categoryId: '', available: false } };
  subMaker: Subscription | null = null;

  componentWillUnmount() {
    this.subMaker?.unsubscribe();
  }

  componentDidMount() {
    const ref: string = this.props.match.params.id;
    this.setState({ editMode: ref !== '0000' });

    this.subMaker = makerStore.subscribe((maker: Maker) => {
      if (maker) {
        const product: any = (maker.products || []).filter(p => p.ref === ref);
        if (product.length) {
          product[0].draftImage = null;
          product[0].ref = maker.prefixOrderRef;
          this.setState({ maker, product: product[0] });
        } else {
          this.setState({ maker });
        }
      }
    });
  }

  onChangeCategory(categoryId: string) {
    const newProduct = { ...this.state.product };
    newProduct.categoryId = categoryId;
    this.setState({ product: newProduct });
  }

  onChangeStatus(availableNumber: number) {
    const newProduct = { ...this.state.product };
    newProduct.available = availableNumber === 1;
    this.setState({ product: newProduct });
  }


  onChangeValue(attr: string, value: any) {
    const newProduct: any = { ...this.state.product };
    newProduct[attr] = value;
    this.setState({ product: newProduct });
  }

  onSubmit(e: any) {
    e.preventDefault();
    const newMaker = { ...(this.state.maker as any) };
    if (this.state.editMode) {
      newMaker.products = newMaker.products.map((p: any) => {
        if (p.ref === this.state.product.ref) {
          p = this.state.product;
        }
        return p;
      })
    } else {
      newMaker.products.push(this.state.product);
    }

    if (newMaker.products.map((p: any) => newMaker.products.filter((pp: P.Product) => pp.ref === p.ref).length).filter((nb: any) => nb > 1)) {
      alert('La référence produit est déjà utilisée');
      return;
    }


    MakerStore.update(newMaker)
      .then(() => makerStore.load())
      .catch(() => this.props.history.push('/error'));
  }

  onChangeUpload(target:any){
    console.log(target.files[0]);
    /*
    https://www.npmjs.com/package/browser-image-compression
    
const fileReader = new FileReader();
        const name = target.accept.includes('image') ? 'images' : 'videos';

        fileReader.readAsDataURL(target.files[0]);
        fileReader.onload = (e) => {
            this.setState((prevState) => ({
                [name]: [...prevState[name], e.target.result]
            }));
        };
    */

  }

  render() {
    const product: P.Product = (this.state.product as any);
    console.log(product);

    return <div className="product">
      <MenuApp mode="light" history={this.props.history} />

      <div className="area">

        <div className="image">
          <img src={product.draftImage || product.image} alt="apercu produit" />
        </div>
        <div className="action">

          <input
            className="input-upload"
            id="upload_product_image"
            type="file" 
            accept="image/jpeg"
            onChange={(e:any) => this.onChangeUpload(e.target)}
          />
          <label htmlFor="upload_product_image">
            <Button  color="primary" component="span">
            Changer l'image
        </Button>
          </label>

        </div>
      </div>

      <form className="fields" onSubmit={(e) => this.onSubmit(e)} >
        <TextField
          id="ref"
          fullWidth
          required
          onChange={(e) => this.onChangeValue('ref', `${e.target.value}`)}
          value={this.state.product.ref}
          label="Référence"
          type="text"
          inputProps={{
            maxLength: 24,
            readOnly: this.state.editMode
          }}
        />

        <FormControl fullWidth required >
          <InputLabel id="status_label">Etat</InputLabel>
          <NativeSelect
            value={product.available ? 1 : 0}
            autoFocus
            required
            onChange={(e) => this.onChangeStatus(e.target.value as any)}
            inputProps={{
              name: 'status',
              id: 'status',
            }}
          >
            <option value={1}>Actif</option>
            <option value={0}>Inactif</option>
          </NativeSelect>
        </FormControl>

        <TextField
          id="label"
          fullWidth
          required
          onChange={(e) => this.onChangeValue('label', `${e.target.value}`)}
          value={this.state.product.label}
          label="Libellé du produit"
          type="text"
        />

        <FormControl fullWidth required >
          <InputLabel id="cid_label">Catégorie</InputLabel>
          <NativeSelect
            required
            value={product.categoryId}
            onChange={(e) => this.onChangeCategory(e.target.value as any)}
            inputProps={{
              name: 'categoryId',
              id: 'cid',
            }}
          >
            {conf.categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.label}</option>))}
          </NativeSelect>
        </FormControl>

        <TextField
          id="price"
          fullWidth
          required
          onChange={(e) => this.onChangeValue('price', parseFloat(e.target.value as any))}
          value={this.state.product.price}
          label="Prix"
          type="number"
          inputProps={{
            max: 1000,
            min: 0
          }}
        />

        <TextField
          id="maxInCart"
          required
          fullWidth
          onChange={(e) => this.onChangeValue('maxInCart', parseInt(e.target.value as any))}
          value={this.state.product.maxInCart}
          label="Quantité max dans le panier"
          type="number"
          inputProps={{
            max: 1000,
            min: 0
          }}
        />
        <TextField
          id="description"
          fullWidth
          onChange={(e) => this.onChangeValue('description', `${e.target.value}`)}
          label="Description"
          multiline
          rowsMax={2}
          inputProps={{
            maxLength: 1024
          }}
        />


        <div className="weight-volume">
          <TextField
            id="weight"
            fullWidth
            onChange={(e) => this.onChangeValue('weight', parseFloat(e.target.value as any))}
            label="Poids (gramme)"
            type="number"
            inputProps={{
              max: 10000000,
              min: 0
            }}
          />
          <TextField
            id="volume"
            fullWidth
            onChange={(e) => this.onChangeValue('volume', parseFloat(e.target.value as any))}
            label="Volume (litre)"
            type="number"
            inputProps={{
              max: 1000,
              min: 0
            }}
          />
        </div>

        <Button type="submit" fullWidth variant="contained" color="primary">
          Valider
        </Button>

      </form>

    </div>;
  }
}

export default Product;
