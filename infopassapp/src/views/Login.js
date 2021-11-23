import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import React, { useState, useLayoutEffect } from 'react'
import { storageSave, storageRemove, storageGet } from "../services/Storage"
import { login, getLojas, sigin } from '../services/Firebase'
import { useHistory } from "react-router-dom";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import GoogleMapReact from 'google-map-react';
import RoomIcon from '@mui/icons-material/Room';

const mapStyles = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
]
const AnyReactComponent = ({ text }) =>
  <div>
    <RoomIcon fontSize="large" color="error" />
    <span style={{ backgroundColor: "white", fontSize: 18, fontWeight: "bold" }}>{text}</span>
  </div>;

function Login() {
  let history = useHistory();
  const [lembreme, setLembreme] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [open, setOpen] = React.useState(false);
  const [errorStatus, setErrorStatus] = useState(true)
  const [lojas, setLojas] = useState([])

  useLayoutEffect(() => {
    let emailStorage = storageGet("email")
    let passwordStorage = storageGet("password")

    if (emailStorage) {
      setEmail(emailStorage)
      setPassword(passwordStorage)
      setLembreme(true)
    }

    pegarLojas()

  }, [])

  const pegarLojas = async () => {
    let dados = await getLojas()
    setLojas(dados)
  }


  const handleLembreme = (e) => {
    setLembreme(e.target.checked)

    if (e.target.checked === true) {
      storageSave("email", email)
      storageSave("password", password)
    } else {
      storageRemove("email")
      storageRemove("password")
    }
  }

  const novoRegistro = async () => {

    sigin(email, password)
      .then((retorno) => {
        setMsg(retorno)
        setErrorStatus(false)
        setOpen(true)
      })
      .catch(error => {
        setMsg(error)
        setOpen(true)
        setErrorStatus(true)

      })
  }

  const efetuarLogin = async () => {

    login(email, password)
      .then(() => history.push("/home"))
      .catch(error => {
        setMsg(error)
        setOpen(true)
        setErrorStatus(true)
      })
  }


  return (
    <Grid container spacing={1}>
      <Grid item xs={4}></Grid>
      <Grid item xs={4}>
        <Collapse in={open}>
          <Alert
            severity={errorStatus ? "error" : "success"}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {msg}
          </Alert>
        </Collapse>
      </Grid>
      <Grid item xs={4}></Grid>
      <Grid item xs={3}></Grid>
      <Grid item xs={6}>
        <TextField
          type="email"
          id="outlined-basic"
          label="E-mail"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Grid>
      <Grid item xs={3}></Grid>
      <Grid item xs={3}></Grid>
      <Grid item xs={6}>
        <TextField
          type="password"
          id="outlined-basic"
          label="Password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}

        />
      </Grid>
      <Grid item xs={3}></Grid>
      <Grid item xs={3}></Grid>
      <Grid item xs={6}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={lembreme}
                onChange={handleLembreme} />}
            label="Lembre-me"
          />
        </FormGroup>
        <Button variant="contained" size="small" onClick={efetuarLogin}>
          Login
        </Button>
        <span> </span>
        <Button variant="contained" size="small" onClick={novoRegistro}>
          Novo Registro
        </Button>

      </Grid>
      <Grid item xs={3}></Grid>

      <Grid item xs={12}>

        <div style={{ height: '100vh', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyCcbqImOojMVqL_vKQi8h_fEHTiLbPqAqQ" }}
            defaultCenter={{
              lat: -28.2674422,
              lng: -52.4028652
            }}
            defaultZoom={14}
            options={{
              styles: mapStyles
            }}
          >
            {lojas.map((loja, id) => <AnyReactComponent
              key={id}
              lat={loja.lat}
              lng={loja.lng}
              text={loja.descricao}
            />)}

          </GoogleMapReact>
        </div>


      </Grid>
    </Grid >

  );
}

export default Login;
