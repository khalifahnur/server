import mongoose from "mongoose";
const { Schema, model } = mongoose;

const chairSchema = new Schema({
    id: { type: String, required: true },
    position: { type: String, required: true },
});

const tableSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    },
    rotation: { type: Number, required: true },
    shape: { type: String, required: true },
    size: {
        width: { type: Number, required: true },
        height: { type: Number, required: true },
    },
    chairs: [chairSchema],
    floorId: { type: String, required: true },
});

const restaurantLayoutSchema = new Schema({
    restaurantId:{type:String,require:true},
    diningAreas:{type:[String],require:true},
    totalTables:{type:Number,default:0},
    totalCapacity:{type:Number,default:0},
    tablePosition:{type:[tableSchema],default:[]}
})

const RestaurantLayout = model('RestaurantLayout', restaurantLayoutSchema);
module.exports = RestaurantLayout;