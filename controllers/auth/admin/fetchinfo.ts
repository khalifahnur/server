import { Request, Response } from 'express';

const Admin = require("../../../models/admin");
const Restaurant = require("../../../models/restaurant");

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const getAdminInfo = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    try {
      if (!userId) {
        return res.status(400).json({ error: "User not authenticated" });
      }
  
      const adminInfo = await Admin.findById(userId);
      if (!adminInfo) {
        return res.status(404).json({ error: "Admin info not found" });
      }
  
      // Fetch restaurant info using restaurantId from adminInfo
      const restaurantId = adminInfo.restaurantId; // Assuming restaurantId is stored in adminInfo
      const restaurantInfo = await Restaurant.findById(restaurantId);
  
      if (!restaurantInfo) {
        return res.status(404).json({ error: "Restaurant info not found" });
      }
  
      // Access the first element of the data array
      const restaurantData = restaurantInfo.data[0]; // Get the first restaurant data object
      const aboutInfo = restaurantData.about[0] || {}; // Get the first about entry
  
      const responseData = {
        name: adminInfo.name,
        email: adminInfo.email,
        phoneNumber: adminInfo.phoneNumber,
        restaurantName: restaurantData.restaurantName,
        location: restaurantData.location,
        image: restaurantData.image,
        hrsOfOperation: aboutInfo.hrsOfOperation || null, // Default to null if not available
        description: aboutInfo.description || null, // Default to null if not available
        phone: aboutInfo.phone || null, // Default to null if not available
        restaurantEmail: aboutInfo.email || null, // Default to null if not available
      };
  
      res.status(200).json(responseData);
    } catch (error) {
      console.error("Error fetching admin info:", error);
      res.status(500).json({ error: "Server error" });
    }
};

module.exports = getAdminInfo;