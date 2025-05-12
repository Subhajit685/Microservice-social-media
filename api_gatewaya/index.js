import express, { urlencoded } from "express"
import cors from 'cors'
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()
const port = process.env.PORT

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(urlencoded({extended: true}))

// app.use((req, res, next)=>{
//   console.log(`${req.method} ${req.host} ${req.path}`)
//   next()
// })

app.use(
    "/user",
    proxy(process.env.USER, {
      proxyErrorHandler: (err, res, next) => {
        console.error("Proxy Error (User Service):", err);
        next(err);
      },
    })
);
app.use(
  "/post",
  proxy(process.env.POST, {
    proxyErrorHandler: (err, res, next) => {
      console.error("Proxy Error (Post Service):", err);
      next(err);
    },
  })
);

app.use(
    "/mess",
    proxy(process.env.MESS, {
      proxyErrorHandler: (err, res, next) => {
        console.error("Proxy Error (message Service):", err);
        next(err);
      },
    })
);

app.listen(port, async()=>{
    console.log(`Api gatewaya running at ${port}`)
})