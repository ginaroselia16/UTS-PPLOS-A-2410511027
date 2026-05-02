require("dotenv").config()
const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cors = require("cors")
const axios = require("axios") // ⬅️ tambahan OAuth

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3001
const SECRET = process.env.JWT_SECRET

let users = []
let refreshTokens = []

app.post("/register", async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: "Username & password wajib" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = {
    id: Date.now(),
    username,
    password: hashedPassword
  }

  users.push(user)

  res.json({ message: "User registered" })
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body

  const user = users.find(u => u.username === username)
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ message: "Password salah" })

  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    SECRET,
    { expiresIn: "15m" }
  )

  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    SECRET,
    { expiresIn: "7d" }
  )

  refreshTokens.push(refreshToken)

  res.json({ accessToken, refreshToken })
})

app.post("/refresh", (req, res) => {
  const { token } = req.body
  if (!token) return res.sendStatus(401)

  if (!refreshTokens.includes(token)) return res.sendStatus(403)

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403)

    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      SECRET,
      { expiresIn: "15m" }
    )

    res.json({ accessToken })
  })
})

app.post("/logout", (req, res) => {
  const { token } = req.body
  refreshTokens = refreshTokens.filter(t => t !== token)

  res.json({ message: "Logout berhasil" })
})

app.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.sendStatus(401)

  const token = authHeader.split(" ")[1]

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    res.json({ message: "Akses berhasil", user })
  })
})


app.get("/github", (req, res) => {
  const client_id = process.env.GITHUB_CLIENT_ID
  const redirect_uri = "http://localhost:3001/github/callback"

  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}`
  )
})

app.get("/github/callback", async (req, res) => {
  const code = req.query.code

  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code
      },
      {
        headers: { Accept: "application/json" }
      }
    )

    const accessToken = response.data.access_token

    res.json({
      message: "Login GitHub berhasil",
      accessToken
    })

  } catch (err) {
    res.status(500).json({ error: "OAuth gagal", detail: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`)
})