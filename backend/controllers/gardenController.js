const { getCollection } = require('../utils/mockDb');

exports.getGarden = async (req, res) => {
  try {
    const gardens = getCollection('gardens');
    let garden = gardens.findOne({ userId: req.user.id });
    if (!garden) {
      garden = gardens.insertOne({
        userId: req.user.id,
        plants: [
          { type: 'flower', name: 'Seedling', icon: '🌱', x: 3, y: 5, plantedAt: new Date().toISOString(), lastWateredAt: new Date().toISOString(), isGrowing: true, growthStage: 0 },
        ],
        totalPlantsPlanted: 0,
        gardenScore: 0,
        lastMaintainedAt: new Date().toISOString(),
        isDry: false,
      });
    }
    res.status(200).json({ success: true, garden });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.plantItem = async (req, res) => {
  try {
    const { type, name, icon } = req.body;
    const gardens = getCollection('gardens');
    let garden = gardens.findOne({ userId: req.user.id });
    if (!garden) return res.status(404).json({ success: false, message: 'Garden not found. Start by visiting your garden!' });
    
    const newPlant = {
      type: type || 'flower',
      name: name || 'New Plant',
      icon: icon || '🌱',
      x: Math.floor(Math.random() * 8) + 1,
      y: Math.floor(Math.random() * 8) + 1,
      plantedAt: new Date().toISOString(),
      lastWateredAt: new Date().toISOString(),
      isGrowing: true,
      growthStage: 0,
    };
    gardens.updateOne({ userId: req.user.id }, { $push: { plants: newPlant }, $inc: { totalPlantsPlanted: 1, gardenScore: 10 } });
    res.status(200).json({ success: true, plant: newPlant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.waterGarden = async (req, res) => {
  try {
    const gardens = getCollection('gardens');
    const garden = gardens.findOne({ userId: req.user.id });
    if (!garden) return res.status(404).json({ success: false, message: 'Garden not found' });
    
    const now = new Date().toISOString();
    const updatedPlants = (garden.plants || []).map(p => ({
      ...p,
      lastWateredAt: now,
      growthStage: Math.min(3, (p.growthStage || 0) + 1),
    }));
    gardens.updateOne({ userId: req.user.id }, { $set: { plants: updatedPlants, isDry: false, lastMaintainedAt: now } });
    res.status(200).json({ success: true, message: '🌿 Garden watered!', garden: { ...garden, plants: updatedPlants, isDry: false } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};