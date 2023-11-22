import fsPromises from 'fs/promises'
import path from 'path'
import process from 'process'

export default async function leer(req, res){
    let filePath = '/usuario.json'
    let ruta = path.join( process.cwd(), filePath)

    try {
        let data = await fsPromises.readFile(ruta)
        console.log(data)
        return res.status(200).json(JSON.parse(data))

    }
    catch(error){
        console.log("Ocurrio un errror ")
    }
}