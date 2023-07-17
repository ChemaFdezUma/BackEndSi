//importamos la conexión a la DB
import db from "../database/db.js"
//importamos sequelize
import { DataTypes } from "sequelize";

 const RopaModel = db.define('ropa', {

   id: {type: DataTypes.INTEGER ,autoIncrement:true,primaryKey:true} ,
    Nombre: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.STRING },
    nombrefoto: { type: DataTypes.STRING },
    portada: {type: DataTypes.SMALLINT},
    precio: {type: DataTypes.STRING},
    nombreFoto2: { type: DataTypes.STRING },
    precioID: { type: DataTypes.STRING },

 }) 

 export default RopaModel