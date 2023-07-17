import express from 'express'
import { getAllUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario, verificarUsuario,loginUsuario,comprobarUsuario,handleRefreshToken,getUsuarioByCryptedRefreshToken,getcookie} from '../controllers/UsuariosController.js'
import { verifyJWT } from '../helpers/verifyJWT.js'
const UsuarioRoutes = express.Router()

UsuarioRoutes.get('/', verifyJWT,getAllUsuarios)
UsuarioRoutes.get('/email/:email', getUsuario);
UsuarioRoutes.post('/', createUsuario)
UsuarioRoutes.put('/:ID', updateUsuario)
UsuarioRoutes.delete('/:ID', deleteUsuario)
UsuarioRoutes.get("/verificar/:token", verificarUsuario)
UsuarioRoutes.post("/login", loginUsuario)
UsuarioRoutes.get("/comprobar",comprobarUsuario)
UsuarioRoutes.get("/refresh",handleRefreshToken)
UsuarioRoutes.get("/getcookie",getcookie)
UsuarioRoutes.post("/getUsuarioByCryptedRefreshToken/",getUsuarioByCryptedRefreshToken)
export default UsuarioRoutes
