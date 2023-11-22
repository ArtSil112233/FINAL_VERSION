import fsPromises from 'fs/promises';
import path from 'path';
import process from 'process';


export default async function leerUsuario(req, res) {

    let filepath = '././administradores.json';
    let ruta = path.join(process.cwd(), filepath);

    try {
        const data = await fsPromises.readFile(ruta);
        console.log(data);

        res.status(200).json(JSON.parse(data));
    } catch (error) {

        console.log("ocurrio un error");
    }

}