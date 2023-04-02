import passport from "passport"
import { Router } from "express"
import { userVali } from "../middleware/userValidation.js"
import { MongoUserManager } from "../dao/mongoDB/MongoUserManager.js"
import { createHash, isValidPassword } from "../Utils/bcrypt.js"

const router = Router()

const mongoUserManager = new MongoUserManager

// Client ID: Iv1.1c69d9c201ddaadf
// Secrect Client : 447cb6bd9a59b392f40a6b3f9b3a91454e3475ca

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), async (req, res) => {
    const { username, password } = req.body

    try {

        if (username !== 'adminCoder@coder.com' || password !== 'adminCod3r123') {
            req.session.user = username
            req.session.admin = false
            req.session.usuario = true
            console.log('usted es usuario')
            res.redirect('http://localhost:8080/products')
        } else {
            req.session.user = username
            req.session.admin = true
            req.session.usuario = false
            console.log('usted es admin')
            res.redirect('http://localhost:8080/products')
        }
    } catch (error) {
        console.log(error)
    }
})

router.get('/faillogin', (req, res) => {
    res.send({ status: 'error', message: 'fallo el login' })
})

router.post('/register', userVali, passport.authenticate('register', { failureRedirect: '/auth/failregister' }), async (req, res) => {
    try {
        res.redirect('http://localhost:8080/auth/login')
    } catch (error) {
        console.log(error)
    }
})

router.get('/failregister', (req, res) => {
    res.send({ status: 'error', message: 'fallo el registro' })
})

router.post('/logout', async (req, res) => {
    try {
        req.session.destroy(err => {
            if (!err) res.redirect('http://localhost:8080/auth/login')
            else res.send({ status: 'Logout error', message: err })
        })
    } catch (error) {
        console.log(error)
    }
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    console.log('req: ', req.user)
    req.session.user = req.user.first_name
    req.session.admin = false
    req.session.usuario = true
    res.redirect('http://localhost:8080/products')
})



export default router