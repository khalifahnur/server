import { Request, Response } from 'express';

const Restaurant = require('../../models/restaurant');

const deleteMenuItem = async (req: Request, res: Response) => {
  const { id, menuType, itemId } = req.params;

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

    // Use $pull to remove the specific item from the menu array
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      {
        $pull: {
          [updatePath]: { _id: itemId } // Remove the item with the matching itemId
        }
      },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant or menu item not found' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully', restaurant: updatedRestaurant });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Error deleting menu item', error });
  }
};

module.exports = deleteMenuItem;
