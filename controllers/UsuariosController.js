//importamos el Modelo
import usuariosModel from "../models/UsuariosModel.js"
//** Métodos para el CRUD **/
import randomstring from "randomstring";
import sendMail from "../helpers/sendMail.js";
import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();
//Mostrar todos los registros
export const getAllUsuarios = async (req, res) => {
  try {
    const Usuarios = await usuariosModel.findAll()
    res.json(Usuarios)
  } catch (error) {
    res.json({ message: error.message })
  }
}
//Mostrar un registro
export const getUsuario = async (req, res) => {
  try {
    const Usuarios = await usuariosModel.findAll({
      where: { email: req.params.email }
    });
    if(Usuarios.length > 0){

    res.json(Usuarios[0]);
    }else{
      res.json({message:"El usuario no existe"})
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};


//Crear un registro
export const createUsuario = async (req, res) => {
  try {
    let pasar = await usuariosModel.create(req.body);

    let mailSubject = "Verificación de cuenta";
    const randomToken = randomstring.generate(64);
    let content = `
      <div>
        <img src="http://example.com/token-image?token=${randomToken}" alt="Token Image" style="display:block; margin:0 auto;">
      </div>
      <div>
        <h1>¡Bienvenido a WASTERS, ${req.body.nombre}!</h1>
        <p>Por favor, verifica tu correo electrónico para completar el proceso de registro.</p>
        <p>Haz clic en el siguiente enlace para verificar tu correo:</p>
        <p><a href="http://localhost:8000/usuario/verificar/${randomToken}">Verificar correo electrónico</a></p>
      </div>
    `;

    await sendMail(req.body.email, mailSubject, content);
    const update = usuariosModel.update({ token: randomToken }, {
      where: { id: pasar.dataValues.id }
    })
    res.json({
      "message": "¡Registro actualizado correctamente!"
    })
  } catch (error) {
    res.json({ message: error.message })
  }
}
//Actualizar un registro
export const updateUsuario = async (req, res) => {
  try {
    await usuariosModel.update(req.body, {
      where: { ID: req.params.ID }
    })
    res.json({
      "message": "¡Registro actualizado correctamente!"
    })
  } catch (error) {
    res.json({ message: error.message })
  }
}
//Eliminar un registro
export const deleteUsuario = async (req, res) => {
  try {
    await usuariosModel.destroy({
      where: { ID: req.params.ID }
    })
    res.json({
      "message": "¡Registro eliminado correctamente!"
    })
  } catch (error) {
    res.json({ message: error.message })
  }


}

export const verificarUsuario = async (req, res) => {
  try {
    const Usuarios = await usuariosModel.findAll({
      where: { token: req.params.token }
    })
    if (Usuarios.length > 0) {
      await usuariosModel.update({ verificado: true }, {
        where: { token: req.params.token }
      })
      res.redirect("http://localhost:3000/login")
    } else {
      res.json({ message: "El usuario no existe" })
    }
  } catch (error) {
    res.json({ message: error.message })
  }
}


export const loginUsuario = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.json({ message: "Por favor, ingrese todos los campos" });
  }

  const Usuarios = await usuariosModel.findAll({
    where: { email: email },
  });

  if (Usuarios.length > 0) {
    const match = await bcrypt.compare(password, Usuarios[0].contrasena);
    if (match) {
      const accessToken = jwt.sign(
        { username: Usuarios[0].nombre },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { username: Usuarios[0].nombre },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      await usuariosModel.update(
        { RefreshToken: refreshToken },
        {
          where: { email: email },
        }
      );

      const encryptedAccessToken = encryptData(
        accessToken,
        "2f39e0e1a84904c8f6edfd1bc9721d3d"
      );
      const encryptedRefreshToken = encryptData(
        refreshToken,
        "2f39e0e1a84904c8f6edfd1bc9721d3d"
      );
      // Generar la cookie en la respuesta
      res.cookie("TOKENWST", encryptedRefreshToken, {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Caduca en 1 día
        httpOnly: true, // La cookie solo es accesible desde el servidor
        secure: true, // Solo se enviará la cookie a través de HTTPS si se está utilizando HTTPS en el servidor
      });

      res.json({ encryptedAccessToken, encryptedRefreshToken });
    } else {
      res.json({ message: "Contraseña incorrecta" });
    }
  } else {
    res.json({ message: "El usuario no existe" });
  }
};
export const handleRefreshToken = async (req, res) => {

  const refreshToken = req.headers.refreshtoken; // Obtener el refreshToken de la cookie


  if (!refreshToken) {
    return res.status(401).json({ message: "No se encontró ninguna cookie" });
  }

  try {
    // Verificar si el refreshToken es válido y obtener los datos decodificados
    const decrpyRefreshToken = decryptData(refreshToken, "2f39e0e1a84904c8f6edfd1bc9721d3d");


    const decoded = jwt.verify(decrpyRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const { username } = decoded;
    // Buscar al usuario en la base de datos usando el refreshToken
    const usuario = await usuariosModel.findOne({
      where: { RefreshToken: decrpyRefreshToken },
    });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el refreshToken almacenado en la base de datos coincide con el refreshToken de la cookie
    if (usuario.RefreshToken !== decrpyRefreshToken) {
      return res.status(401).json({ message: "El refreshToken no es válido23" });
    }

    // Generar un nuevo accessToken
    const accessToken = jwt.sign(
      { username: usuario.nombre },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const encryptedAccessToken = encryptData(accessToken, "2f39e0e1a84904c8f6edfd1bc9721d3d");

    res.json(encryptedAccessToken);
  } catch (err) {
    return res.status(401).json({ message: "El refreshToken no es válido" });
  }
};


function encryptData(data, key) {
  const encrypted = CryptoJS.AES.encrypt(data, key).toString();
  return encrypted;
}
function decryptData(encryptedData, key) {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
  const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
  return decryptedData;
}

export const getcookie = async (req, res) => {
  res.send(req.cookies.TOKENWST);
}


export const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await usuariosModel.findAll({
    where: { RefreshToken: refreshToken }
  });
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  await usuariosModel.update({ RefreshToken: "" }, {
    where: { RefreshToken: refreshToken }
  })

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.sendStatus(204);
}

export const getUsuarioByCryptedRefreshToken = async (req, res) => {
  console.log(req.body.refreshToken + "entra")
  const refreshToken = decryptData(req.body.refreshToken, "2f39e0e1a84904c8f6edfd1bc9721d3d");
  console.log("pasa")
  const usuario = await usuariosModel.findOne({
    where: { RefreshToken: refreshToken },
  });
  if(usuario){
    res.json(usuario)
  }else{
    res.json({message: "No encontrado"})
  }

}


export const comprobarUsuario = async (req, res, next) => {
  const refreshToken = req.cookies.TOKENWST;
  const accessToken = req.headers['authorization']?.split(' ')[1];
  const decrpyAccessToken = decryptData(accessToken, "2f39e0e1a84904c8f6edfd1bc9721d3d");


  jwt.verify(decrpyAccessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      // El token de acceso no es válido
      if (refreshToken) {
        try {
          const response = await axios.get('http://localhost:8000/usuario/refresh', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              refreshToken: refreshToken,
            }, // Enviar el accessToken en la cabecera de la solicitud
            withCredentials: true, // Enviar las cookies al servidor

          });

          const newAccessToken = response.data;
          // Realiza las acciones necesarias con el nuevo accessToken
          res.setHeader('Authorization', `Bearer ${newAccessToken}`);
          res.json(newAccessToken)
        } catch (error) {
          console.error(error);
          res.send("fuera") // Error al obtener el nuevo accessToken
        }
      } else {
        res.send("fuera") // No hay refreshToken disponible
      }
    } else {
      // El token de acceso es válido
      res.send("OK")
    }
  });
};



