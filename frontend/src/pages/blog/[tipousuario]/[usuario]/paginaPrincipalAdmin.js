import Link from 'next/link'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const Principal = () => {
  const router = useRouter();
  const { usuario } = router.query;
  const [primernombre, setPrimernombre] = useState('');

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

    recopilarNombreUsuario();
  }, [usuario]);

  //------- ULTIMOS RESERVADOS --------------------
  const [reservas, setReservas] = useState([]);
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
        setReservas([]);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      alert('Error al realizar la solicitud');
    }

  };

  useEffect(() => {
    obtenerReservas();
  }, []);


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
            <h2>Bienvenido, {primernombre}!</h2>
          </div>
          <div className="linea"></div>
          <div className="seccion-igual-1">
            <div class="titulo_seccion">Últimas reservas</div>
            <div class="cartas_fila">
              {reservas.slice(0, 2).map((reserva, index) => ( //RESERVAS TEST
                <div className="carta" key={index}>
                  <div className="contenido">
                    <div className='Titulo_card'>
                      <h2>{reserva.reservalibro.titulo}</h2></div>
                    <p className='Fecha_card'>{new Date(reserva.fecha).toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })}<span class="User_Card"> User: {reserva.usuariolibro.correo.split("@")[0]}</span></p>
                  </div>
                  <div className="imagen">
                    <img src={reserva.reservalibro.imagen_portada_url} loading="lazzy" alt="/media.png" className="icono_default" />
                  </div>
                </div>
              ))}
            </div>
            <Link href={`/blog/admin/${usuario}/paginaUltimasReservas`} class="ver-todo">Ver todo</Link>
          </div>

          <div className="seccion-igual-2">
            <div class="titulo_seccion">Los más pedidos</div>
            {/*
            <div class="cartas_fila">
              {stats.slice(0, 2).map((libro, index) => (
                <div className="carta" key={index}>
                  <div className="contenido">
                    <div className='Titulo_card'>
                      <h2>{libro.titulo}</h2>
                    </div>
                    <p className='Fecha_card'>{libro.autor}</p>
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
