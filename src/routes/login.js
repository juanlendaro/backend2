import { Router } from "express";

const router = Router()

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        if (username !== 'adminCoder@coder.com' || password !== 'adminCod3r123') {
            req.session.user = username
            req.session.admin = true
            req.session.usuario = false
            console.log('usted es usuario')
            res.redirect('http://localhost:8080/products')
        } else {
            req.session.user = username
            req.session.admin = false
            req.session.usuario = true
            console.log('usted es admin')
            res.redirect('http://localhost:8080/products')
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/logout', async (req, res) => {
    try {
        req.session.destroy(err => {
            if (!err) res.redirect('http://localhost:8080/auth')
            else res.send({ status: 'Logout error', message: err })
        })
    } catch (error) {
        console.log(error)
    }
})

export default router