const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  type: { type: String, enum: ['flower', 'tree', 'bush', 'vegetable', 'fruit_tree', 'waterfall', 'bird', 'butterfly'], required: true },
  name: String,
  icon: String,
  x: Number,
  y: Number,
  plantedAt: Date,
  lastWateredAt: Date,
  isGrowing: { type: Boolean, default: true },
  growthStage: { type: Number, default: 0 },
});

const GardenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  plants: [PlantSchema],
  totalPlantsPlanted: { type: Number, default: 0 },
  gardenScore: { type: Number, default: 0 },
  lastMaintainedAt: Date,
  isDry: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Garden', GardenSchema);