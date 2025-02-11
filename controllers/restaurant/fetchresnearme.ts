import { Request, Response } from "express";
import calculateDistance from "../../lib/CalculateDistance";
const Restaurant = require("../../models/restaurant");

const fetchrestaurantnearme = async (req: Request, res: Response) => {
  const { latitude, longitude } = req.body;

  const radius = 5;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required." });
  }

  try {
    const restaurants = await Restaurant.find();

    const nearbyRestaurants = restaurants.filter((restaurant: any) =>
      restaurant.data.some((data: any) => {
        const distance = calculateDistance({
          lat1: parseFloat(latitude),
          lon1: parseFloat(longitude),
          lat2: data.latitude,
          lon2: data.longitude,
        });
        //console.log(distance)
        return distance <= radius;
      })
    );
    res.status(200).json(nearbyRestaurants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurants." });
  }
};

module.exports = fetchrestaurantnearme;
