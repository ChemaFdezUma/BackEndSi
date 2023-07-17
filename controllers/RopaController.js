//importamos el Modelo
import RopaModel from "../models/RopaModel.js"
//** Métodos para el CRUD **/

//Mostrar todos los registros
export const getAllRopas = async (req, res) => {
    try {
        const Ropas = await RopaModel.findAll()
        res.json(Ropas)
    } catch (error) {
        res.json( {message: error.message} )
    }
}
//Mostrar un registro
export const getRopaPortada = async (req, res) => {
    console.log("a + \n \n")
    try {
        const Ropas = await RopaModel.findAll({
            where:{ portada:1 }
        })
        res.json(Ropas)
    } catch (error) {
        res.json( {message: error.message} )
    }
}

//Mostrar un registro
export const getRopa = async (req, res) => {
        try {
            const Ropas = await RopaModel.findAll({
                where:{ ID:req.params.ID }
            })
            res.json(Ropas[0])
        } catch (error) {
            res.json( {message: error.message} )
        }
}
//Crear un registro
export const createRopa = async (req, res) => {
    try {
        let pasar=await RopaModel.create(req.body)
       
       res.json({
        "message":{pasar}
       })
    } catch (error) {
        res.json( {message: error.message} )
    }
}
//Actualizar un registro
export const updateRopa = async (req, res) => {
    try {
        await RopaModel.update(req.body, {
            where: { ID: req.params.ID}
        })
        res.json({
            "message":"¡Registro actualizado correctamente!"
        })
    } catch (error) {
        res.json( {message: error.message} )
    }
}
//Eliminar un registro
export const deleteRopa = async (req, res) => {
    try {
        await RopaModel.destroy({ 
            where: { ID : req.params.ID }
        })
        res.json({
            "message":"¡Registro eliminado correctamente!"
        })
    } catch (error) {
        res.json( {message: error.message} )
    }
}
