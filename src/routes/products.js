import { Router } from 'express'
import productsModel from "../models/products.js"
import { MongoProductManager } from "../dao/mongoDB/mongoProductManager.js"
import { validate } from "../middleware/validation.js"

const router = Router()

const mongoProductManager = new MongoProductManager

router.get('/', async (req, res) => {
    const { limit, page = 1 } = req.query
    try {
        let data = await mongoProductManager.getProducts(limit)

        res.send(data.docs)
    } catch (error) {
        console.log(error)
    }
})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params
    try {
        const allProducts = await mongoProductManager.getProducts()
        const productById = await mongoProductManager.getProductById(pid)

        pid ? res.send(productById) : res.send(allProducts)
    } catch (error) {
        console.log(error)
    }
})

router.post('/', validate, async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body

    try {
        await mongoProductManager.addProduct(title, description, price, thumbnail, code, stock, status, category)

        res.send({ aviso: "producto agregado" })
    } catch (error) {
        console.log(error)
    }
})

router.put('/:pid', validate, async (req, res) => {
    const { pid } = req.params
    const { title, description, code, price, status, stock, category, thumbnail } = req.body

    let obj = { title, description, code, price, status, stock, category, thumbnail }
    try {
        await mongoProductManager.updateProduct(pid, obj)

        res.send({ aviso: "producto actualizado" })
    } catch (error) {
        console.log(error)
    }
})
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params

    try {
        await mongoProductManager.deleteProduct(pid)

        res.send({ aviso: "producto eliminado" })
    } catch (error) {
        console.log(error)
    }
})


export default router