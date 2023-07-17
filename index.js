import express  from "express"
import cors from 'cors'
//importamos la conexión a la DB
import db from "./database/db.js"

import ropaRoutes from "./routes/ropaRoutes.js";
import contratacionRoutes from "./routes/contratacionRoutes.js";
import usuarioRoutes from "./routes/UsuariosRoutes.js";
import stripeRouites from "./routes/stripe.js";
import cookieParser from "cookie-parser";
const allowedOrigins = ['http://localhost:3000', 'http://localhost:8000'];
const app = express();
// Configurar las opciones de CORS para permitir las solicitudes de origen cruzado desde http://localhost:3000
const corsOptions = {
  origin: ['http://localhost:3000','http://localhost:8000'],
  credentials: true // Habilitar el intercambio de cookies entre dominios
};
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json())


app.use('/ropa',ropaRoutes)
app.use('/contratacion',contratacionRoutes)
app.use('/usuario',usuarioRoutes)
app.use('/stripe',stripeRouites)
try {
  await db.authenticate()
  console.log('Conexión exitosa a la DB')
} catch (error) {
  console.log(`El error de conexión es: ${error}`)
}
 app.get('/', (req, res)=>{
  res.send('HOLA MUNDO')
}) 

app.listen(8000, ()=>{
  console.log('Server UP running in http://localhost:8000/')
})


export default db