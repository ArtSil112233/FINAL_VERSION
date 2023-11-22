import Layout from '@/components/Layout'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Principal = () => {

    const router = useRouter();
    const { usuario } = router.query;
    const [reservas, setReservas] = useState([]);
    const { query } = router;
    const tipousuario = query.tipousuario;
    const [id_usuario, setId_usuario] = useState();

    async function obtenerId() {
        try {
            const response = await fetch('/api/validar/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario }),
            });
            const data = await response.json();
            const { id_usuario } = data;
            setId_usuario(id_usuario);
            console.log("id_usuario", id_usuario);
        } catch (error) {
            console.error('Error de conexión');
        }
    };

    //------- ULTIMOS RESERVADOS --------------------
    async function obtenerReservas() {
        try {
            const response = await fetch('/api/filtrar/reservas_libros_usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify()
            });

            const data = await response.json();
            if (response.ok) {
                const { reservas } = data;
                setReservas(reservas);
                console.log("Reservas general: ", reservas);
            } else {
                alert(data.message || 'Error al encontrar reservas');
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            alert('Error al realizar la solicitud');
        }
    };

    function crearCarta(index, reserva) {
        return (
            <>
                <div className="carta" key={index}>
                    <div className="contenido">
                        <div className='Titulo_card'>
                            <h2>{reserva.reservalibro.titulo}</h2></div>
                        <p className='Fecha_card'>{new Date(reserva.fecha).toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>
                    </div>
                    <div className="imagen">
                        <img src={reserva.reservalibro.portada} alt="portada" className="icono_default" />
                    </div>
                </div>
            </>
        )
    }

    function crearCartaUSER(index, reserva) {
        return (
            <>
                <div className="carta" key={index}>
                    <div className="contenido">
                        <div className='Titulo_card'>
                            <h2 >{reserva.reservalibro.titulo}</h2>
                        </div>
                        <p className='Fecha_card'>{new Date(reserva.fecha).toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })} <span className="User_Card">User: {reserva.usuariolibro.correo.split("@")[0]}</span></p>
                    </div>
                    <div className="imagen">
                        <img src={reserva.reservalibro.portada} alt="portada" className="icono_default" />
                    </div>
                </div>
            </>
        )
    }

    function mostrarLibros(reservas) {
        const resultado = [];

        for (let i = 0; i < reservas.length; i += 2) {
            const cartasFila = (
                <div className='cartas_fila' key={i}>
                    {crearCarta(i, reservas[i])}
                    {i + 1 < reservas.length && (
                        crearCarta(i + 1, reservas[i + 1])
                    )}
                </div>
            );
            resultado.push(cartasFila);
        }

        return resultado;
    }
    function mostrarLibrosADMIN(reservas) {
        const resultado = [];

        for (let i = 0; i < reservas.length; i += 2) {
            const cartasFila = (
                <div className='cartas_fila' key={i}>
                    {crearCartaUSER(i, reservas[i])}
                    {i + 1 < reservas.length && (
                        crearCartaUSER(i + 1, reservas[i + 1])
                    )}
                </div>
            );
            resultado.push(cartasFila);
        }

        return resultado;
    }

    function userORadmin(tipo) {
        if (tipo == "admin") {
            return "Admin"
        } else {
            return "Alumno"
        }
    }

    useEffect(() => {
        if(!id_usuario){
            obtenerId();
        }
        obtenerReservas();
    }, [id_usuario]);

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
            <Layout content={
                <>
                    <div className="contenidoizquierda">
                        <div className="opciones">
                            <ul>
                                <li><Link href={`/blog/${tipousuario}/${usuario}/paginaPrincipal${userORadmin(tipousuario)}`}>Principal</Link></li>
                                <li><Link href={`/blog/${tipousuario}/${usuario}/paginaPerfil${userORadmin(tipousuario)}`}>Perfil</Link></li>
                                <li><Link href={`/blog/${tipousuario}/${usuario}/paginaResultados${userORadmin(tipousuario)}`}>Préstamos</Link></li>
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
                    <div className="seccion-titulo">
                        <h2>Utimas reservas</h2>
                    </div>
                    <div className="linea2"></div>
                    <div className="ultimas_reservas_pag_block">
                        {tipousuario === "admin" ? (
                            mostrarLibrosADMIN(reservas, 2)
                        ) : mostrarLibros(reservas.filter((reserva) => reserva.id_usuario == id_usuario), 2)}
                    </div>
                </>
            } />
        </>
    )
}

export default Principal;
//