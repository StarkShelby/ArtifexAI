import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import connectDB from './mongodb/connect.js'
import postRoutes from './Routes/postRoutes.js'
import openai from './Routes/openai.js'


dotenv.config()

const app = express();


app.use(cors({
  origin: 'https://artifex-ai-fawn.vercel.app',  // My frontend domain
  credentials: true
}))
app.use(express.json({limit: '50mb'}))

app.use('/api/v1/post', postRoutes)
app.use('/api/v1/openai',openai)

app.get('/',async(req,res) => {
    res.send('Hello from OpenAI')
})

const startServer = async ()=>{
    try {
        connectDB(process.env.MONGODB_URL)

        app.listen(8080,()=>
            console.log('server has started on port http://localhost:8080✅')
        )
    } catch (error) {
        console.log(error)
        
    }
}
startServer()