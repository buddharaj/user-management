
// export  const hasAccessToken = (req, res, next) => {
//     return (req, res, next) => {
//         return res.sendStatus(401).json("You don't have permission")
//         if (!req.headers['access_token']) return res.sendStatus(401).json("You don't have permission")
//         next()
//     }
// }

// // get role from database for current use and check if he can access or not this url
// export  const hasAdminAccess = async (req, res, next) => {
//     const access_token = req.headers['access_token']
//     console.log(result)
//     return res.status(200).send( result )
//     // return (req, res, next) => {
        
//     //     if (!access_token) return res.sendStatus(401).json("You don't have permission")
//     //     next()
//     // }
// }

// export  const hasUserAccess = async (req, res, next) => {
//     const access_token = req.headers['access_token']
//     const connection = await connectDbPool.getConnection()
//     const [ result ] = await connection.query(`SELECT role FROM user WHERE access_token = ? limit 1`, [access_token])
//     if (!result.length) {
//         return res.status(400).send( { 'error': 'User does not exists'} )
//     }
//     console.log(result)
//     return res.status(200).send( result )

//     // return (req, res, next) => {
        
//     //     if (!access_token) return res.sendStatus(401).json("You don't have permission")
//     //     next()
//     // }
// }
