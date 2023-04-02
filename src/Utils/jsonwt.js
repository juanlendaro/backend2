import jwt from "jesonwebtoken"

export const PRIVATE_KEY = 'CoderKeyQueFuncionaComoUnSecret'

const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24hs' })
    return token
}

const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.status(401).json({ status: 'error', error: 'not authenticated' })
    }

    const token = authHeader.split('')[1]

    jwt.verify(token, PRIVATE_KEY, (error, credential) => {
        if (error) {
            return res.status(403).json({ status: 'error', error: 'Not authorized' })
        }
        req.user = credential.user
        next()
    })
}
