import jwt from 'jsonwebtoken';

// Generate JWT
export const generateToken = (userData) => {
    return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" });
  };

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).send({ message: '401 Unauthorized' })

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send({ message: '403 Forbidden' })
        req.user = user
        next()
    })
}


export const checkAccess = (permission) => {
    return (req, res, next) => {
        const userRole = req.user.role.toUpperCase()
        if (!permission.includes(userRole)) {
            return res.status(401).send({ message: 'You do not have permission' } )
        }
        if (req.user && req.user.id !== req.params.userId && userRole === permission[1]) {
            return res.status(401).send({ message: 'You do not have permission to view/update other users detail' } )
        }
        if (req.user && req.user.id === req.params.userId && req.method === 'DELETE') {
            return res.status(401).send({ message: 'You do not have permission to view/update other users detail' } )
        }
        if (req.body.role && userRole === permission[1]) {
            return res.status(401).send({ message: 'You do not have permission to update the role' } )
        }
        next()
    }
}