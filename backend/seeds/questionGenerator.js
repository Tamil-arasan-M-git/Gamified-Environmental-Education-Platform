/**
 * Programmatic Question Generator with difficulty-specific pools
 * Generates 200 easy, 200 medium, 200 hard questions per category
 */
const crypto = require('crypto');

const categories = ['trees', 'water', 'earth', 'recycling', 'animals', 'energy', 'oceans', 'plants'];

const questionTemplates = {
  'multiple-choice': [
    { template: 'What is the main benefit of {topic}?', correct: 0 },
    { template: 'Which of the following is true about {topic}?', correct: 0 },
    { template: 'How does {topic} help the environment?', correct: 0 },
    { template: 'Where can we find {topic}?', correct: 0 },
    { template: 'Why is {topic} important?', correct: 0 },
    { template: 'What happens when {topic} {action}?', correct: 0 },
    { template: 'How can we protect {topic}?', correct: 0 },
    { template: 'What is {topic} made of?', correct: 0 },
    { template: 'Which animal is related to {topic}?', correct: 0 },
    { template: 'What color is {topic} typically?', correct: 0 },
  ],
  'true-false': [
    { statement: '{topic} is important for the environment.', answer: true },
    { statement: '{topic} does not affect our daily lives.', answer: false },
    { statement: 'We should protect {topic}.', answer: true },
    { statement: '{topic} is harmful to nature.', answer: false },
    { statement: 'Everyone can help conserve {topic}.', answer: true },
    { statement: '{topic} can be found everywhere on Earth.', answer: true },
    { statement: '{topic} is not important for animals.', answer: false },
    { statement: 'Learning about {topic} helps us protect the planet.', answer: true },
    { statement: '{topic} needs to be conserved.', answer: true },
    { statement: 'Only adults should care about {topic}.', answer: false },
  ],
  'fill-blank': [
    { template: '{topic} is important for ______.' },
    { template: 'We should ______ {topic}.' },
    { template: '{topic} helps keep our planet ______.' },
    { template: '______ is the study of {topic}.' },
    { template: '{topic} provides ______ for living things.' },
  ],
};

const knowledge = {
  trees: {
    name: 'Trees', icon: '🌳',
    easyTopics: ['Oak Tree', 'Pine Tree', 'Mango Tree', 'Coconut Tree', 'Banana Tree', 'Apple Tree', 'Neem Tree', 'Banyan Tree', 'Palm Tree', 'Maple Tree'],
    medTopics: ['Evergreen Forest', 'Deciduous Forest', 'Rainforest Canopy', 'Tree Bark Functions', 'Root Systems', 'Leaf Types', 'Tree Rings', 'Forest Layers', 'Seed Dispersal', 'Tree Habitats'],
    hardTopics: ['Photosynthesis Process', 'Carbon Sequestration', 'Mycorrhizal Networks', 'Forest Succession', 'Tree Genetics', 'Dendrochronology', 'Forest Carbon Cycle', 'Tropical Ecology', 'Silviculture', 'Forest Pathology'],
    wrong1: ['Water', 'Air', 'Soil', 'Rocks', 'Buildings', 'Plastic', 'Glass', 'Metal', 'Paper', 'Wood'],
    wrong2: ['Seaweed', 'Coral', 'Sand', 'Wind', 'Sunlight', 'Clouds', 'Rain', 'Snow', 'Ice', 'Fire'],
    wrong3: ['Deserts', 'Ice', 'Mountains', 'Fire', 'Volcanoes', 'Rain', 'Oceans', 'Caves', 'Cities', 'Roads'],
    locations: ['Forests', 'Parks', 'Mountains', 'Gardens', 'Jungles', 'Woodlands', 'Valleys', 'Hills', 'Rainforests', 'Savannas'],
    colors: ['Green', 'Brown', 'Yellow', 'Orange', 'Red', 'Gold', 'Purple', 'White', 'Pink', 'Crimson'],
    animals: ['Birds', 'Squirrels', 'Monkeys', 'Insects', 'Deer', 'Owls', 'Woodpeckers', 'Butterflies', 'Bees', 'Sloths'],
    facts: [
      'Trees absorb CO2 and release oxygen through photosynthesis',
      'One tree can produce enough oxygen for 4 people',
      'Trees can communicate through underground fungal networks',
      'The oldest tree is over 5,000 years old',
      'Forests cover about 31% of Earth\'s land',
      'Trees reduce air pollution by trapping particles',
      'Tree roots can extend as wide as the tree is tall',
      'A mature tree can absorb 48 pounds of CO2 per year',
      'Trees provide habitat for 80% of biodiversity',
      'Planting trees helps prevent soil erosion'
    ]
  },
  water: {
    name: 'Water', icon: '💧',
    easyTopics: ['Oceans', 'Rivers', 'Lakes', 'Rain', 'Clouds', 'Ice', 'Snow', 'Ponds', 'Streams', 'Waterfalls'],
    medTopics: ['Water Cycle', 'Groundwater', 'Glaciers', 'Aquifers', 'Watersheds', 'Water Table', 'Estuaries', 'Wetlands', 'Reservoirs', 'Dams'],
    hardTopics: ['Ocean Acidification', 'Hydrothermal Vents', 'Water Treatment', 'Desalination', 'Marine Ecosystems', 'Hydrology', 'Ocean Currents', 'Thermohaline Circulation', 'El Nino', 'Aquifer Recharge'],
    wrong1: ['Trees', 'Fire', 'Sand', 'Air', 'Rocks', 'Ice', 'Metal', 'Plastic', 'Glass', 'Wood'],
    wrong2: ['Plastic', 'Glass', 'Metal', 'Paper', 'Wood', 'Cloth', 'Rubber', 'Ceramic', 'Concrete', 'Brick'],
    wrong3: ['Mountains', 'Deserts', 'Caves', 'Volcanoes', 'Buildings', 'Roads', 'Bridges', 'Tunnels', 'Cities', 'Farms'],
    locations: ['Oceans', 'Rivers', 'Lakes', 'Clouds', 'Glaciers', 'Ground', 'Ponds', 'Streams', 'Seas', 'Reservoirs'],
    colors: ['Blue', 'Clear', 'Green', 'White', 'Cyan', 'Turquoise', 'Teal', 'Azure', 'Navy', 'Cerulean'],
    animals: ['Fish', 'Whales', 'Dolphins', 'Frogs', 'Turtles', 'Crustaceans', 'Seals', 'Octopus', 'Jellyfish', 'Coral'],
    facts: [
      'Only 1% of Earth\'s water is drinkable',
      'Water covers 71% of Earth\'s surface',
      'The same water has been cycling for billions of years',
      'A human can survive 3 days without water',
      'Water is the only substance found in all three states naturally',
      '97% of Earth\'s water is salt water',
      'Groundwater is 30% of fresh water',
      'A dripping tap wastes 20 liters per day',
      'Rainwater harvesting can save thousands of liters',
      'Oceans produce 50% of Earth\'s oxygen'
    ]
  },
  earth: {
    name: 'Earth', icon: '🌍',
    easyTopics: ['Mountains', 'Volcanoes', 'Soil', 'Rocks', 'Continents', 'Oceans', 'Deserts', 'Forests', 'Plains', 'Islands'],
    medTopics: ['Tectonic Plates', 'Earthquakes', 'Erosion', 'Weathering', 'Fossils', 'Minerals', 'Caves', 'Sedimentary Rocks', 'Igneous Rocks', 'Metamorphic Rocks'],
    hardTopics: ['Plate Tectonics Theory', 'Earth\'s Core', 'Mantle Convection', 'Seismic Waves', 'Geological Time Scale', 'Rock Cycle', 'Continental Drift', 'Soil Formation', 'Mineral Crystallization', 'Subduction Zones'],
    wrong1: ['Trees', 'Water', 'Air', 'Fire', 'Ice', 'Sand', 'Clouds', 'Wind', 'Rain', 'Snow'],
    wrong2: ['Plastic', 'Glass', 'Metal', 'Paper', 'Wood', 'Cloth', 'Rubber', 'Ceramic', 'Concrete', 'Brick'],
    wrong3: ['Stars', 'Moon', 'Sun', 'Planets', 'Comets', 'Asteroids', 'Galaxies', 'Nebulas', 'Black Holes', 'Meteors'],
    locations: ['Continents', 'Islands', 'Mountains', 'Valleys', 'Plains', 'Plateaus', 'Deserts', 'Forests', 'Tundras', 'Grasslands'],
    colors: ['Brown', 'Green', 'Blue', 'White', 'Gray', 'Red', 'Yellow', 'Orange', 'Purple', 'Black'],
    animals: ['Humans', 'Birds', 'Mammals', 'Reptiles', 'Amphibians', 'Fish', 'Insects', 'Dinosaurs', 'Worms', 'Microorganisms'],
    facts: [
      'Earth is the third planet from the Sun',
      'Earth has a diameter of 12,742 km',
      'Earth\'s atmosphere is 78% nitrogen',
      'The Earth\'s core is as hot as the Sun\'s surface',
      'Earth is the only known planet with life',
      'The Earth rotates at 1,670 km/h',
      'Earth has one natural satellite - the Moon',
      'The Earth\'s magnetic field protects us',
      'Earth\'s oldest rocks are 4.4 billion years old',
      'The Earth\'s surface is 71% water'
    ]
  },
  recycling: {
    name: 'Recycling', icon: '♻️',
    easyTopics: ['Plastic', 'Paper', 'Glass', 'Metal', 'Cardboard', 'Organic Waste', 'Cans', 'Bottles', 'Jars', 'Bags'],
    medTopics: ['Composting', 'Waste Sorting', 'Landfills', 'Incinerators', 'E-Waste', 'Hazardous Waste', 'Biodegradable', 'Non-Biodegradable', 'Waste Management', 'Circular Economy'],
    hardTopics: ['Life Cycle Assessment', 'Recycling Technologies', 'Waste-to-Energy', 'Plastic Pyrolysis', 'Material Recovery', 'Industrial Ecology', 'Zero Waste Systems', 'Extended Producer Responsibility', 'Upcycling', 'Resource Efficiency'],
    wrong1: ['Trees', 'Water', 'Air', 'Soil', 'Rocks', 'Sand', 'Clouds', 'Wind', 'Rain', 'Fire'],
    wrong2: ['Reuse', 'Reduce', 'Repair', 'Rot', 'Refuse', 'Rethink', 'Regift', 'Recover', 'Rent', 'Rebuild'],
    wrong3: ['Mountains', 'Oceans', 'Deserts', 'Forests', 'Cities', 'Roads', 'Bridges', 'Tunnels', 'Farms', 'Gardens'],
    locations: ['Homes', 'Schools', 'Offices', 'Factories', 'Recycling Centers', 'Landfills', 'Compost Bins', 'Collection Points', 'Drop-off Centers', 'Depots'],
    colors: ['Green', 'Blue', 'Yellow', 'Red', 'Brown', 'White', 'Gray', 'Silver', 'Gold', 'Clear'],
    animals: ['Worms', 'Bacteria', 'Fungi', 'Crows', 'Rats', 'Insects', 'Birds', 'Fish', 'Bears', 'Raccoons'],
    facts: [
      'A plastic bottle takes 450 years to decompose',
      'Recycling one can saves enough energy for 3 hours of TV',
      'Glass can be recycled infinitely',
      'Paper can be recycled 5-7 times',
      'Composting reduces methane from landfills',
      'E-waste is the fastest growing waste stream',
      'Recycling reduces CO2 emissions',
      'One ton of recycled paper saves 17 trees',
      'Aluminum can be recycled forever',
      'Only 9% of plastic is actually recycled'
    ]
  },
  animals: {
    name: 'Animals', icon: '🐯',
    easyTopics: ['Dogs', 'Cats', 'Elephants', 'Tigers', 'Lions', 'Bears', 'Monkeys', 'Birds', 'Fish', 'Horses'],
    medTopics: ['Endangered Species', 'Food Chains', 'Habitats', 'Migration', 'Hibernation', 'Camouflage', 'Adaptation', 'Predator-Prey', 'Herbivores', 'Carnivores'],
    hardTopics: ['Biodiversity Hotspots', 'Animal Behavior', 'Evolution', 'Ecosystem Dynamics', 'Conservation Biology', 'Wildlife Corridors', 'Keystone Species', 'Ecological Niches', 'Population Genetics', 'Animal Cognition'],
    wrong1: ['Trees', 'Water', 'Air', 'Soil', 'Rocks', 'Plants', 'Sun', 'Moon', 'Stars', 'Clouds'],
    wrong2: ['Cars', 'Books', 'Phones', 'Tables', 'Chairs', 'Houses', 'Bridges', 'Roads', 'Computers', 'Clothes'],
    wrong3: ['Mountains', 'Oceans', 'Deserts', 'Forests', 'Caves', 'Rivers', 'Lakes', 'Plains', 'Jungles', 'Arctic'],
    locations: ['Forests', 'Oceans', 'Deserts', 'Grasslands', 'Mountains', 'Polar Regions', 'Rainforests', 'Savannas', 'Caves', 'Coral Reefs'],
    colors: ['Brown', 'Black', 'White', 'Golden', 'Gray', 'Spotted', 'Striped', 'Green', 'Blue', 'Red'],
    animals: ['Lions', 'Tigers', 'Bears', 'Wolves', 'Eagles', 'Sharks', 'Whales', 'Dolphins', 'Cheetahs', 'Gorillas'],
    facts: [
      'There are 8.7 million species on Earth',
      'Only 1.2 million species have been identified',
      'Animals need food, water, shelter, and space',
      'Some animals can regenerate body parts',
      'Birds are the only animals with feathers',
      'Fish were the first animals with backbones',
      'Mammals are warm-blooded vertebrates',
      'Insects make up 80% of animal species',
      'The blue whale is the largest animal ever',
      'Animals help maintain ecosystem balance'
    ]
  },
  energy: {
    name: 'Energy', icon: '⚡',
    easyTopics: ['Sunlight', 'Wind', 'Water', 'Fire', 'Electricity', 'Heat', 'Light', 'Sound', 'Motion', 'Batteries'],
    medTopics: ['Solar Power', 'Wind Energy', 'Hydro Power', 'Nuclear Energy', 'Fossil Fuels', 'Geothermal', 'Biomass', 'Tidal Energy', 'Wave Energy', 'Hydrogen Fuel'],
    hardTopics: ['Photovoltaic Cells', 'Wind Turbine Design', 'Grid Integration', 'Energy Storage', 'Smart Grids', 'Carbon Capture', 'Nuclear Fusion', 'Energy Efficiency', 'Renewable Integration', 'Sustainable Energy Systems'],
    wrong1: ['Trees', 'Water', 'Air', 'Soil', 'Rocks', 'Plants', 'Animals', 'Birds', 'Fish', 'Insects'],
    wrong2: ['Plastic', 'Glass', 'Metal', 'Paper', 'Wood', 'Cloth', 'Rubber', 'Ceramic', 'Concrete', 'Brick'],
    wrong3: ['Slow', 'Heavy', 'Dark', 'Cold', 'Quiet', 'Dry', 'Soft', 'Smooth', 'Round', 'Flat'],
    locations: ['Sun', 'Wind Farms', 'Dams', 'Power Plants', 'Solar Panels', 'Wind Turbines', 'Rivers', 'Oceans', 'Geothermal Vents', 'Nuclear Reactors'],
    colors: ['Yellow', 'Blue', 'Orange', 'Red', 'White', 'Silver', 'Green', 'Gold', 'Purple', 'Clear'],
    animals: ['None', 'Birds near turbines', 'Fish near dams', 'Bats', 'Insects', 'Marine life', 'Polar bears', 'Elephants', 'Whales', 'Dolphins'],
    facts: [
      'The sun gives enough energy in 1 hour for Earth for a year',
      'Fossil fuels take millions of years to form',
      'Wind energy is one of the fastest growing sources',
      'Solar panels convert sunlight directly to electricity',
      'Hydro power is the most used renewable energy',
      'Energy cannot be created or destroyed',
      'LED bulbs use 75% less energy than incandescent',
      'Nuclear power produces no CO2 during operation',
      'Geothermal energy comes from Earth\'s heat',
      'Energy conservation is the cheapest form of energy'
    ]
  },
  oceans: {
    name: 'Oceans', icon: '🌊',
    easyTopics: ['Fish', 'Whales', 'Dolphins', 'Sharks', 'Coral', 'Seaweed', 'Shells', 'Ships', 'Beaches', 'Waves'],
    medTopics: ['Coral Reefs', 'Ocean Zones', 'Tides', 'Currents', 'Marine Food Web', 'Deep Sea', 'Coastal Erosion', 'Ocean Pollution', 'Overfishing', 'Marine Conservation'],
    hardTopics: ['Ocean Acidification', 'Thermohaline Circulation', 'Marine Biology', 'Ocean Chemistry', 'Sea Level Rise', 'Plastic Gyres', 'Coral Bleaching', 'Marine Protected Areas', 'Blue Carbon', 'Ocean Ecosystems'],
    wrong1: ['Trees', 'Mountains', 'Deserts', 'Forests', 'Caves', 'Buildings', 'Roads', 'Bridges', 'Farms', 'Gardens'],
    wrong2: ['Plastic', 'Glass', 'Metal', 'Paper', 'Wood', 'Cloth', 'Rubber', 'Ceramic', 'Concrete', 'Brick'],
    wrong3: ['Air', 'Fire', 'Ice', 'Sand', 'Rock', 'Soil', 'Clay', 'Dust', 'Ash', 'Smoke'],
    locations: ['Pacific', 'Atlantic', 'Indian', 'Arctic', 'Southern', 'Coral Reefs', 'Deep Sea', 'Coastal Areas', 'Open Ocean', 'Ocean Floor'],
    colors: ['Blue', 'Green', 'Turquoise', 'Teal', 'Navy', 'Azure', 'Cyan', 'Purple', 'Black', 'White'],
    animals: ['Whales', 'Dolphins', 'Sharks', 'Fish', 'Coral', 'Jellyfish', 'Sea Turtles', 'Octopus', 'Starfish', 'Seahorses'],
    facts: [
      'The ocean covers 71% of Earth\'s surface',
      'The ocean contains 97% of Earth\'s water',
      'The deepest point is the Mariana Trench at 11km',
      'The ocean produces over 50% of the world\'s oxygen',
      'Only 5% of the ocean has been explored',
      'Coral reefs are the rainforests of the sea',
      'The Pacific Ocean is the largest ocean',
      'Over 3 billion people depend on marine biodiversity',
      'The ocean absorbs 30% of human CO2 emissions',
      'Marine species are threatened by plastic pollution'
    ]
  },
  plants: {
    name: 'Plants', icon: '🌱',
    easyTopics: ['Flowers', 'Leaves', 'Roots', 'Stems', 'Seeds', 'Fruits', 'Vegetables', 'Grass', 'Moss', 'Ferns'],
    medTopics: ['Photosynthesis', 'Germination', 'Pollination', 'Plant Life Cycle', 'Tropisms', 'Plant Adaptations', 'Seed Dispersal', 'Nitrogen Cycle', 'Soil Nutrients', 'Plant Reproduction'],
    hardTopics: ['Light-independent Reactions', 'Plant Hormones', 'Cellular Respiration', 'Transpiration', 'Plant Genetics', 'Phytoremediation', 'Plant Pathology', 'Allelopathy', 'Mycorrhizae', 'Epiphytes'],
    wrong1: ['Animals', 'Rocks', 'Water', 'Air', 'Soil', 'Fire', 'Ice', 'Sand', 'Dust', 'Ash'],
    wrong2: ['Plastic', 'Glass', 'Metal', 'Paper', 'Wood', 'Cloth', 'Rubber', 'Ceramic', 'Concrete', 'Brick'],
    wrong3: ['Mountains', 'Oceans', 'Deserts', 'Cities', 'Roads', 'Bridges', 'Tunnels', 'Farms', 'Gardens', 'Buildings'],
    locations: ['Gardens', 'Forests', 'Deserts', 'Mountains', 'Oceans', 'Tundras', 'Rainforests', 'Grasslands', 'Wetlands', 'Urban Areas'],
    colors: ['Green', 'Red', 'Yellow', 'Purple', 'Orange', 'Pink', 'White', 'Blue', 'Brown', 'Black'],
    animals: ['Bees', 'Butterflies', 'Birds', 'Bats', 'Insects', 'Worms', 'Mice', 'Deer', 'Rabbits', 'Squirrels'],
    facts: [
      'Plants convert sunlight into energy through photosynthesis',
      'There are over 390,000 plant species',
      'The Amazon rainforest has the most plant diversity',
      'Some plants can live for thousands of years',
      'Plants provide 80% of human food',
      'Bamboo is the fastest growing plant',
      'Plants communicate through chemical signals',
      '90% of plants depend on animals for pollination',
      'The Venus flytrap eats insects',
      'Plants help regulate the climate'
    ]
  }
};

/**
 * Generate questions for a specific category, difficulty, and count
 */
function generateQuestions(category, difficulty = 'easy', count = 200) {
  const cat = knowledge[category];
  if (!cat) return [];
  
  const questions = [];
  const topics = difficulty === 'easy' ? cat.easyTopics : (difficulty === 'medium' ? cat.medTopics : cat.hardTopics);
  const prefixes = ['Why do we need', 'What is special about', 'Tell me about', 'Explain', 'Describe', 'What makes', 'How do'];
  const questionTypes = ['multiple-choice', 'true-false', 'fill-blank'];

  for (let i = 0; i < count; i++) {
    const topic = topics[i % topics.length];
    const type = questionTypes[i % questionTypes.length];
    const prefix = prefixes[i % prefixes.length];
    const fact = cat.facts[i % cat.facts.length];

    let q;
    if (type === 'multiple-choice') {
      q = {
        id: crypto.randomBytes(6).toString('hex'),
        question: `${prefix} ${topic}?`,
        type: 'multiple-choice',
        difficulty,
        category,
        options: [
          fact,
          cat.wrong1[i % cat.wrong1.length],
          cat.wrong2[i % cat.wrong2.length],
          cat.wrong3[i % cat.wrong3.length]
        ],
        correctAnswer: 0,
        explanation: fact,
        isActive: true,
        xpReward: difficulty === 'hard' ? 15 : difficulty === 'medium' ? 12 : 10,
      };
    } else if (type === 'true-false') {
      const isTrue = i % 2 === 0;
      q = {
        id: crypto.randomBytes(6).toString('hex'),
        question: isTrue ? `${topic} ${cat.facts[i % cat.facts.length].toLowerCase()}` : `${topic} does not affect the environment`,
        type: 'true-false',
        difficulty,
        category,
        options: ['True', 'False'],
        correctAnswer: isTrue ? 0 : 1,
        explanation: fact,
        isActive: true,
        xpReward: difficulty === 'hard' ? 15 : difficulty === 'medium' ? 12 : 10,
      };
    } else {
      q = {
        id: crypto.randomBytes(6).toString('hex'),
        question: `${topic} is important for ______.`,
        type: 'fill-blank',
        difficulty,
        category,
        answer: cat.facts[i % cat.facts.length].split(' ').slice(0, 3).join(' '),
        options: ['the environment', 'all living things', 'nature', 'our planet', 'everyone'],
        correctAnswer: 0,
        explanation: fact,
        isActive: true,
        xpReward: difficulty === 'hard' ? 15 : difficulty === 'medium' ? 12 : 10,
      };
    }
    questions.push(q);
  }
  return questions;
}

/**
 * Generate all questions for seeding database
 */
function generateAllQuestions() {
  let all = [];
  for (const cat of Object.keys(knowledge)) {
    all = all.concat(generateQuestions(cat, 'easy', 200));
    all = all.concat(generateQuestions(cat, 'medium', 200));
    all = all.concat(generateQuestions(cat, 'hard', 200));
  }
  return all;
}

module.exports = { generateAllQuestions, generateQuestions, knowledge };