import { Router } from "express"
import controller from './authController.js'
import { check } from "express-validator"
const router = new Router()


router.post('/registration',[
    check('username', 'поле никнейма не может быть пустым').notEmpty(),
    check('password', 'пароль должен иметь длину от 5 до 22 символов').isLength({min: 5, max: 22})
], controller.registration)
router.post('/login', controller.login)
router.get('/users', controller.getUsers)

export default router