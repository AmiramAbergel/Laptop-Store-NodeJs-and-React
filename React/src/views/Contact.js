import React from "react";
import { useSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 20,
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textArea: {
    width: "100%",
    padding: "18.5px 14px",
    borderColor: "#ccc",
    borderRadius: 4,
    "&:hover": {
      borderColor: theme.palette.common.black,
    },
    "&:focus": {
      borderColor: theme.palette.primary.main,
      outlineColor: theme.palette.primary.main,
    },
  },
}));

const Contact = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = React.useState({
    loading: false,
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  React.useEffect(() => {
    document.title = "Contact Us";
    // eslint-disable-next-line
  }, []);

  const onSubmit = async () => {
    enqueueSnackbar("Email sent successfully!", {
      variant: "success",
    });
    props.history.push("/");
  };

  return (
    <Box>
      <Container>
        <Paper className={classes.paper}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h4">Contact Us</Typography>
            <Typography variant="body1" gutterBottom>
              We carefully read and answer to all our emails.
            </Typography>
          </Box>
          <Box className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={state.firstName}
                  onChange={(event) =>
                    setState({ ...state, firstName: event.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={state.lastName}
                  onChange={(event) =>
                    setState({ ...state, lastName: event.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={state.email}
                  onChange={(event) =>
                    setState({ ...state, email: event.target.value })
                  }
                  disabled={state.loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="message"
                  label="Message"
                  name="message"
                  value={state.message}
                  onChange={(event) =>
                    setState({ ...state, message: event.target.value })
                  }
                  multiline={true}
                  rows={4}
                  rowsMax={4}
                  rowsMin={4}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onSubmit}
              disabled={
                state.firstName === "" ||
                state.lastName === "" ||
                state.email === "" ||
                state.message === "" ||
                state.loading
              }
            >
              {state.loading ? "Loading..." : "Register"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Contact;
