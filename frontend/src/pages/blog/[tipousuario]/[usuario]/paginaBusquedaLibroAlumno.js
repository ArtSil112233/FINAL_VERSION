import Link from 'next/link';
import Head from 'next/head';
import Layout1 from '@/components/Layout1';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const Principal = () => {
    const [datos, setDatos] = useState([])
    const router = useRouter();
    const { usuario } = router.query;
    const { busqueda, checkboxes } = router.query;
    // Convierte los valores de los checkboxes en un objeto booleano
    const checkboxesObj = checkboxes
        ? JSON.parse(checkboxes)
        : { titulo: false, autor: false, serie: false, isbn: false };
    const [coincidencias, setCoincidencias] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [id_usuario, setid_usuario] = useState(0);
    const resultadosPorPagina = 3;
    useEffect(() => {
        if (busqueda === '') {
            setCoincidencias([]);
        } else {
            const recopilarNombreUsuario = async () => {
                try {
                    const response = await fetch('/api/filtrar/filtrarLibros', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ inputText: busqueda }),
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
    }, [busqueda]);
    //-----------------------------LOGICA DE PAGINACION------------------------------------
    const irAPaginaSiguiente = () => {
        if ((paginaActual) * resultadosPorPagina <= coincidencias.length) {
            setPaginaActual(paginaActual + 1);
        }
    };
    const irAPaginaAnterior = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
        }
    };
    // Calcula los índices de inicio y fin para mostrar los resultados de la página actual
    const indiceInicio = (paginaActual - 1) * resultadosPorPagina;
    const indiceFin = indiceInicio + resultadosPorPagina;
    //-------------------------------------------------------------------------------------
    const doVolver = async () => {
        window.location.href = `/blog/alumno/${usuario}/paginaResultadosAlumno`;
    };
    const doReservas = async () => {
        window.location.href = `/blog/alumno/${usuario}/paginaUltimasReservas`;
    };
    //---------------------------CALENDARIO-----------------------------------------
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };
    //-------------------------------------------------------------------------------
    const [flag, setFlag] = useState(false);
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);
    const [reservas, setReservas] = useState([]);
    async function obtenerReservas() {
        try {
            const response = await fetch('/api/filtrar/filtrarReservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputText: busqueda }),
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
    const reservar = (libro) => {
        setFlag(true);
        setLibroSeleccionado(libro);
    };
    const [showMessage, setShowMessage] = useState(false);
    const [fechaentrega, setFechaEntrega] = useState(null);
    const registrarReserva = async () => {
        if (libroSeleccionado) {
            // Crea un objeto de reserva con la fecha, usuario y título del libro
            const fechaEntrega = new Date(selectedDate);
            const fechaactual = new Date();
            if(fechaEntrega <= fechaactual || fechaEntrega > (fechaactual+30)){
                alert("POR FAVOR, selecciona una fecha mayor al actual y no más de 30 días");
                setShowCalendar(true);
            }else{
            setFechaEntrega(fechaEntrega.toDateString());
            try {
                const response = await fetch('/api/register/reservas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fecha: fechaactual.toISOString(),
                        fechaentrega: selectedDate.toISOString(),
                        disponibilidad: 1,
                        id_libro: libroSeleccionado.id,
                        usuario: usuario
                    }),
                });
                obtenerReservas();
            } catch (error) {
                console.log(error);
                console.error('Error de conexión');
            }
            setSelectedDate(new Date());
            setShowCalendar(false);

            setFlag(false);
            setShowMessage(true);
        }}
    };

    const handleOKButtonClick = () => {
        setShowMessage(false);
        setFlag(false);
    };
    function formatDate(dateString) {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }
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
            <Layout1
                content={
                    <>
                        <div className="contenidoizquierda">
                            <div className="opciones">
                                <ul>
                                    <li><Link href={`/blog/alumno/${usuario}/paginaPrincipalAlumno`}>Principal</Link></li>
                                    <li><Link href={`/blog/alumno/${usuario}/paginaPerfilAlumno`}>Perfil</Link></li>
                                    <li><Link href={`/blog/alumno/${usuario}/paginaResultadosAlumno`}>Préstamos</Link></li>
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
                                <h2>Búsqueda - Resultados</h2>
                            </div>
                            <button onClick={doVolver}>Volver a buscar</button>
                        </div>
                        <div className="linea2"></div>
                        <div className="seccion-info-busqueda">
                            <div className="titulo">
                                <h3>Resultados de la búsqueda: "{busqueda}"</h3>
                            </div>
                            <button onClick={doReservas}>Ver mis reservas</button>
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
                                            {checkboxesObj.titulo && <h3>{libro.titulo}</h3>}
                                        </div>
                                        <div className="imagenes-libro">
                                            {!isBotonDeshabilitado &&
                                                <a href={`/blog/alumno/${usuario}/citasAlumno?id_libro=${encodeURIComponent(libro.id)}&usuario=${encodeURIComponent(usuario)}`}
                                                >
                                                    <img src="/media.png" alt="Icono XD" className="icono-xd"
                                                        style={{
                                                            width: '420px', // Ajusta el ancho máximo de la imagen
                                                            maxHeight: '300px', // Ajusta la altura máxima de la imagen según tus necesidades
                                                        }} />
                                                    <img
                                                        src={libro["imagen_portada_url"]}
                                                        alt="Portada del libro"
                                                        className="portada-libro"
                                                        style={{
                                                            maxWidth: '100%', // Ajusta el ancho máximo de la imagen
                                                            maxHeight: '300px', // Ajusta la altura máxima de la imagen según tus necesidades
                                                        }}
                                                    />
                                                </a>
                                            }
                                            {isBotonDeshabilitado &&
                                                <><img src="/media.png" alt="Icono XD" className="icono-xd" /><img
                                                    src={libro["imagen_portada_url"]}
                                                    alt="Portada del libro"
                                                    className="portada-libro" />
                                                </>
                                            }
                                        </div>
                                        <div className="informacion-libro">
                                            {checkboxesObj.autor && (
                                                <p>
                                                    <b>Autor:</b> <u>{libro.autor}</u>
                                                </p>
                                            )}
                                            {checkboxesObj.serie && (
                                                <p>
                                                    <b>Editorial:</b> {libro.editorial}
                                                </p>
                                            )}
                                            {checkboxesObj.isbn && (
                                                <p>
                                                    <b>ISBN13:</b> {libro.isbn13}
                                                </p>
                                            )}
                                            {isBotonDeshabilitado &&
                                                <div className="MensajeNoDisp">No disponible</div>
                                            }
                                            {!isBotonDeshabilitado &&
                                                <button
                                                    onClick={() => reservar(libro)}
                                                >
                                                    Reservar
                                                </button>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="paginacion-2">
                            <button onClick={irAPaginaAnterior} disabled={paginaActual === 1}>
                                {'<'}
                            </button>
                            <button
                                onClick={irAPaginaSiguiente}
                                disabled={paginaActual === Math.ceil(coincidencias.length / resultadosPorPagina)}
                            >
                                {'>'}
                            </button>
                        </div>
                        {flag && (
                            <div className="confirmacion-fondo">
                                <div className="seccion-confirmacion-2">
                                    <h1>Calendario</h1>
                                    <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} className="date" />
                                    <p>Fecha seleccionada: {selectedDate.toDateString()}</p>
                                    <button className="buttonfecha " onClick={registrarReserva}>OK</button>
                                    <button className="buttonfecha " onClick={() => setFlag(false)}>Cancel</button>
                                </div>
                            </div>
                        )}
                        {showMessage && (
                            <div className="confirmacion-fondo">
                                <div className="confirmacion-22">
                                    <h1>Reserva Completada</h1>
                                    <p>La reserva del recurso se ha realizado con éxito. Este debe ser devuelto hasta el día {formatDate(fechaentrega)}</p>
                                    <h1></h1>
                                    <button className="ok" onClick={handleOKButtonClick}>OK</button>
                                </div>
                            </div>
                        )}
                    </>
                }
            />
        </>
    );
};
export default Principal;