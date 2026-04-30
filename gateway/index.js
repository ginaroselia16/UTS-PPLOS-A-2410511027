require("dotenv").config()

const express = require("express")
const { createProxyMiddleware } = require("http-proxy-middleware")
const jwt = require("jsonwebtoken")
const cors = require("cors")

const app = express()
app.use(cors())

const PORT = process.env.PORT || 3000
const SECRET = process.env.JWT_SECRET
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL

const verifyToken = (req, res, next) => {
  console.log("AUTH HEADER:", req.headers.authorization) 

  if (req.path.startsWith("/auth")) return next()

  const authHeader = req.headers.authorization
  if (!authHeader) return res.sendStatus(401)

  const token = authHeader.split(" ")[1]

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.use(verifyToken)

app.use("/auth", createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/auth": ""
  }
}))

app.use("/employees", createProxyMiddleware({
  target: "http://127.0.0.1:8000",
  changeOrigin: true,

  pathRewrite: (path, req) => {
    const newPath = "/api/employees" + path
    console.log("➡️", path, "=>", newPath)
    return newPath
  },

  logLevel: "debug"
}))

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`)
})