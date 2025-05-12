import jwt from "jsonwebtoken";

const genTokenSetCookie = (id, res) => {
    const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "1d" });
    // console.log(token);

    res.cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
    });

    return token
};

export default genTokenSetCookie;
