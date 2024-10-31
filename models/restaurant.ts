require('mongoose');
const {Schema,model} = mongoose;

const AboutSchema = new Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  description: { type: String, required: true },
  averagePrice: { type: Number, required: true },
  hrsOfOperation: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

const MenuItemSchema = new Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  rate: { type: Number, required: true },
});

const ReviewSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  reviewTxt: { type: String, required: true },
  rating: { type: Number, required: true },
});

const MenuSchema = new Schema({
  breakfast: [MenuItemSchema],
  lunch: [MenuItemSchema],
  dinner: [MenuItemSchema],
});

const RestaurantDataSchema = new Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  image: { type: String, required: true },
  restaurantName: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  rate: { type: Number, required: true },
  about: [AboutSchema],
  menu: MenuSchema,
  review: [ReviewSchema]
});

const RestaurantSchema = new Schema({
  title: { type: String, required: true },
  data: [RestaurantDataSchema],
});

const Restaurant = model('Restaurant', RestaurantSchema);

module.exports = Restaurant;
