import express from 'express'
import mongoose from 'mongoose'
import authRouter from './authRouter.js'
import bodyParser from 'body-parser'
const PORT = process.env.PORT || 5000
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/auth', authRouter)

const start = async ()=>{
    try{
        mongoose.connect('mongodb+srv://KRONIX:admin@chat.yqya3tt.mongodb.net/?retryWrites=true&w=majority')
        app.listen(PORT, ()=> console.log(`server started on port ${PORT}`))
    } catch(e){
        console.log(e)
    }
}
start()