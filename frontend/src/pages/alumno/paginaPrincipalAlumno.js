import Link from 'next/link'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const Principal = () => {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [primernombre, setPrimernombre] = useState('');
  const [id_usuario, setId_usuario] = useState();

  useEffect(() => {
    const recopilarNombreUsuario = async () => {
      const usuarioLocalStorage = localStorage.getItem("usuario");
      const { usuario } = usuarioLocalStorage ? JSON.parse(usuarioLocalStorage) : { usuario: "" };
      setUsuario(usuario);
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
  }, []);

  //------- ULTIMOS RESERVADOS --------------------
  const [reservas, setReservas] = useState([]);
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
        setReservas(reservas.slice(0, 2));
      } else {
        alert(data.message || 'Error al encontrar reservas');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      alert('Error al realizar la solicitud');
    }
  };

  useEffect(() => {
    if (id_usuario || id_usuario == 0) {
      obtenerReservas();
    }
  }, [id_usuario]);

  useEffect(() => {
    console.log("Reservas: ", reservas);
  }, [reservas])

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

  //LOGICA RUTAS
  const redirigirConUsuario = (ruta) => {
    const userData = { usuario };
    localStorage.setItem("usuario", JSON.stringify(userData));
    router.push(ruta);
  };
  return (
    <>
      <Layout content={
        <>
          <div className="contenidoizquierda">
            <div className="opciones">
              <ul>
                <li><button onClick={() => redirigirConUsuario(`/alumno/paginaPrincipalAlumno`)}>Inicio</button></li>
                <li><button onClick={() => redirigirConUsuario(`/alumno/paginaPerfilAlumno`)}>Perfil</button></li>
                <li><button onClick={() => redirigirConUsuario(`/alumno/paginaResultadosAlumno`)}>Bibliotecas</button></li>
                <li><button onClick={ValidacionDeSalida}>Salir</button></li>
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
            <div className="cartas_fila">
              {reservas.map((reserva, index) => ( //RESERVAS TEST
                <div className="carta" key={index}>
                  <div className="contenido">
                    <div className='Titulo_card'>
                      <h2>{reserva.reservalibro.titulo}</h2></div>
                    <p className='Fecha_card'>{new Date(reserva.fecha).toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>
                  </div>
                  <div className="imagen">
                    <img src={reserva.reservalibro.imagen_portada_url} loading="lazzy" alt="/media.png" className="icono_default" />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => redirigirConUsuario(`/paginaUltimasReservas`)}>Ver todo</button>
          </div>

          <div className="seccion-igual-2">
            <div className="titulo_seccion">Proximos a vencer</div>
            <div className="cartas_fila">
              {reservas.sort(function (a, b) {
                return new Date(a.fechaentrega) - new Date(b.fechaentrega);
              }).slice(0, 2).map((reserva, index) => (
                <div className="carta" key={index}>
                  <div className="contenido">
                    <div className='Titulo_card'>
                      <h2>{reserva.reservalibro.titulo}</h2></div>
                    <p className='Fecha_card'>Fecha limite: {new Date(reserva.fechaentrega).toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>
                  </div>
                  <div className="imagen">
                    <img src={reserva.reservalibro.imagen_portada_url} alt="/media.png" className="icono_default" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      } />
    </>
  )
}

export default Principal;
