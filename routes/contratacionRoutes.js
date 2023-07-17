import express from 'express'
import { getAllcontratacions, getcontratacion, createcontratacion, updatecontratacion, deletecontratacion, getcontratacionPortada} from '../controllers/ContratacionController.js'
const contratacionRoutes = express.Router()

contratacionRoutes.get('/', getAllcontratacions)
contratacionRoutes.get('/:ID', getcontratacion)
contratacionRoutes.post('/', createcontratacion)
contratacionRoutes.put('/:ID', updatecontratacion)
contratacionRoutes.delete('/:ID', deletecontratacion)
contratacionRoutes.get("/portada/get",getcontratacionPortada)
export default contratacionRoutes
