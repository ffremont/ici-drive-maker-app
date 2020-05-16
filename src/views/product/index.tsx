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
import imageCompression from 'browser-image-compression';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// @see formik https://stackworx.github.io/formik-material-ui/docs/api/material-ui
class Product extends React.Component<{ history: any, match: any }, { editMode: boolean, maker: Maker | null, product: P.Product, isSubmitting: boolean }>{

  state = { maker: null, editMode: false, isSubmitting: false, product: { weight: 0, volume: 0, description: '', topOfList: false, bio: false, maxInCart: 10, ref: '', image: conf.baseURL + '/default_image.jpg', label: '', price: 0, categoryId: 'fruit-leg', available: false } };
  subMaker: Subscription | null = null;

  myBlob: Blob | null = null;

  componentWillUnmount() {
    this.subMaker?.unsubscribe();
  }

  componentDidMount() {
    const ref: string = this.props.match.params.id;
    const editMode = ref !== '0000'
    this.setState({ editMode });

    this.subMaker = makerStore.subscribe((maker: Maker) => {
      if (maker) {
        const product: any = (maker.products || []).filter(p => p.ref === ref);
        if (product.length) {
          this.setState({ maker, product: product[0] });
        } else {
          const newProduct = { ...this.state.product };
          newProduct.ref = maker.prefixOrderRef;
          this.setState({ maker, product: newProduct });
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

    if (!this.state.editMode && newMaker.products.map((p: any) => newMaker.products.filter((pp: P.Product) => pp.ref === p.ref).length).filter((nb: any) => nb > 1).length) {
      alert('La référence produit est déjà utilisée');
      return;
    }

    let myPromise: any = null;
    if (this.state.editMode) {
      myPromise = MakerStore.updateProduct(this.state.product, this.myBlob);
    } else {
      myPromise = MakerStore.addProduct(this.state.product, this.myBlob);
    }

    myPromise
      .then(() => makerStore.load())
      .catch(() => this.props.history.push('/error'));
  }

  onChangeUpload(target: any) {
    console.log(target.files[0]);
    const imageFile = target.files[0];

    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024} KB`);

    const options = {
      maxSizeMB: 50 / 1024,
      maxWidthOrHeight: 512,
      useWebWorker: true
    }

    imageCompression(imageFile, options)
      .then((compressedFile) => {
        console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        console.log(`compressedFile size ${compressedFile.size / 1024} KB`); // smaller than maxSizeMB

        const newProduct: any = { ...this.state.product };
        this.myBlob = compressedFile;

        newProduct.image = (window as any).URL.createObjectURL(compressedFile);
        this.setState({ product: newProduct });
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }

  render() {
    const product: P.Product = (this.state.product as any);
    console.log(product);

    return <div className="product">
      <MenuApp mode="light" history={this.props.history} />

      <div className="area">

        <div className="image">
          <img src={product.image} alt="apercu produit" />
        </div>
        <div className="action">

          <input
            className="input-upload"
            id="upload_product_image"
            type="file"
            accept="image/jpeg"
            onChange={(e: any) => this.onChangeUpload(e.target)}
          />
          <label htmlFor="upload_product_image">
            <Button color="primary" component="span">
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
          helperText="caractères alphanumérique"
          inputProps={{
            maxLength: 24,
            pattern:"[A-Za-z0-9_]+",
            readOnly: this.state.editMode
          }}
        />

        <FormControl fullWidth required >
          <InputLabel id="status_label">Etat</InputLabel>
          <NativeSelect
            value={product.available ? 1 : 0}
            autoFocus
            required
            onChange={(e) => this.onChangeStatus(parseInt(e.target.value as any))}
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
          onChange={(e) => this.onChangeValue('price', e.target.value ? parseFloat(e.target.value as any) : '')}
          value={this.state.product.price}
          label="Prix"
          type="number"
          inputProps={{
            max: 1000,
            min: 0,
            step: "0.01"
          }}
        />


        <TextField
          id="description"
          fullWidth
          value={this.state.product.description}
          onChange={(e) => this.onChangeValue('description', `${e.target.value}`)}
          label="Description"
          multiline
          rowsMax={2}
          inputProps={{
            maxLength: 1024
          }}
        />

        <div className="options">
          <FormControlLabel control={<Checkbox name="topOfList"
            onChange={(e) => this.onChangeValue('topOfList', e.target.checked)}
            value={this.state.product.topOfList} />} label="Top de la liste" />

          <FormControlLabel control={<Checkbox name="bio"
            onChange={(e) => this.onChangeValue('bio', e.target.checked)}
            value={this.state.product.bio} />} label="Bio" />
        </div>

        <div className="weight-volume">
          <TextField
            id="weight"
            fullWidth
            onChange={(e) => this.onChangeValue('weight', e.target.value ? parseFloat(e.target.value as any) : '')}
            label="Poids (gramme)"
            value={this.state.product.weight || ''}
            type="number"
            inputProps={{
              max: 10000000,
              min: 0
            }}
          />
          <TextField
            id="volume"
            fullWidth
            value={this.state.product.volume || ''}
            onChange={(e) => this.onChangeValue('volume', e.target.value ? parseFloat(e.target.value as any) : '')}
            label="Volume (litre)"
            type="number"
            inputProps={{
              max: 1000,
              step: "0.01",
              min: 0
            }}
          />
        </div>

        <TextField
          id="maxInCart"
          required
          fullWidth
          onChange={(e) => this.onChangeValue('maxInCart', e.target.value ? parseInt(e.target.value as any) : '')}
          value={this.state.product.maxInCart}
          label="Quantité max dans le panier"
          type="number"
          inputProps={{
            max: 1000,
            min: 0
          }}
        />

        <Button type="submit" fullWidth variant="contained" color="primary">
          {this.state.editMode ? 'Modifier' : 'Ajouter'}
        </Button>

      </form>

    </div>;
  }
}

export default Product;
