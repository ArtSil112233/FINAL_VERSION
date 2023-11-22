import Link from 'next/link';
import Head from 'next/head';
import LayoutcasoCita from '@/components/LayoutcasoCita';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PaginaDestino = () => {
    // Obtiene el objeto router
    const router = useRouter();
    const { id_libro, usuario } = router.query;
    const [id_usuario, setid_usuario] = useState(0);
    const [titulo, setTitulo] = useState("");
    const [imagen_portada_url, setImagen_portada_url] = useState("");
    const [url_compra, setUrl_compra] = useState("");
    const [editorial, setEditorial] = useState("");

    // Define un estado para el libro
    const [libro, setLibro] = useState(null);

    useEffect(() => {
        const recopilarNombreUsuario = async () => {
            try {
                const response = await fetch('/api/filtrar/librosCita', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id_libro }),
                });
                const data = await response.json();
                const { titulo } = data;
                const { imagen_portada_url } = data;
                const { url_compra } = data;
                const { editorial } = data;
                setTitulo(titulo);
                setImagen_portada_url(imagen_portada_url);
                setUrl_compra(url_compra);
                setEditorial(editorial);
            } catch (error) {
                console.error('Error de conexión');
            }
        };
        recopilarNombreUsuario();

    }, [id_libro]);

    useEffect(() => {
        const recopilarIdUsuario = async () => {
            try {
                const response = await fetch('/api/filtrar/idusuario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ usuario }),
                });
                const data = await response.json();
                const { id_usuario } = data;
                setid_usuario(id_usuario);
            } catch (error) {
                console.error('Error de conexión');
            }
        };
        recopilarIdUsuario();

    }, [id_libro]);

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const cambiar = () => {
        setShowCalendar(!showCalendar);
    };

    const [showMessage, setShowMessage] = useState(false);
    const [fechaentrega, setFechaEntrega] = useState(null);
    const registrarReserva = async () => {
        // Crea un objeto de reserva con la fecha, usuario y título del libro
        const fechaEntrega = new Date(selectedDate);
        fechaEntrega.setDate(fechaEntrega.getDate() + 30);
        setFechaEntrega(fechaEntrega.toDateString());
        try {
            const response = await fetch('/api/register/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fecha: selectedDate.toISOString(),
                    fechaentrega: fechaEntrega.toISOString(),
                    disponibilidad: 1,
                    id_libro: id_libro,
                    id_usuario: id_usuario
                }),
            });
        } catch (error) {
            console.log(error);
            console.error('Error de conexión');
        }
        setShowCalendar(false);
        setShowMessage(true);
    };


    const handleOKButtonClick = () => {
        setShowMessage(false);
        router.back();
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
        <LayoutcasoCita content={
            <>

                <div className="contenidoizquierda">
                    <div className="opciones">
                        <ul>
                            <li><Link href={`/blog/alumno/${usuario}/paginaPrincipalAlumno`}>Principal</Link></li>
                            <li><Link href={`/blog/alumno/${usuario}/paginaPerfilAlumno`}>Perfil</Link></li>
                            <li><Link href={`/blog/alumno/${usuario}/paginaResultadosAlumno`}>Préstamos</Link></li>
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

                <div className="seccion-titulo-resultados">
                    <div className="titulo">
                        <h2>Citas</h2>
                    </div>
                </div>
                <div className="linea2"></div>
                <div className='seccionInfoLibro'>
                    <div className='infoizquierda'>
                        <div className='izqheader'>
                            <p>{titulo}</p>
                        </div>
                        <div className='debajoheader'>
                            <div className='imagen-portada-2'>
                                <img
                                    src={imagen_portada_url}
                                    alt="Portada del libro"
                                    className="portada-libro-2"
                                />
                            </div>
                            <p>{url_compra}</p>
                        </div>
                    </div>
                    <div className='infoderecha'>
                        <div className='infochikita'>
                            <h4>Disponible</h4>
                        </div>
                        <h8>Editorial</h8>
                        <p>{editorial}</p>
                    </div>
                </div>
                <div className="seccion-titulo-resultados">
                    <div className="titulo">
                        <h3>Reservar</h3>
                    </div>
                </div>
                <div className="linea2"></div>
                <div className="input-container">
                    <label className="form-label-9" htmlFor="fecha">Ingresa una Fecha limite</label>
                    <input className="form-input-9"
                        type="text" id="fecha" name="contrasena"
                        value={selectedDate ? selectedDate.toLocaleDateString('es-ES') : ''}
                        readOnly // Para que el campo sea de solo lectura
                    />
                    <div className='circuloXd'>
                        <img src='/today_24px.png' onClick={toggleCalendar}></img>
                    </div>
                </div>
                <div className="mensajito">
                    <h6>DD/MM/YYYY</h6>
                </div>
                <div className="boton-citas">
                    <button onClick={registrarReserva}>Reservar</button>
                </div>
                {showCalendar && (
                    <>
                        <div className="confirmacion-fondo">
                            <div className="seccion-confirmacion-2">
                                <h1>Seleccion Fecha</h1>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                />
                                <h1></h1>
                                <button className="buttonfecha" onClick={cambiar}>OK</button>
                            </div>
                        </div>
                    </>
                )}
                {showMessage && (
                    <div className="confirmacion-fondo">
                        <div className="confirmacion-22">
                            <h1>Reserva Completada</h1>
                            <p>La reserva del recurso se ha realizado con éxito. Este debe ser devuelto hasta el día {formatDate(fechaentrega)}</p>
                            <h1></h1>
                            <div className='ok'>
                                <button onClick={handleOKButtonClick}>OK</button>
                            </div>

                        </div>
                    </div>
                )}

            </>
        }></LayoutcasoCita>

    );
};

export default PaginaDestino;