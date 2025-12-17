"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hashPassword_1 = require("../../../lib/hashPassword");
const AdminAuth = require('../../../models/admin');
const signUpAdmin = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;
        console.log("Received request body:", req.body);
        if (!name || !email || !password || !phoneNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await AdminAuth.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ message: "User already exists" });
        }
        const hashedPassword = await (0, hashPassword_1.hashPassword)(password);
        const newUser = new AdminAuth({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
        });
        await newUser.save();
        res.status(200).json({ message: "User created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
};
module.exports = signUpAdmin;
//# sourceMappingURL=signup.js.map