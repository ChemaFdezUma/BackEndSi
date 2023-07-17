//importamos el Modelo
import contratacionModel from "../models/ContratacionesModel.js"
//** Métodos para el CRUD **/

//Mostrar todos los registros
export const getAllcontratacions = async (req, res) => {
    try {
        const contratacions = await contratacionModel.findAll()
        res.json(contratacions)
    } catch (error) {
        res.json( {message: error.message} )
    }
}
//Mostrar un registro
export const getcontratacionPortada = async (req, res) => {
    console.log("a + \n \n")
    try {
        const contratacions = await contratacionModel.findAll({
            where:{ portada:1 }
        })
        res.json(contratacions)
    } catch (error) {
        res.json( {message: error.message} )
    }
}

//Mostrar un registro
export const getcontratacion = async (req, res) => {
        try {
            const contratacions = await contratacionModel.findAll({
                where:{ ID:req.params.ID }
            })
            res.json(contratacions[0])
        } catch (error) {
            res.json( {message: error.message} )
        }
}
//Crear un registro
export const createcontratacion = async (req, res) => {
    try {
        let pasar=await contratacionModel.create(req.body)
       
       res.json({
        "message":{pasar}
       })
    } catch (error) {
        res.json( {message: error.message} )
    }
}
//Actualizar un registro
export const updatecontratacion = async (req, res) => {
    try {
        await contratacionModel.update(req.body, {
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
export const deletecontratacion = async (req, res) => {
    try {
        await contratacionModel.destroy({ 
            where: { ID : req.params.ID }
        })
        res.json({
            "message":"¡Registro eliminado correctamente!"
        })
    } catch (error) {
        res.json( {message: error.message} )
    }
}
