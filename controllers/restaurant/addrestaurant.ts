import { Request, Response } from 'express';

const Restaurant = require('../../models/restaurant');
const AdminAuth = require('../../models/admin');

// Define an interface for the request body
interface InitialRestaurantData {
  title: string;
  data: {
    image: string;
    restaurantName: string;
    location: string;
    latitude: number;
    longitude: number;
    rate: number;
    about: {
      description: string;
      averagePrice: number;
      hrsOfOperation: string;
      phone: string;
      email: string;
    }[];
  }[];
}

// Define an extended request type with `user`
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const addRestaurantData = async (req: AuthenticatedRequest, res: Response) => {
  const { title, data } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const newRestaurant = new Restaurant({ title, data });
    const savedRestaurant = await newRestaurant.save();

    // Access user ID from req.user
    const userId = req.user?.id;

    if (userId) {
      await AdminAuth.findByIdAndUpdate(userId, { restaurantId: savedRestaurant._id });
    }

    res.status(201).json({
      message: 'Restaurant data added successfully',
      restaurant: savedRestaurant,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding restaurant data', error });
  }
};

module.exports = addRestaurantData;
