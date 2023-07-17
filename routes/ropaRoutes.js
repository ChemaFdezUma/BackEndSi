import express from 'express'
import { getAllRopas, getRopa, createRopa, updateRopa, deleteRopa, getRopaPortada} from '../controllers/RopaController.js'
const ropaRoutes = express.Router()

ropaRoutes.get('/', getAllRopas)
ropaRoutes.get('/:ID', getRopa)
ropaRoutes.post('/', createRopa)
ropaRoutes.put('/:ID', updateRopa)
ropaRoutes.delete('/:ID', deleteRopa)
ropaRoutes.get("/portada/get",getRopaPortada)
export default ropaRoutes
