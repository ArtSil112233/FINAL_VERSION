import fsPromises from 'fs/promises'
import path from 'path'
import process from 'process'

export default async function escribe(req, res){
    let filePath = '/usuario.json'
    let ruta = path.join( process.cwd(), filePath)

    try {
        let tmp = JSON.stringify(req.body)
        console.log(tmp)
        await fsPromises.writeFile(ruta, tmp)
        return res.status(200).json({"rpta": "se escribio OK"})

    }
    catch(error){
        console.log("Ocurrio un errror ", {error})
    }
}