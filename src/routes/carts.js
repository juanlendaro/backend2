import { Router } from 'express'
import { ProductManager } from '../productmanager.js'
import { CartManager } from '../cartmanager.js'

const router = Router()

const productManager = new ProductManager()
const cartManager = new CartManager()

router.post('/', async (req, res) => {
    await cartManager.createCart()
    res.send({ mensaje: 'Carrito creado' })
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params

    try {
        const cartProducts = await cartManager.getCartProducts(cid)

        res.send({
            mensaje: `Productos por id: ${cid}`,
            productos: cartProducts.products
        })
    } catch (error) {
        console.log(error);
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params

    try {
        await cartManager.addToCart(cid, pid)
        res.send({ mensaje: 'Producto agregado al carrito' })
    } catch (error) {
        console.log(error);
    }
})

export default router