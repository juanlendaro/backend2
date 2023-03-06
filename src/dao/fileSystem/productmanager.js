import fs from 'fs'

export class ProductManager {
    #path = './src/products.json'
    constructor(path) {
        this.products = []
        this.path = this.#path
    }


    addProduct = async (newProduct) => {
        // if (newProduct.title === '' || newProduct.description === '' || newProduct.price === '' || newProduct.thumbnail === '' || newProduct.code === '' || newProduct.stock === '') {
        //     return console.log(`Complete todos los campos por favor`)
        // }
        let productDb = await this.getProducts()
        const data = await productDb.find(product => product.code === newProduct.code)
        try {
            if (data) {
                return console.log(`El código de producto ya existe`)
            }
            if (productDb.length === 0) {
                newProduct.id = 1
                productDb.push(newProduct)
            } else {
                productDb = [...productDb, { ...newProduct, id: productDb[productDb.length - 1].id + 1 }]
            }
            fs.promises.writeFile(this.path, JSON.stringify(productDb, null, '\t'))
            console.log('Producto agregado');
        } catch (error) {
            console.log(error);
        }

    }
    getProducts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8')
                const productDb = JSON.parse(data);
                return productDb;
            }
            await fs.promises.writeFile(this.path, '[]', 'utf-8')
            return []
        } catch (error) {
            console.log(error);
        }
    }

    getProductById = async (id) => {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const productDb = JSON.parse(data).find(product => product.id === id)
        if (!productDb) {
            return console.log(`No existe producto con el id: ${id}`)
        }
        return console.log(productDb)
    }
    updateProduct = async (id, updateField) => {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const productDb = await JSON.parse(data)
        const index = await productDb.findIndex(product => product.id === id)
        if (index === -1) {
            return console.log(`No existe producto con el id: ${id}`)
        }
        productDb[index] = { ...updateField, id: productDb[index].id }
        fs.promises.writeFile(this.path, JSON.stringify(productDb, null, '\t'))
        console.log('Producto actualizado');
    }
    deleteProduct = async (id) => {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const productDb = await JSON.parse(data)
        const index = await productDb.findIndex(product => product.id === id)
        if (index === -1) {
            return console.log(`No existe producto con el id: ${id}`)
        }
        productDb.splice(index, 1)
        fs.promises.writeFile(this.path, JSON.stringify(productDb, null, '\t'))
        console.log('Producto eliminado');
    }
}



// productManager.addProduct({
//     title: "producto prueba",
//     description: "Este  es un producto prueba",
//     price: 200,
//     thumbnail: "Sin imagen",
//     code: 1,
//     stock: 25,
// })
// productManager.addProduct({
//     title: "producto prueba2",
//     description: "Este  es un segundo producto prueba",
//     price: 250,
//     thumbnail: "Sin imagen",
//     code: 2,
//     stock: 30,
// })
