import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";
import { appendUserToGoogleSheet } from "./sheetController.js";

/* 
  @route  : /api/user/register
  @method : POST
  @body   : { fname: , email: , password: , phone: }
  @description :
    * If the email is already in use, sends a 409 (Conflict) response.
    * In req.body, replaces the plaintext password with its hashed form.
    * Creates a new User document, and pushes it into the tasky-users collection.
*/
async function signUpController(req, res) {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        // Prohibit a user's double registration
        if (user) {
            return res.status(409).json({ message: "The User is already registered." });
        }

        req.body.password = await bcrypt.hash(password, 10); // Hash the password
        await new UserModel(req.body).save(); // Save the new User info in DB

        await appendUserToGoogleSheet(req.body);

        return res.status(200).json({ message: "User Registered Successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error. Try Again!" });
    }
}

/* 
  @route  : /api/user/login
  @method : POST
  @body   : { email: , password: }
  @description :
    * If the email or the password is invalid, then sends a 401 (Unauthorised) response.
    * For valid credentials, creates and sends a JWT.
*/
async function logInController(req, res) {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        // Verify Email
        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials!" });
        }
        // Verify Password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials!" });
        }
        // JWT Payload
        const payload = {
            id: user._id,
            email: user.email,
            phone: user.phone
        };
        const token = jwt.sign(payload, 'sherlock', { expiresIn: '1h' });

        return res.status(200).json({ message: "Logged In Successfully.", token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error. Try Again!" });
    }
}

/* 
  @route  : /api/user/all
  @method : GET
  @body   : {}
  @description :
    * fetches all users from mongoDB and appends to the google sheets
*/
async function getAllUsers(req,res) {
    try {
        const user = await UserModel.find({}, '-password -__v');

        await appendUserToGoogleSheet(user);
        
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error. Try Again!" });
    }
}

export { signUpController, logInController, getAllUsers };