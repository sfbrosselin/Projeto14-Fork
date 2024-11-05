express = require('express')
require('dotenv').config()
PORT = process.env.PORT || 8000
const cors = require('cors')
const app = express()
const pool = require('./db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
app.use(cors())
app.use(express.json())

// cadastro

app.post('/signup', async (req, res) => {
    const {name, email, password} = req.body
    const salt =  await bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    try{
        const signup = await pool.query('INSERT INTO users (user_email, user_name, user_password) VALUES($1, $2, $3)',[email, name, hashedPassword])

        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })

        const userId = await pool.query('SELECT id FROM users WHERE user_email = $1', [email])

        res.json({ email, token, name, 'id': userId.rows[0].id  })
    }catch(err){
        console.error(err)
        if(err) {
            res.json({ detail: err.detail })
        }
    }
})

// dados de reciclagem 

app.get('/profile/:email', async (req, res) => {
    const profile_email = req.params.email
    try{
        const data = await pool.query('SELECT qntplastico, qntvidro, qntpapel, qntmetal FROM userprofile WHERE profile_email = $1', [profile_email])
        res.json({ data: data.rows[0]})
    }catch(err){
        console.error(err)
    }
})
// login 


app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try{
        const users = await pool.query('SELECT * FROM users WHERE user_email = $1', [email])

        if (!users.rows.length) return res.json({ detail: 'User does not exist'})

        const success = await bcrypt.compare(password, users.rows[0].user_password)
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })

        if(success){
            res.json({ 'email': users.rows[0].user_email, token, 'name': users.rows[0].user_name, 'id': users.rows[0].id})
        }
        else{
            res.json({ detail: 'Login failed' })
        }
    }catch(err){
        console.error(err)
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})