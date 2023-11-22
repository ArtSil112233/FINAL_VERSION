import fsPromises from 'fs/promises';
import path from 'path';
import process from 'process';


export default async function escribirUsuario(req, res) {

    let filepath = '././usuario.json';
    let ruta = path.join(process.cwd(), filepath);

    try {
        const tmp = JSON.stringify(req.body);
        await fsPromises.writeFile(ruta, tmp);
        console.log(tmp);

        return res.status(200).json({ "msg": "Datos grabados en archivo" });
    } catch (error) {

        console.log("ocurrio un error", {error});
    }

}
