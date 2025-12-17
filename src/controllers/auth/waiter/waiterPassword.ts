import { Response, Request } from "express";
import { hashPassword } from "../../../lib/hashPassword";
const waiterModel = require("../../../models/waiter");

const waiterPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const hashedPassword = await hashPassword(password);

    const updatedWaiter = await waiterModel.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
        validationcode: "",
        validationcodeExpiration: "",
      },
      { new: true }
    );

    if (!updatedWaiter) {
      return res.status(404).json({ message: "Waiter not found" });
    }

    return res
      .status(200)
      .json({ message: "Waiter password created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = waiterPassword;
