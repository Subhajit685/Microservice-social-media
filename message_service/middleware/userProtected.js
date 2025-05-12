import jwt from "jsonwebtoken"

const userProtected = async(req, res, next) =>{
    try {
        const token =
            req.cookies.token ||
            (req.headers.authorization && req.headers.authorization.split(" ")[1]);

        if(!token){
            return res.status(400).json({success : false, message : "User not authenticated"})
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY)

        if(!decode){
            return res.status(400).json({success : false, message : "Invalid token"})
        }

        const user = decode.id

        if(!user){
            return res.status(400).json({success : false, message : "User not found"})
        }

        req.user = user
        next()
    } catch (error) {
        console.log("userProtected",error)
        return res.status(500).json({success : false, message : "Internal server error on userProtected"})
    }
}

export default userProtected