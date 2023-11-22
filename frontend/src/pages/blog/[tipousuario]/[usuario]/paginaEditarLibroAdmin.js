import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router';


const AgregarNuevo = () => {
    const router = useRouter();
    const { usuario } = router.query;
    const { id_libro } = router.query;
    const [primernombre, setPrimernombre] = useState('');

    const [state, setState] = useState(
        { titulo: '', autor: '', isbn13: '', tema: '', isbn13aux: '' }
    )
    useEffect(() => {
        const recopilarNombreUsuario = async () => {
            try {
                const response = await fetch('/api/validar/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ usuario }),
                });

                const data = await response.json();
                const { nombreDelAlumno } = data;
                if (nombreDelAlumno) {
                    const nombreAlumnoArray = nombreDelAlumno.split(' ');
                    setPrimernombre(nombreAlumnoArray[0]);
                }
            } catch (error) {
                console.error('Error de conexión');
            }
        };
        const recopilarInfoLibro = async () => {
            try {
                const response = await fetch('/api/editarlibro/recoger', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id_libro }),
                });

                const data = await response.json();
                const { titulo } = data;
                const { autor } = data;
                const { isbn13 } = data;
                const { tema } = data;
                setState({ titulo: titulo, autor: autor, isbn13: isbn13, tema: tema, isbn13aux: isbn13 });
            } catch (error) {
                console.error('Error de conexión');
            }
        };
        recopilarInfoLibro();
        recopilarNombreUsuario();
    }, [usuario, id_libro]);
    //------------------------------------------------------------------------------

    /*
    async function handleGuardarClick() {
        //HACE QUE LA PAGINA NO SE VUEVLA A ACTUALIZAR
        event.preventDefault();
        await actualizarLibro(state);
    };
¨*/
    const [flag, setFlag] = useState(false);
    const handleGuardarClick = async (event) => {
        //HACE QUE LA PAGINA NO SE VUEVLA A ACTUALIZAR
        event.preventDefault();
        await actualizarLibro(state);
    };
    async function actualizarLibro(nuevosDatos) {
        try {
            const response = await fetch('/api/editarlibro/editar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevosDatos),
            });
            const data = await response.json();
            if (data.success) {
                setFlag(true);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error de conexión');
        }
    }
    //-----------------------------------------------------------------------------------------
    const completo = () => {
        setFlag(true);
        router.push(`/blog/admin/${usuario}/paginaResultadosAdmin`);
    }
    //LOGICA PARA IR AL INICIO
    const [MostrarValidacion, setMostrarValidacion] = useState(false);
    function ValidacionDeSalida() {
        setMostrarValidacion(true);
    }
    function confirmacionSalida() {
        router.push("/login");
    }
    function nosalir() {
        setMostrarValidacion(false);
    }

    return (
        <Layout content={
            <>
                <div className="contenidoizquierda">
                    <div className="opciones">
                        <ul>
                            <li><Link href={`/blog/admin/${usuario}/paginaPrincipalAdmin`}>Inicio</Link></li>
                            <li><Link href={`/blog/admin/${usuario}/paginaPerfilAdmin`}>Perfil</Link></li>
                            <li><Link href={`/blog/admin/${usuario}/paginaResultadosAdmin`}>Bibliotecas</Link></li>
                            <button
                                onClick={ValidacionDeSalida}
                                style={{
                                    cursor: 'pointer',
                                    border: 'none',
                                    background: 'none',
                                    color: 'rgb(93, 1, 93)',
                                    textDecoration: 'none',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    marginTop: '13px',
                                    marginLeft: '-70px',
                                }}
                            >Salir</button>
                            {MostrarValidacion && (
                                <>
                                    <div className="confirmacion-fondo">
                                        <div className="seccion-confirmacion-2">
                                            <h1>¿Seguro que quiere salir?</h1>
                                            <button className="buttonfecha" onClick={confirmacionSalida}>SÍ</button>
                                            <button className="buttonfecha" onClick={nosalir}>NO</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </ul>
                    </div>
                    <p className="version">Biblio v1.0.1-Alpha</p>
                </div>
                <div className="seccion-titulo">
                    <h2>Hola, {primernombre}!</h2>
                </div>
                <div className="linea"></div>
                <div className="seccion-perfil">
                    <div className="imagen-admin">
                        <img
                            src="/Rectangle 5.png"
                            alt="Imagen del administrador"
                            id="imagenAdmin"
                            style={{
                                maxWidth: '100%', //ancho máximo de la imagen
                                maxHeight: '300px', //altura máxima de la imagen
                            }}
                        />
                    </div>
                    <div className="opciones2">
                        <div className="opciones-superior">
                            <div className='opciones-3'>
                                EDITAR LIBRO
                            </div>
                        </div>
                        <form className="opciones-contenido">
                            <div className="column-2">
                                <div className="input-container-2">
                                    <label className="form-label-2" htmlFor="titulo">TÍTULO</label>
                                    <input
                                        className="form-input-2"
                                        type="text"
                                        id="titulo"
                                        name="titulo"
                                        value={state.titulo}
                                        onChange={(e) => {
                                            setState({ titulo: e.target.value, autor: state.autor, isbn13: state.isbn13, tema: state.tema, isbn13aux: state.isbn13aux });
                                        }}
                                        required
                                    />
                                </div>
                                <div className="input-container-2">
                                    <label className="form-label-2" htmlFor="autor">Autor, autores</label>
                                    <input
                                        className="form-input-2"
                                        type="text"
                                        id="autor"
                                        name="autor"
                                        value={state.autor}
                                        onChange={(e) => {
                                            setState({ titulo: state.titulo, autor: e.target.value, isbn13: state.isbn13, tema: state.tema, isbn13aux: state.isbn13aux });

                                        }}
                                        required
                                    />
                                </div>
                                <div className="input-container-2">
                                    <label className="form-label-2" htmlFor="isbn13">ISBN</label>
                                    <input
                                        className="form-input-2"
                                        type="text"
                                        id="isbn13"
                                        name="isbn13"
                                        value={state.isbn13}
                                        onChange={(e) => {
                                            setState({ titulo: state.titulo, autor: state.autor, isbn13: e.target.value, tema: state.tema, isbn13aux: state.isbn13aux });

                                        }}
                                        required
                                    />
                                </div>
                                <div className="input-container-2">
                                    <label className="form-label-2" htmlFor="tema">Serie, tipo</label>
                                    <input
                                        className="form-input-2"
                                        type="text"
                                        id="tema"
                                        name="tema"
                                        value={state.tema}
                                        onChange={(e) => {
                                            setState({ titulo: state.titulo, autor: state.autor, isbn13: state.isbn13, tema: e.target.value, isbn13aux: state.isbn13aux });

                                        }}
                                        required
                                    />
                                </div>
                                <div className="button-container-2" >
                                    <button className="register-button-2" disabled={!(state.titulo && state.autor && state.isbn13 && state.tema)} onClick={handleGuardarClick}>Guardar</button>
                                </div>
                            </div>
                        </form>
                        {flag && (
                            <div className="confirmacion-fondo">
                                <div className="confirmacion">
                                    <h2>Registro completo</h2>
                                    <h3>El recurso ha sido EDITADO con éxito</h3>
                                    <button onClick={completo}>OK</button>
                                </div>
                            </div>

                        )}
                    </div>

                </div>


            </>
        }></Layout>
    )

}
export default AgregarNuevo;