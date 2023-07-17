//importamos la conexión a la DB
import db from "../database/db.js"
//importamos sequelize
import { DataTypes } from "sequelize";

 const usuariosModel = db.define('usuario', {

   id: {type: DataTypes.INTEGER ,autoIncrement:true,primaryKey:true} ,
    nombre: { type: DataTypes.STRING },
    contrasena: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    fechaDeNacimiento: { type: DataTypes.DATE },
    verificado: { type: DataTypes.BOOLEAN },
    token: { type: DataTypes.STRING },
    RefreshToken: { type: DataTypes.STRING },

 }) 

 export default usuariosModel