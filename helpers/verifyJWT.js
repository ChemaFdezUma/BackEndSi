import jwt from 'jsonwebtoken';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

export const verifyJWT = async (req, res, next) => {
    console.log(req.cookies)
  const refreshToken = req.cookies.TOKENWST;
  const accessToken = req.headers['authorization']?.split(' ')[1];

  if (!accessToken) {
    return res.sendStatus(401); // No se proporcionó el token de acceso
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      // El token de acceso no es válido
      console.log('El token de acceso no es válido');

      if (refreshToken) {
        try {
          const response = await axios.get('http://localhost:8000/usuario/refresh', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              refreshToken: refreshToken,
            }, // Enviar el accessToken en la cabecera de la solicitud
            withCredentials: true, // Enviar las cookies al servidor

        });

          const newAccessToken = response.data.accessToken;
          // Realiza las acciones necesarias con el nuevo accessToken

          res.setHeader('Authorization', `Bearer ${newAccessToken}`);
          next();
        } catch (error) {
          console.error(error);
          return res.sendStatus(401); // Error al obtener el nuevo accessToken
        }
      } else {
        return res.sendStatus(401); // No hay refreshToken disponible
      }
    } else {
      // El token de acceso es válido
      next();
    }
  });
};

function encryptData(data, key) {
  const encrypted = CryptoJS.AES.encrypt(data, key).toString();
  return encrypted;
}
