import { Response, Request } from "express";
const waiterModel = require("../../../models/waiter");
const sendWaiterValidationCode = require("../../../services/validationcode");

interface AuthenticatedRequest extends Request {
  restaurantId?: {
    id: string;
  };
}

const waiterSignUp = async (req:AuthenticatedRequest, res:Response) => {
    try {
      const { firstname,lastname, email, phoneNumber} = req.body;

      const restaurantId = req.restaurantId?.id;
  
      if (!firstname || !lastname || !email || !phoneNumber) {
        console.log("Missing required field:", {
          firstname,
          lastname,
          email,
          phoneNumber,
          restaurantId,
        });
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const existingUser = await waiterModel.findOne({ email });
  
      if (existingUser) {
        return res.status(401).json({ message: "Waiter already exists" });
      }
      const validationcode = Math.floor(100000 + Math.random() * 900000).toString();

      const verificationCodeExpiration= Date.now() + 600000;


      const newWaiter = new waiterModel({
        firstname,
        lastname,
        email,
        restaurantId,
        phoneNumber,
        validationcode,
        verificationCodeExpiration
      });

    await newWaiter.save();
    
    await sendWaiterValidationCode(email,validationcode);
  
      res.status(200).json({ message: "Waiter created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error creating waiter" });
      console.log("Error occurred during signup of waiter:", error);
    }
  };

module.exports = waiterSignUp;