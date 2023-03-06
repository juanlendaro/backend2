import { connect } from "mongoose"

const URL = 'mongodb+srv://juanlendaro:M2dgzW6gsZWauMKd@cluster0.0qmbkmb.mongodb.net/?retryWrites=true&w=majority'

const dbConnection = async () => {
    return await connect(URL, err => {
        if (err) {
            console.log('No se puede conectar mongodb: ', err)
            process.exit()
        }
        console.log('DB conectada ')
    })
}

export default dbConnection