# Proyecto del GRUPO 7

## Integrantes del Grupo

- Arturo Aaron Silvera Pocco
- Marcelo Cabrejos Benites
- Roberto Carlos Lopez Jauregui
- Alessandro Ledesma
- Natalia Perez

# Querys para el backend
-   npx sequelize model:create --name libro --attributes formato:string,autor:string,editorial:string,categoria:string,anio:string,idioma:string,nro_paginas:string,encuadernacion:string,isbn:string,isbn13:string,nro_edicion:string,imagen_portada_url:text,titulo:string,dimensiones:string,url_compra:text,tema:string,coleccion:string,peso:string,ilustracion:string,disponibilidad_libro:integer
-   npx sequelize model:create --name reserva --attributes fecha:string,fechaentrega:string,disponibilidad:integer
-   npx sequelize model:create --name usuario --attributes nombre:string,apellido:string,tipo_documento:string,nro_documento:string,correo:string,password:string,idioma:string,prefijo:string,color:string,tipo_usuario:string,direccion_imagen_url:text


# Ajustar la dirección!
-   copy libros(id,formato,autor,editorial,categoria,anio,idioma,nro_paginas,encuadernacion,ISBN,ISBN13,nro_edicion,imagen_portada_url,titulo,dimensiones,url_compra,tema,coleccion,peso,ilustracion,disponibilidad_libro) from 'C:\Users\User\Desktop\FINAL_VERSION\datosPW\libros.csv' DELIMITER ';' CSV HEADER;
-   copy usuarios(id,nombre,apellido,tipo_documento,nro_documento,correo,password,repetir_password,imagen_url,idioma,prefijo,color,tipo_usuario) from 'C:\Users\User\Desktop\Prog. Web\datosPW\usuarios.csv' DELIMITER ';' CSV HEADER; 
-   copy reservas(id,fecha,id_libro,id_usuario,fechaentrega,disponibilidad) from 'C:\Users\User\Desktop\FINAL_VERSION\datosPW\reservas.csv' DELIMITER ';' CSV HEADER;

