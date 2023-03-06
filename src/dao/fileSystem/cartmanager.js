import fs from 'fs'

export class CartManager {
    #ruta = './src/cart.json'
    constructor() {
        this.products = []
        this.path = this.#ruta
    }

    getCartProducts = async (cid) => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8')
                const productDb = JSON.parse(data);
                const cart = productDb[parseInt(cid) - 1]
                return cart;
            }
            await fs.promises.writeFile(this.path, '[]', 'utf-8')
            return ['carrito vacío']
        } catch (error) {
            console.log(error);
        }
    }

    createCart = async () => {
        const cart = {}

        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const cartDb = JSON.parse(data)

            cart.id = cartDb[cartDb.length - 1].id + 1
            cart.products = []
            cartDb.push(cart)

            await fs.promises.writeFile(this.path, `${JSON.stringify(cartDb, null, '\t')}`, 'utf-8')
        } else {
            cart.id = 1
            cart.products = []
            const cartArray = [cart]

            await fs.promises.writeFile(this.path, `${JSON.stringify(cartArray, null, '\t')}`, 'utf-8')
        }
    }

    addToCart = async (cid, pid) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const cartDb = JSON.parse(data)
            const cart = cartDb[parseInt(cid) - 1]
            const idx = cart.products.findIndex(product => product.id === parseInt(pid))
            if (idx !== -1) {
                const product = cart.products[idx]
                console.log(product);
                product.quantity++
                cart.products[idx] = product
            } else {
                const product = {}
                product.id = parseInt(pid)
                product.quantity = 1
                cart.products = [...cart.products, product]
            }

            cartDb[parseInt(cid) - 1] = cart

            await fs.promises.writeFile(this.path, JSON.stringify(cartDb, null, '\t'), 'utf-8')
        } catch (error) {
            console.log(error);
        }
    }

}