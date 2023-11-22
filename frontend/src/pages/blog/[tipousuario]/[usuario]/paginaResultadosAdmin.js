import Link from 'next/link';
import Head from 'next/head';
import Layout1 from '@/components/Layout1';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';


const Principal = () => {
    const router = useRouter();
    const { usuario } = router.query;

    const [inputText, setInputText] = useState('');
    const [coincidencias, setCoincidencias] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const resultadosPorPagina = 3;

    useEffect(() => {
        if (inputText === '') {
            setCoincidencias([]);
        } else {
            const recopilarNombreUsuario = async () => {
                try {
                    const response = await fetch('/api/filtrar/filtrarLibros', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ inputText }),
                    });
                    const data = await response.json();
                    const { libros } = data;
                    setCoincidencias(libros);
                    setPaginaActual(1);
                } catch (error) {
                    console.error('Error de conexión');
                }
            };
            recopilarNombreUsuario();
        }
    }, [inputText]);

    const irAPaginaSiguiente = () => {
        if ((paginaActual) * resultadosPorPagina <= coincidencias.length) {
            setPaginaActual(paginaActual + 1);
        }
    };
    useEffect(() => {
        console.log(indiceInicio);
        console.log(indiceFin);
    });

    const irAPaginaAnterior = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
        }
    };

    // Calcula los índices de inicio y fin para mostrar los resultados de la página actual
    const indiceInicio = (paginaActual - 1) * resultadosPorPagina;
    const indiceFin = indiceInicio + resultadosPorPagina;

    const [reservas, setReservas] = useState([]);

    async function obtenerReservas() {
        try {
            const response = await fetch('/api/filtrar/filtrarReservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputText }),
            });
            const data = await response.json();
            const { reservas } = data;
            setReservas(reservas)
        } catch (error) {
            console.error('Error de conexión');
        }
    }

    useEffect(() => {
        obtenerReservas();
    }, []);

    const eliminarReserva = async (libro) => {
        try {
            const response = await fetch('/api/filtrar/eliminarReserva', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ libro }),
            });
        } catch (error) {
            console.error('Error de conexión');
        }

    };
    // Función para manejar la búsqueda y redireccionar
    function buscar (id_libro){
        // Construir la URL con los parámetros
        const queryParams = {
            id_libro
        };
        // Generar la URL con los parámetros y redireccionar
        router.push({
            pathname: `/blog/alumno/${usuario}/paginaEditarLibroAdmin`, // Reemplaza con la ruta correcta
            query: queryParams,
        });
    };
    const doEscribir = async () => {
        window.location.href = `/blog/admin/${usuario}/paginaInsertarNuevoLibroAdmin`;
    };
    //LOGICA PARA IR AL INICIO
    const [MostrarValidacion, setMostrarValidacion] = useState(false);
    function ValidacionDeSalida() {
        setMostrarValidacion(true);
    }
    function confirmacionSalida() {
        window.location.href = "/login";
    }
    function nosalir() {
        setMostrarValidacion(false);
    }
    return (
        <>
            <Layout1 content={
                <>
                    <div className="contenidoizquierda">
                        <div className="opciones">
                            <ul>
                                <li><Link href={`/blog/admin/${usuario}/paginaPrincipalAdmin`}>Inicio</Link></li>
                                <li><Link href={`/blog/admin/${usuario}/paginaPerfilAdmin`}>Perfil</Link></li>
                                <li><Link href={`/blog/admin/${usuario}/paginaResultadosAdmin`}>Bibliotecas</Link></li>
                                <li><a href onClick={ValidacionDeSalida} style={{ cursor: 'pointer' }}>Salir</a></li>
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
                    <div className="seccion-titulo-resultados">
                        <div className="titulo">
                            <h2>Biblioteca</h2>
                        </div>
                        <button onClick={doEscribir}>Añadir un nuevo recurso</button>
                    </div>
                    <div className="linea2"></div>
                    <div className="casilla-para-escribir">
                        <label className="form-label-3" htmlFor="contrasena">
                            Ingresa la palabra clave
                            <div className="icono">
                                <img src="/Icon.png" alt="Icono" />
                            </div>
                        </label>
                        <input
                            className="form-input-3"
                            type="text"
                            id="recurso"
                            name="recurso"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Buscar por título"
                        />
                    </div>
                    <div className="seccion-rectangular-gris">
                        {coincidencias.slice(indiceInicio, indiceFin).map((libro, index) => {
                            let isBotonDeshabilitado = false;
                            if (reservas) {
                                let reservaExistente = reservas.find(
                                    (reserva) => reserva.disponibilidad === 1 && reserva.id_libro === libro.id
                                );
                                isBotonDeshabilitado = !!reservaExistente && reservaExistente.disponibilidad === 1;
                            }

                            return (
                                <div className="bloque-libro" key={index}>
                                    <div className="titulo-libro">
                                        <h3>{libro.titulo}</h3>
                                    </div>
                                    <div className="imagenes-libro">
                                        {!isBotonDeshabilitado && (
                                            <>
                                                <img src="/media.png" alt="Icono XD" className="icono-xd" />
                                                <img
                                                    src={libro["imagen_portada_url"]}
                                                    alt="Portada del libro"
                                                    className="portada-libro"
                                                />
                                            </>
                                        )}
                                        {isBotonDeshabilitado && (
                                            <>
                                                <img src="/media.png" alt="Icono XD" className="icono-xd" />
                                                <img
                                                    src={libro["imagen_portada_url"]}
                                                    alt="Portada del libro"
                                                    className="portada-libro"
                                                />
                                            </>
                                        )}
                                    </div>
                                    <div className="informacion-libro">
                                        <p><b>ISBN:</b> {libro.isbn}</p>
                                        <p><b>Autor:</b> <u>{libro.autor}</u></p>
                                        <p><b>Editorial:</b> {libro.editorial}</p>
                                    </div>
                                    {isBotonDeshabilitado && (
                                        <>
                                            <div className="MensajeNoDisp">El libro está reservado</div>
                                        </>
                                    )}
                                    <button onClick={() => buscar(libro.id)}>EDITAR</button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="paginacion">
                        <button onClick={irAPaginaAnterior} disabled={paginaActual === 1}>
                            {'<'}
                        </button>
                        <button onClick={irAPaginaSiguiente} disabled={paginaActual === (Math.ceil((coincidencias.length) / resultadosPorPagina))}>
                            {'>'}
                        </button>
                    </div>

                </>
            } />
        </>
    )
}

export default Principal;
