import { Request, Response } from 'express';

const Restaurant = require('../../models/restaurant')

const updateMenuItemCost = async (req: Request, res: Response) => {
  const { id, menuType, itemId } = req.params;
  const { cost } = req.body;

  // Validate the cost
  if (cost === undefined || typeof cost !== 'number') {
    return res.status(400).json({ message: 'Invalid or missing cost' });
  }

  try {
    // Determine the correct path based on menuType
    let updatePath;
    if (menuType === 'breakfast') {
      updatePath = 'data.0.menu.0.breakfast';
    } else if (menuType === 'lunch') {
      updatePath = 'data.0.menu.0.lunch';
    } else if (menuType === 'dinner') {
      updatePath = 'data.0.menu.0.dinner';
    } else {
      return res.status(400).json({ message: 'Invalid menu type' });
    }

    // Find the restaurant document and update only the cost of the specific menu item
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      {
        _id: id,
        [`${updatePath}._id`]: itemId // Match the specific menu item by its ID
      },
      {
        $set: {
          [`${updatePath}.$.cost`]: cost // Update only the cost field of the matched menu item
        }
      },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant or menu item not found' });
    }

    res.status(200).json({ message: 'Menu item cost updated successfully', restaurant: updatedRestaurant });
  } catch (error) {
    console.error('Error updating menu item cost:', error);
    res.status(500).json({ message: 'Error updating menu item cost', error });
  }
};

module.exports =  updateMenuItemCost;
