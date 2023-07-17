import {Sequelize} from 'sequelize'

const db = new Sequelize('wasters', 'root' , '(Topgear)12',{
    host:'localhost',
    dialect: 'mysql',
    })

export default db