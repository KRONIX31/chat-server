import User from './models/user.js'
import Role from './models/role.js'
import bcrypt from 'bcryptjs'
import {validationResult} from 'express-validator'
import jwt from 'jsonwebtoken'
import secret from './config.js'

function generateAccesToken(id, roles){
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret.secret, {expiresIn: '24h'})
}
class authController{
    async registration(req, res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                const messages = []
                errors.errors.forEach((elem)=> messages.push(elem.msg))
                return res.status(400).json({message: messages})
            }
            const {username, password} = req.body
            const candidate = await User.findOne({username})
            if(candidate){
                return res.status(400).json({message: 'Такой ник уже занят другим пользователем'})
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, password: hashPassword, roles: userRole.value})
            await user.save()
            return res.json({message: 'регистрация прошла успешно'})
        } catch(e){
            console.log(e)
            res.status(400).json({message: "Возникла непредвиденная ошибка при регистрации"})
        }
    }

    async login(req, res){
        try{
            const {username, password} = req.body
            const user = await User.findOne({username})
            if(!user){
                return res.status(400).json({message: `хз кто это, монгус не нашел ${username}`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if(!validPassword){
                return res.status(400).json({message: 'не угадал пароль'})
            }
            const token = generateAccesToken(user._id, user.roles)
            return res.json({token})
        } catch(e){
            res.status(400).json({message: "Возникла непредвиденная ошибка при входе"})
        }
    }

    async getUsers(req, res){
        try{
            const users = await User.find()
            return res.json(users)
        } catch(e){
            console.log(e)
        }
    }
}

export default new authController()