import React from 'react';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { Context } from '../../../Context';

const styles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
  },
  toolbar: {
    justifyContent: 'space-between',
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[2],
    marginBottom: theme.spacing(4),
    borderRadius: 4,
  },
  Paper: {
    padding: theme.spacing(3),
    boxShadow: theme.shadows[2],
  },
  Label: {
    fontWeight: 'bold',
  },
  textArea: {
    width: '100%',
    marginBottom: theme.spacing(3),
    padding: '18.5px 14px',
    borderColor: '#ccc',
    borderRadius: 4,
    '&:hover': {
      borderColor: theme.palette.common.black,
    },
    '&:focus': {
      borderColor: theme.palette.primary.main,
      outlineColor: theme.palette.primary.main,
    },
  },
  Input: {
    marginBottom: theme.spacing(3),
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '&:focus': {
      borderColor: 'red',
    },
  },
  SelectControl: {
    // width: '100%',
    marginBottom: theme.spacing(3),
  },
  UploadInput: {
    display: 'none',
  },
  Upload: {
    display: 'inline-block',
    position: 'relative',
    marginBottom: theme.spacing(3),
  },
  Image: {
    position: 'absolute',
    top: 2,
    right: -50,
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  Editor: {
    marginBottom: theme.spacing(3),
  },
}));

const AddProduct = (props) => {
  const classes = styles();
  const contextState = React.useContext(Context);
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = React.useState({
    loading: false,
    // Form
    title: '',
    description: '',
    price: '',
    image: null,
  });

  React.useEffect(() => {
    document.title = props.location.state !== null ? 'Edit Product' : 'Add Product';
    if (props.location.state !== null) {
      setState({
        ...state,
        title: props.location.state.product.title,
        description: props.location.state.product.description,
        price: props.location.state.product.price,
      });
    }
    // eslint-disable-next-line
  }, []);

  const onAdd = async () => {
    setState({ ...state, loading: true });
    try {
      var formdata = new FormData();
      formdata.append('image', state.image);
      formdata.append('title', state.title);
      formdata.append('description', state.description);
      formdata.append('price', state.price);

      const response = await fetch(`http://localhost:8000/product/create`, {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
        headers: {
          Authorization: contextState.contextState.session,
        },
      });
      if (!response.ok) throw response;
      enqueueSnackbar('Product added successfully!', {
        variant: 'success',
      });
      props.history.push('/');
    } catch (err) {
      setState({ ...state, loading: false });
      enqueueSnackbar('Whoops, there was en error. Please, try again.', {
        variant: 'error',
      });
    }
  };

  const onEdit = async () => {
    setState({ ...state, loading: true });
    try {
      var formdata = new FormData();
      state.image !== null &&
        state.image !== undefined &&
        state.image !== '' &&
        formdata.append('image', state.image);
      formdata.append('title', state.title);
      formdata.append('description', state.description);
      formdata.append('price', state.price);

      const response = await fetch(
        `http://localhost:8000/product/${props.location.state.product.id}`,
        {
          method: 'PUT',
          body: formdata,
          redirect: 'follow',
          headers: {
            Authorization: contextState.contextState.session,
          },
        },
      );
      if (!response.ok) throw response;
      enqueueSnackbar('Product updated successfully!', {
        variant: 'success',
      });
      props.history.push('/');
    } catch (err) {
      setState({ ...state, loading: false });
      enqueueSnackbar('Whoops, there was en error. Please, try again.', {
        variant: 'error',
      });
    }
  };

  return (
    <Box className={classes.container}>
      <Container>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">
            {props.location.state !== null ? 'Edit Product' : 'Add Product'}
          </Typography>
          <Box>
            <Button
              size="small"
              color="primary"
              disableElevation
              onClick={() => props.history.goBack()}
            >
              Cancel
            </Button>
          </Box>
        </Toolbar>
        <Paper className={classes.Paper}>
          <Typography variant="subtitle1" color="initial" className={classes.Label} gutterBottom>
            Title
          </Typography>
          <TextField
            className={classes.Input}
            placeholder="Title"
            variant="outlined"
            fullWidth
            value={state.title}
            onChange={(event) => setState({ ...state, title: event.target.value })}
          />
          <Typography variant="subtitle1" color="initial" className={classes.Label} gutterBottom>
            Price
          </Typography>
          <TextField
            className={classes.Input}
            placeholder="Price"
            variant="outlined"
            type="number"
            fullWidth
            value={state.price}
            onChange={(event) => setState({ ...state, price: event.target.value })}
          />
          <Typography variant="subtitle1" color="initial" className={classes.Label} gutterBottom>
            Description
          </Typography>
          <TextareaAutosize
            className={classes.textArea}
            rowsMin={5}
            placeholder="Write a beautiful description..."
            defaultValue={state.description}
            onChange={(event) => setState({ ...state, description: event.target.value })}
          />
          <Typography variant="subtitle1" color="initial" className={classes.Label} gutterBottom>
            Post Image
          </Typography>
          <input
            accept="image/*"
            className={classes.UploadInput}
            id="uploadFile"
            type="file"
            name="Upload"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                var file = e.target.files[0];
                setState({ ...state, image: file });
              }
            }}
          />
          <label htmlFor="uploadFile" className={classes.Upload}>
            <Button variant="outlined" color="primary" component="span">
              {state.image === null && props.location.state !== null
                ? props.location.state.product.image.split('-')[1]
                : state.image === null
                ? 'Upload Image'
                : state.image.name}
            </Button>
          </label>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={props.location.state !== null ? onEdit : onAdd}
            disabled={
              state.title === '' ||
              state.description === '' ||
              (props.location.state !== null ? false : state.image === null) ||
              state.loading
            }
          >
            {state.loading
              ? props.location.state !== null
                ? 'Updating...'
                : 'Adding...'
              : props.location.state !== null
              ? 'Update'
              : 'Add'}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddProduct;
