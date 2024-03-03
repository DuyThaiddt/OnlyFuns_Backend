import { authRepo } from "../repository/index.js";


/** 
 * @des Register an account
 * @author Trịnh Minh Phúc
 * @date 29/1/2024
 * @param {username, email, password} req
 * @param {} res
 * @returns 
 */
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;     
        const result = await authRepo.registerUser(username, email, password);
        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.toString()
        });
    }
};
/** 
 * @des Log in to your account
 * @author Trịnh Minh Phúc
 * @date 29/1/2024
 * @param {username,  password} req
 * @param {*} res
 * @returns 
 */
const loginUser = async (req, res) => {
    try {
        const { username,  password } = req.body;  
        const result = await authRepo.loginUser(username,password,res)
        if(result.error){
            return res.status(result.status).json({message:result.error})
        }
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            message: error.toString()
        });
    }
}

/** 
 * @des Account authentication
 * @author Trịnh Minh Phúc
 * @date 30/1/2024
 * @param {verificationCode} req
 * @param {*} res
 * @returns 
 */
const verifyUser= async (req, res) => {
    try {
        const { verificationCode } = req.body;
        const result = await authRepo.verifyUser(verificationCode)
        if(result.error){
            return res.status(result.status).json({message:result.error})
        }
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: error.toString() });
    }
}
/**
 * Verifies the refresh token and sends the result as a JSON response.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Promise<void>} A Promise that resolves to sending a JSON response
 */
const verifyRefreshToken = async (req, res) => {
    try {
        if (!req.cookies || !req.cookies.refToken) {
            return res.status(400).json({ message: "Không có refreshToken trong cookie" });
        }
        const { refToken } = req.cookies;
        const result = await authRepo.verifyRefreshToken(refToken);
        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.toString() });
    }
};

const logout = async (req, res) => {
    const { refToken } = req.cookies;
    const result = await authRepo.logout(refToken);

    if (result) {
        // Nếu logout thành công
        res.clearCookie('refToken');
        res.status(200).json({ message: "Logout successful" });
    } else {
        // Nếu có lỗi xảy ra hoặc refreshToken không tồn tại
        res.clearCookie('refToken');
        res.status(400).json({ message: "Logout failed. Please try again." });
    }
};


export default {registerUser, loginUser,verifyUser,verifyRefreshToken, logout};