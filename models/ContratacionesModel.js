//importamos la conexión a la DB
import db from "../database/db.js"
//importamos sequelize
import { DataTypes } from "sequelize";

 const contratacionModel = db.define('contrataciones', {

   id: {type: DataTypes.INTEGER ,autoIncrement:true,primaryKey:true} ,
    Nombre: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },



 }) 

 export default contratacionModel