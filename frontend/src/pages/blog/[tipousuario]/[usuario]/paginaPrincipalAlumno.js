import Link from 'next/link'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const Principal = () => {
  const router = useRouter();
  const { usuario } = router.query;
  const [primernombre, setPrimernombre] = useState('');
  const [id_usuario, setId_usuario] = useState();

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
        console.log("DATOS DE API VALIDAR USUARIO: ", data);
        const { nombreDelAlumno, id_usuario } = data;
        if (nombreDelAlumno) {
          const nombreAlumnoArray = nombreDelAlumno.split(' ');
          setPrimernombre(nombreAlumnoArray[0]);
          setId_usuario(id_usuario);
        }
      } catch (error) {
        console.error('Error de conexión');
      }
    };

    recopilarNombreUsuario();
  }, [usuario]);

  //------- ULTIMOS RESERVADOS --------------------
  const [reservas, setReservas] = useState([]);
  const [reservasActivas, setReservasActv] = useState([]);
  async function obtenerReservas() {
    try {
      const response = await fetch('/api/filtrar/reservasXid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_usuario: id_usuario })
      });

      const data = await response.json();
      if (response.ok) {
        const { reservas } = data;
        setReservas(reservas);
        setReservasActv(reservas.filter(reserv => reserv.disponibilidad === 1));
      } else {
        alert(data.message || 'Error al encontrar reservas');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      alert('Error al realizar la solicitud');
    }
  };

  useEffect(() => {
    if (id_usuario) {
      obtenerReservas();
    }
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
                    display: 'inline-block',  
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
            <h2>Bienvenido, {primernombre}!</h2>
          </div>
          <div className="linea2"></div>
          <div className="seccion-igual-1">
            <div className="titulo_seccion">Últimas reservas</div>
            <div class="cartas_fila">
              {reservas.slice(-2).reverse().map((reserva, index) => ( //RESERVAS TEST
                <div className="carta" key={index}>
                  <div className="contenido">
                    <div className='Titulo_card'>
                      <h2>{reserva.reservalibro.titulo}</h2></div>
                    <p className='Fecha_card'>{new Date(reserva.fecha).toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>
                  </div>
                  <div className="imagen">
                    <img src={reserva.reservalibro.portada} loading="lazzy" alt="/media.png" className="icono_default" />
                  </div>
                </div>
              ))}
            </div>
            <Link href={`/blog/alumno/${usuario}/paginaUltimasReservas`} class="ver-todo">Ver todo</Link>
          </div>

          <div className="seccion-igual-2">
            <div className="titulo_seccion">Proximos a vencer</div>
            {/*
            <div className="cartas_fila">
              {reservas.filter((libro) => libro.usuario == usuario).slice(-2).map((libro, index) => (
                <div className="carta" key={index}>
                  <div className="contenido">
                    <div className='Titulo_card'>
                      <h2>{libro.titulo}</h2></div>
                    <p className='Fecha_card'>Fecha limite: {new Date(libro.fechaentrega).toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>
                  </div>
                  <div className="imagen">
                    <img src={libro.portada} alt="/media.png" className="icono_default" />
                  </div>
                </div>
              ))}
            </div>
              */}
          </div>
        </>
      } />
    </>
  )
}

export default Principal;
