import { Request, Response } from 'express';

const Restaurant = require('../../models/restaurant');

// Define an interface for the request body to ensure type safety
interface NewMenuItem {
  name: string;
  description: string;
  cost: number;
  rate: number;
  image: string;
}

const addMenu = async (req: Request, res: Response) => {
  const { id, menuType } = req.params;
  const newMenuItem: NewMenuItem = req.body;
  console.log(id,menuType,newMenuItem)

  // Validate the input
  if (!newMenuItem || !newMenuItem.name || !newMenuItem.cost) {
    return res.status(400).json({ message: 'Invalid menu item data' });
  }

  try {
    // Determine the correct path based on menuType
    let updatePath;
    if (menuType === 'breakfast') {
      updatePath = 'data.0.menu.breakfast';
    } else if (menuType === 'lunch') {
      updatePath = 'data.0.menu.lunch';
    } else if (menuType === 'dinner') {
      updatePath = 'data.0.menu.dinner';
    } else {
      return res.status(400).json({ message: 'Invalid menu type' });
    }

    // Update the restaurant document
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $set: { [updatePath]: newMenuItem } }, // Use $push to add the new item to the specified array
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(201).json({ message: 'Menu item added successfully', restaurant: updatedRestaurant });
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ message: 'Error adding menu item', error });
  }
};

module.exports = addMenu;
