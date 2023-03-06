import { Router } from "express";
import { ProductManager } from "../dao/fileSystem/productmanager.js"

import chatModel from "../models/chat.js"

const router = Router()

const productManager = new ProductManager

router.get('/products', async (req, res) => {
    try {
        const productos = await productManager.getProducts()
        let datos = {
            productos
        }

        res.render('home', datos)
    } catch (error) {
        console.log(error)
    }

})

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts')
})

router.get('/chat', (req, res) => {
    res.render('chat')
})

export default router