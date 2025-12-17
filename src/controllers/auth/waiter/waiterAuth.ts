import { Response, Request } from "express";
const waiterModel = require("../../../models/waiter");

const waiterAuthentication = async (req: Request, res: Response) => {
    try {
        const { email, validationcode } = req.body;

        if (!email || !validationcode) {
            return res.status(400).json({ message: 'Email and Verification Code are required!' });
        }
        const waiterData = await waiterModel.findOne({ email });

        if (!waiterData) {
            return res.status(404).json({ message: "Waiter not found" });
        }

        const verify = waiterData.validationcode === validationcode;

        if (!verify) {
            return res.status(401).json({ message: "Verification code is incorrect or expired!" });
        }
        return res.status(200).json({ message: "Successfully signed up", waiterData });

    } catch (error) {
        console.error("Error in waiterAuthentication:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = waiterAuthentication;