import { Router } from 'express'
import { ProductManager } from '../dao/fileSystem/productmanager.js'
import { CartManager } from '../dao/fileSystem/cartmanager.js'
import { MongoCartManager } from "../dao/mongoDB/MongoCartManager.js"
import productsModel from "../models/products.js"
const router = Router()

const productManager = new ProductManager()
const cartManager = new CartManager()
const mongoCartManager = new MongoCartManager

router.post('/', async (req, res) => {
    await mongoCartManager.createCart()

    res.send({ mensaje: "carrito creado" })
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params
    let arrPC = []
    try {
        const cartProducts = await mongoCartManager.getCartProducts(cid)

        await cartProducts.products.forEach(async product => {
            try {
                let producto = await productsModel.findOne({ pid: product.pid })

                producto.cantidad = product.quantity

                arrPC = [...arrPC, producto]

                if (arrPC.length == cartProducts.products.length) {
                    res.send(arrPC)
                }
            } catch (error) {
                console.log(error)
            }
        })
    } catch (error) {
        console.log(error)
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params

    try {
        await mongoCartManager.uploadProduct(cid, pid)

        res.send({ mensaje: "producto agregado al carrito" })

    } catch (error) {
        console.log(error)
    }
})

export default router