import React, { useState } from 'react'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { saveLojas } from '../services/Firebase';
import { useHistory } from "react-router-dom";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';

import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyCcbqImOojMVqL_vKQi8h_fEHTiLbPqAqQ")



export default function Lojas() {
    let history = useHistory();
    const [endereco, setEndereco] = useState("")
    const [descricao, setDescricao] = useState("")
    const [msg, setMsg] = useState("")
    const [open, setOpen] = React.useState(false);

    const save = async () => {

        let objeto = {
            endereco: endereco,
            descricao: descricao
        }
        try {
            await saveLojas(objeto, Geocode)
            history.push("/lojaslista")
        } catch (error) {
            setMsg(error)
            setOpen(true)

        }
    }

    return (
        <div>
            <h1>Cadastro de Lojas de Informática</h1>
            <Grid container spacing={1}>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                    <Collapse in={open}>
                        <Alert
                            severity="error"
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
                <Grid item xs={6}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                id="outlined-basic"
                                label="Endereço"
                                variant="outlined"
                                value={endereco}
                                size="small"
                                fullWidth
                                onChange={(e) => setEndereco(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                id="outlined-basic"
                                label="Descricão"
                                variant="outlined"
                                value={descricao}
                                size="small"
                                fullWidth
                                multiline
                                rows={4}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" size="small" onClick={save}>
                                Salvar Registro
                            </Button>
                        </Grid>
                    </Grid>

                </Grid>


            </Grid>
        </div>
    )
}
