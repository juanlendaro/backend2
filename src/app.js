import express from 'express'
import productsRouter from './routes/products.js'
import cartsRouter from './routes/carts.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './routes/views.js'
import __dirname from './utils.js'
import { ProductManager } from './dao/fileSystem/productmanager.js'
import dbConnection from './config/dbConnections.js'
import chatModel from "./models/chat.js"



const app = express()
const PORT = 8080

dbConnection()

const productManager = new ProductManager()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/public', express.static(__dirname + '/public'))


app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

// iniciamos servidor

const httpServer = app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log('Escuchando puerto: ', PORT);
})

// websockets
httpServer.on

const socketServer = new Server(httpServer)

let productos
let mensajes

socketServer.on('connection', async socket => {
    console.log('Nuevo cliente conectado')
    try {
        productos = await productManager.getProducts()
        mensajes = await chatModel.find()
        socket.emit('mensajeServer', productos)
        socket.emit('mensajesChat', mensajes)
    } catch (error) {
        console.log(error)
    }

    socket.on('product', async data => {

        const {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnail
        } = data
        data.status = true
        console.log('data: ', data)

        if (!title || !description || !code || !price || !stock || !category) {
            console.log('Debe completar todos los campos');
        } else {
            try {
                await productManager.addProduct(data)
                let datos = await productManager.getProducts()
                socketServer.emit('productoAgregado', datos)
            } catch (error) {
                console.log(error)
            }
        }
    })

    socket.on('deleteProduct', async data => {
        try {
            await productManager.deleteProduct(data)
            let datos = await productManager.getProducts()
            socketServer.emit('productoEliminado', datos)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('msg', async data => {
        console.log(data);
        try {
            await chatModel.insertMany(data)
            let datos = await chatModel.find()
            socketServer.emit('newMsg', datos)
        } catch (error) {
            console.log(error)
        }
    })
})












// Desafío anterior:

// import { ProductManager } from '../productmanager.js'

// const app = express()
// const PORT = 8080
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
// const productManager = new ProductManager('./products.json');



// app.get("/products", async (req, res) => {
//     const { limit } = req.query
//     try {
//         const data = await productManager.getProducts()

//         limit ? res.send(data.filter(product => product.id <= limit)) : res.send(data)
//     } catch (error) {
//         console.log(error)
//     }
// })

// app.get("/products/:pid", async (req, res) => {
//     const pid = req.params.pid
//     try {
//         const data = await productManager.getProducts()

//         pid ? res.send(data.find(product => product.id == pid)) : res.send(data)
//     } catch (error) {
//         console.log(error)
//     }
// })


// app.listen(PORT, (err) => {
//     if (err) console.log(err)
//     console.log(`Escuchando puerto: ${PORT}`);
// })