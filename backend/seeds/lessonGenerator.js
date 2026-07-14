/**
 * Complete Lesson Generator - 30 real lessons per category × 26 categories = 780 lessons
 * Uses template-based generation with real educational content
 */
const crypto = require('crypto');

const CATS = {
  trees: { name: 'Trees', icon: '🌳', color: '#4CAF50', diff: 'beginner' },
  water: { name: 'Water', icon: '💧', color: '#2196F3', diff: 'beginner' },
  earth: { name: 'Earth', icon: '🌍', color: '#795548', diff: 'beginner' },
  animals: { name: 'Animals', icon: '🐯', color: '#FF9800', diff: 'beginner' },
  plants: { name: 'Plants', icon: '🌱', color: '#8BC34A', diff: 'beginner' },
  forests: { name: 'Forests', icon: '🏞️', color: '#2E7D32', diff: 'intermediate' },
  birds: { name: 'Birds', icon: '🦅', color: '#42A5F5', diff: 'beginner' },
  insects: { name: 'Insects', icon: '🐝', color: '#FFA726', diff: 'beginner' },
  oceans: { name: 'Oceans', icon: '🌊', color: '#00BCD4', diff: 'intermediate' },
  fish: { name: 'Fish', icon: '🐟', color: '#26C6DA', diff: 'beginner' },
  coral: { name: 'Coral Reefs', icon: '🪸', color: '#FF4081', diff: 'intermediate' },
  energy: { name: 'Energy', icon: '⚡', color: '#FFEB3B', diff: 'intermediate' },
  solar: { name: 'Solar Energy', icon: '☀️', color: '#FDD835', diff: 'intermediate' },
  wind: { name: 'Wind Energy', icon: '💨', color: '#81D4FA', diff: 'intermediate' },
  hydro: { name: 'Hydro Energy', icon: '🌊', color: '#4FC3F7', diff: 'advanced' },
  recycling: { name: 'Recycling', icon: '♻️', color: '#9C27B0', diff: 'beginner' },
  plastic: { name: 'Plastic Pollution', icon: '🧴', color: '#EF5350', diff: 'intermediate' },
  waste: { name: 'Waste Management', icon: '🗑️', color: '#78909C', diff: 'intermediate' },
  climate: { name: 'Climate', icon: '🌤️', color: '#607D8B', diff: 'advanced' },
  weather: { name: 'Weather', icon: '⛅', color: '#90CAF9', diff: 'beginner' },
  air: { name: 'Air Pollution', icon: '💨', color: '#B0BEC5', diff: 'intermediate' },
  soil: { name: 'Soil', icon: '🏔️', color: '#8D6E63', diff: 'intermediate' },
  habitats: { name: 'Habitats', icon: '🏡', color: '#66BB6A', diff: 'beginner' },
  foodchain: { name: 'Food Chain', icon: '🐛', color: '#FF7043', diff: 'intermediate' },
  biodiversity: { name: 'Biodiversity', icon: '🦋', color: '#AB47BC', diff: 'advanced' },
  greentech: { name: 'Green Technology', icon: '💡', color: '#26A69A', diff: 'advanced' },
  protection: { name: 'Environmental Protection', icon: '🛡️', color: '#EC407A', diff: 'intermediate' },
};

const TOPIC_POOLS = {
  trees: ['What is a Tree', 'Parts of a Tree', 'Types of Trees', 'How Trees Grow', 'Tree Life Cycle', 'Tree Roots', 'Tree Leaves', 'Tree Bark', 'Tree Flowers', 'Tree Seeds', 'Fruit Trees', 'Evergreen Trees', 'Deciduous Trees', 'Rainforest Trees', 'Mangrove Trees', 'Urban Trees', 'Medicinal Trees', 'Tree Products', 'Trees and Animals', 'Trees and Climate', 'Forest Ecosystem', 'Tree Plantation', 'Tree Conservation', 'Oldest Trees', 'Tallest Trees', 'Tree Rings', 'Photosynthesis', 'Endangered Trees', 'Famous Forests', 'Trees and You'],
  water: ['What is Water', 'Water Cycle', 'Properties of Water', 'States of Water', 'Oceans', 'Rivers', 'Lakes', 'Rain', 'Snow and Ice', 'Groundwater', 'Glaciers', 'Waterfalls', 'Drinking Water', 'Water Conservation', 'Water Pollution', 'Water Treatment', 'Saving Water', 'Rainwater Harvesting', 'Water in Our Body', 'Water and Plants', 'Water and Animals', 'Water Ecosystems', 'Wetlands', 'Estuaries', 'Water Temperature', 'Water Density', 'Water Pressure', 'Water Quality', 'Clean Water Access', 'Water Future'],
  earth: ['Planet Earth', 'Earth Structure', 'Earth\'s Crust', 'Earth\'s Mantle', 'Earth\'s Core', 'Continents', 'Mountains', 'Volcanoes', 'Earthquakes', 'Rocks and Minerals', 'Soil Types', 'Erosion', 'Weathering', 'Fossils', 'Earth\'s Atmosphere', 'Earth\'s Magnetic Field', 'Day and Night', 'Seasons', 'Earth\'s Orbit', 'Gravity', 'Plate Tectonics', 'Rock Cycle', 'Caves', 'Deserts', 'Islands', 'Earth from Space', 'Protecting Earth', 'Natural Resources', 'Earth\'s History', 'Earth\'s Future'],
  animals: ['What are Animals', 'Mammals', 'Birds', 'Reptiles', 'Amphibians', 'Fish', 'Insects', 'Herbivores', 'Carnivores', 'Omnivores', 'Animal Habitats', 'Animal Adaptations', 'Animal Communication', 'Animal Migration', 'Hibernation', 'Camouflage', 'Endangered Species', 'Extinct Animals', 'Domestic Animals', 'Wild Animals', 'Nocturnal Animals', 'Animal Life Cycles', 'Animal Families', 'Animal Senses', 'Animal Movement', 'Animal Homes', 'Animal Food', 'Animal Babies', 'Animal Protection', 'Animals and Humans'],
  plants: ['What are Plants', 'Plant Parts', 'Roots', 'Stems', 'Leaves', 'Flowers', 'Seeds', 'Fruits', 'How Plants Grow', 'Photosynthesis', 'Germination', 'Pollination', 'Seed Dispersal', 'Plant Life Cycle', 'Types of Plants', 'Trees', 'Shrubs', 'Herbs', 'Climbers', 'Creepers', 'Aquatic Plants', 'Desert Plants', 'Medicinal Plants', 'Edible Plants', 'Plant Adaptations', 'Plant Nutrition', 'Plant Reproduction', 'Carnivorous Plants', 'Plant Conservation', 'Plants and Humans'],
  forests: ['What is a Forest', 'Forest Layers', 'Tropical Forests', 'Temperate Forests', 'Boreal Forests', 'Forest Ecosystem', 'Forest Plants', 'Forest Animals', 'Forest Birds', 'Forest Insects', 'Forest Soil', 'Forest Water Cycle', 'Forest Food Web', 'Forest Products', 'Deforestation', 'Reforestation', 'Afforestation', 'Forest Fires', 'Forest Conservation', 'Forest Management', 'Sacred Forests', 'Cloud Forests', 'Mangrove Forests', 'Forest Biodiversity', 'Forest Climate', 'Forest People', 'Forest Restoration', 'Forest Monitoring', 'Forest Policy', 'Forest Future'],
  birds: ['What are Birds', 'Bird Anatomy', 'Bird Feathers', 'Bird Wings', 'Bird Beaks', 'Bird Feet', 'Bird Songs', 'Bird Nests', 'Bird Eggs', 'Bird Migration', 'Birds of Prey', 'Water Birds', 'Forest Birds', 'Garden Birds', 'Tropical Birds', 'Penguins', 'Parrots', 'Owls', 'Eagles', 'Hummingbirds', 'Bird Communication', 'Bird Courtship', 'Bird Parenting', 'Bird Conservation', 'Endangered Birds', 'Bird Watching', 'Birds in Culture', 'Birds and Ecosystem', 'Backyard Birds', 'Protecting Birds'],
  insects: ['What are Insects', 'Insect Body', 'Ants', 'Bees', 'Butterflies', 'Beetles', 'Dragonflies', 'Grasshoppers', 'Mosquitoes', 'Ladybugs', 'Insect Life Cycle', 'Metamorphosis', 'Insect Habitats', 'Insect Food', 'Insect Senses', 'Insect Communication', 'Social Insects', 'Beneficial Insects', 'Harmful Insects', 'Insect Adaptations', 'Camouflage in Insects', 'Insect Migration', 'Insect Conservation', 'Bees and Pollination', 'Butterfly Garden', 'Insects in Food Chain', 'Insects and Humans', 'Rare Insects', 'Insect Research', 'Protecting Insects'],
  oceans: ['What are Oceans', 'Five Oceans', 'Ocean Zones', 'Ocean Floor', 'Ocean Currents', 'Waves and Tides', 'Ocean Temperature', 'Ocean Salinity', 'Marine Life', 'Ocean Plants', 'Ocean Animals', 'Coral Reefs', 'Deep Sea', 'Ocean Food Web', 'Ocean Resources', 'Ocean Pollution', 'Plastic in Ocean', 'Overfishing', 'Ocean Conservation', 'Marine Protected Areas', 'Ocean Climate', 'El Nino', 'Ocean Exploration', 'Famous Oceans', 'Ocean Biodiversity', 'Ocean Acidification', 'Sea Level Rise', 'Ocean and Weather', 'Ocean Economy', 'Ocean Future'],
  fish: ['What are Fish', 'Fish Anatomy', 'Fish Scales', 'Fish Fins', 'Fish Gills', 'Freshwater Fish', 'Saltwater Fish', 'Tropical Fish', 'Cold Water Fish', 'Game Fish', 'Small Fish', 'Large Fish', 'Colorful Fish', 'Fish Behavior', 'Fish Migration', 'Fish Reproduction', 'Fish Life Cycle', 'Fish Food', 'Fish Habitats', 'Coral Reef Fish', 'Deep Sea Fish', 'Endangered Fish', 'Fish Conservation', 'Fish in Ecosystem', 'Fish and Humans', 'Aquarium Fish', 'Fish Farming', 'Fish Research', 'Amazing Fish', 'Protecting Fish'],
  coral: ['What are Coral Reefs', 'Coral Anatomy', 'Types of Coral', 'Coral Colors', 'Coral Reef Zones', 'Reef Building', 'Coral Symbiosis', 'Reef Fish', 'Reef Invertebrates', 'Reef Plants', 'Great Barrier Reef', 'Coral Reef Ecosystems', 'Coral Food Web', 'Coral Reproduction', 'Coral Growth', 'Coral Bleaching', 'Ocean Acidification', 'Threats to Reefs', 'Coral Conservation', 'Reef Restoration', 'Diving Reefs', 'Reef Biodiversity', 'Coral Research', 'Reef Economy', 'Coral and Climate', 'Protecting Reefs', 'Reef Future', 'Famous Reefs', 'Coral Gardening', 'Reef Education'],
  energy: ['What is Energy', 'Types of Energy', 'Kinetic Energy', 'Potential Energy', 'Heat Energy', 'Light Energy', 'Sound Energy', 'Electrical Energy', 'Chemical Energy', 'Nuclear Energy', 'Energy Sources', 'Renewable Energy', 'Non-Renewable Energy', 'Fossil Fuels', 'Energy Conservation', 'Energy Efficiency', 'Energy Transfer', 'Energy Storage', 'Power Plants', 'Electricity Grid', 'Energy in Nature', 'Energy and Environment', 'Green Energy', 'Future Energy', 'Energy Saving Tips', 'Energy at Home', 'Energy at School', 'Energy Careers', 'Energy History', 'Energy Future'],
  solar: ['What is Solar Energy', 'How Solar Works', 'Solar Panels', 'Solar Cells', 'Sunlight', 'Solar Power Plants', 'Solar in Homes', 'Solar Calculators', 'Solar Water Heating', 'Solar Cooking', 'Solar Batteries', 'Solar Advantages', 'Solar Disadvantages', 'Solar Around World', 'Solar Farms', 'Rooftop Solar', 'Solar Innovation', 'Solar History', 'Solar Future', 'Solar and Environment', 'Solar Energy Storage', 'Solar Efficiency', 'Solar Tracking', 'Solar in Space', 'Solar Powered Devices', 'Solar for Kids', 'Solar Projects', 'Solar Careers', 'Solar Research', 'Going Solar'],
  wind: ['What is Wind Energy', 'How Wind Turbines Work', 'Wind Turbine Parts', 'Wind Farms', 'Onshore Wind', 'Offshore Wind', 'Wind Speed', 'Wind Direction', 'Wind Power', 'Wind Advantages', 'Wind Disadvantages', 'Wind History', 'Wind Around World', 'Small Wind Turbines', 'Wind and Birds', 'Wind and Environment', 'Wind Energy Storage', 'Wind Farm Planning', 'Wind Turbine Safety', 'Wind Innovation', 'Wind Future', 'Wind Careers', 'Wind Projects', 'Wind in India', 'Wind Research', 'Wind Energy Facts', 'Wind for Kids', 'Wind Power Plants', 'Wind Energy Cost', 'Clean Wind Energy'],
  hydro: ['What is Hydro Energy', 'How Dams Work', 'Hydro Power Plants', 'Types of Hydro', 'Large Hydro', 'Small Hydro', 'Pumped Storage', 'Run of River', 'Hydro Turbines', 'Hydro Advantages', 'Hydro Disadvantages', 'Hydro History', 'Hydro Around World', 'Hydro and Environment', 'Hydro and Fish', 'Hydro and Rivers', 'Hydro Energy Storage', 'Hydro Innovation', 'Hydro Future', 'Hydro Careers', 'Hydro Projects', 'Hydro in India', 'Hydro Research', 'Hydro Energy Facts', 'Hydro for Kids', 'Hydro Power Plants', 'Hydro Energy Cost', 'Clean Hydro Energy', 'Hydro Sustainability', 'Hydro Education'],
  recycling: ['What is Recycling', 'Why Recycle', 'Paper Recycling', 'Plastic Recycling', 'Glass Recycling', 'Metal Recycling', 'Electronic Waste', 'Organic Waste', 'Composting', 'Recycling Process', 'Recycling Bins', 'Recycling Symbols', 'Reduce Waste', 'Reuse Items', 'Recycle at Home', 'Recycle at School', 'Recycling Facts', 'Recycling Myths', 'Recycling Benefits', 'Recycling Challenges', 'Recycling Technology', 'Recycling Around World', 'Recycling Careers', 'Recycling Innovation', 'Zero Waste', 'Circular Economy', 'Waste Sorting', 'Recycling for Kids', 'Recycling Projects', 'Future of Recycling'],
  plastic: ['What is Plastic', 'Plastic Types', 'Plastic Production', 'Plastic Uses', 'Single Use Plastic', 'Plastic Bags', 'Plastic Bottles', 'Plastic Packaging', 'Plastic Waste', 'Plastic Pollution', 'Plastic in Ocean', 'Plastic and Animals', 'Plastic and Health', 'Plastic Degradation', 'Microplastics', 'Plastic Recycling', 'Plastic Alternatives', 'Biodegradable Plastic', 'Reduce Plastic', 'Plastic Free Living', 'Plastic Bans', 'Plastic Cleanup', 'Ocean Cleanup', 'Plastic Innovation', 'Plastic Facts', 'Plastic for Kids', 'Plastic Projects', 'Plastic Future', 'Plastic Education', 'Beat Plastic Pollution'],
  waste: ['What is Waste', 'Types of Waste', 'Household Waste', 'Industrial Waste', 'Hazardous Waste', 'E-Waste', 'Medical Waste', 'Construction Waste', 'Food Waste', 'Waste Collection', 'Waste Sorting', 'Landfills', 'Incineration', 'Waste to Energy', 'Composting', 'Waste Reduction', 'Waste Management', 'Waste Hierarchy', 'Zero Waste', 'Waste Policy', 'Waste Around World', 'Waste Careers', 'Waste Innovation', 'Waste Facts', 'Waste for Kids', 'Waste Projects', 'Waste Education', 'Smart Waste', 'Waste Future', 'Managing Waste'],
  climate: ['What is Climate', 'Climate vs Weather', 'Climate Zones', 'Tropical Climate', 'Temperate Climate', 'Polar Climate', 'Climate Change', 'Global Warming', 'Greenhouse Effect', 'Carbon Footprint', 'Climate Science', 'Climate Data', 'Climate Models', 'Climate Impacts', 'Sea Level Rise', 'Extreme Weather', 'Climate Solutions', 'Renewable Energy', 'Climate Policy', 'Climate Action', 'Climate Adaptation', 'Climate Mitigation', 'Climate Education', 'Climate for Kids', 'Climate Facts', 'Climate Research', 'Climate Careers', 'Climate History', 'Climate Future', 'Protecting Climate'],
  weather: ['What is Weather', 'Temperature', 'Rain', 'Snow', 'Wind', 'Clouds', 'Storms', 'Thunderstorms', 'Hurricanes', 'Tornadoes', 'Weather Forecasting', 'Weather Instruments', 'Weather Maps', 'Weather Patterns', 'Seasons', 'Weather and Climate', 'Extreme Weather', 'Weather Safety', 'Weather for Kids', 'Weather Facts', 'Weather Research', 'Weather Careers', 'Weather History', 'Weather Education', 'Weather Projects', 'Weather Around World', 'Weather and Nature', 'Weather and People', 'Weather Future', 'Understanding Weather'],
  air: ['What is Air', 'Air Composition', 'Atmosphere Layers', 'Air Pressure', 'Air Quality', 'Air Pollution', 'Pollution Sources', 'Vehicle Emissions', 'Factory Pollution', 'Indoor Air', 'Air and Health', 'Air and Climate', 'Smog', 'Acid Rain', 'Ozone Layer', 'Air Monitoring', 'Air Purification', 'Clean Air', 'Air Quality Index', 'Air Pollution Control', 'Air for Kids', 'Air Facts', 'Air Research', 'Air Careers', 'Air Education', 'Air Projects', 'Air Around World', 'Air and Nature', 'Air Future', 'Breathing Clean'],
  soil: ['What is Soil', 'Soil Formation', 'Soil Layers', 'Soil Types', 'Sandy Soil', 'Clay Soil', 'Loamy Soil', 'Soil Color', 'Soil Texture', 'Soil pH', 'Soil Nutrients', 'Soil Organisms', 'Worms in Soil', 'Soil Erosion', 'Soil Conservation', 'Soil Pollution', 'Soil Testing', 'Soil Health', 'Soil and Plants', 'Soil and Water', 'Soil and Climate', 'Soil for Kids', 'Soil Facts', 'Soil Research', 'Soil Careers', 'Soil Education', 'Soil Projects', 'Soil Around World', 'Soil Future', 'Protecting Soil'],
  habitats: ['What are Habitats', 'Forest Habitat', 'Ocean Habitat', 'Desert Habitat', 'Arctic Habitat', 'Grassland Habitat', 'Mountain Habitat', 'Freshwater Habitat', 'Rainforest Habitat', 'Urban Habitat', 'Habitat Animals', 'Habitat Plants', 'Habitat Adaptation', 'Habitat Loss', 'Habitat Conservation', 'Habitat Restoration', 'Habitat for Kids', 'Habitat Facts', 'Habitat Research', 'Habitat Education', 'Habitat Projects', 'Habitats Around World', 'Habitats and Climate', 'Habitats and People', 'Protecting Habitats', 'Creating Habitats', 'Habitat Diversity', 'Habitat Future', 'Amazing Habitats', 'Habitat Exploration'],
  foodchain: ['What is Food Chain', 'Producers', 'Consumers', 'Decomposers', 'Herbivores', 'Carnivores', 'Omnivores', 'Predators', 'Prey', 'Food Web', 'Energy Flow', 'Trophic Levels', 'Top Predators', 'Food Chain Examples', 'Forest Food Chain', 'Ocean Food Chain', 'Desert Food Chain', 'Pond Food Chain', 'Food Chain Balance', 'Food Chain Disruption', 'Food Chain for Kids', 'Food Chain Facts', 'Food Chain Research', 'Food Chain Education', 'Food Chain Projects', 'Food Chains Around World', 'Food Chains and Climate', 'Food Chains and People', 'Protecting Food Chains', 'Understanding Nature'],
  biodiversity: ['What is Biodiversity', 'Species Diversity', 'Genetic Diversity', 'Ecosystem Diversity', 'Biodiversity Hotspots', 'Rainforest Biodiversity', 'Ocean Biodiversity', 'Island Biodiversity', 'Biodiversity Importance', 'Biodiversity Loss', 'Threats to Biodiversity', 'Endangered Species', 'Extinction', 'Conservation', 'Protected Areas', 'Biodiversity and Climate', 'Biodiversity and Health', 'Biodiversity and Food', 'Biodiversity for Kids', 'Biodiversity Facts', 'Biodiversity Research', 'Biodiversity Careers', 'Biodiversity Education', 'Biodiversity Projects', 'Biodiversity Around World', 'Biodiversity Future', 'Protecting Biodiversity', 'Restoring Biodiversity', 'Living with Nature', 'Biodiversity Action'],
  greentech: ['What is Green Technology', 'Renewable Energy Tech', 'Solar Technology', 'Wind Technology', 'Green Buildings', 'Electric Vehicles', 'Energy Storage', 'Smart Grids', 'Water Technology', 'Waste Technology', 'Recycling Technology', 'Green Materials', 'Sustainable Agriculture', 'Green Chemistry', 'Carbon Capture', 'Green Innovation', 'Green Tech for Kids', 'Green Tech Facts', 'Green Tech Research', 'Green Tech Careers', 'Green Tech Education', 'Green Tech Projects', 'Green Tech Around World', 'Green Tech Future', 'Green Tech in India', 'Green Tech Benefits', 'Green Tech Challenges', 'Green Tech Solutions', 'Green Tech Revolution', 'Technology for Planet'],
  protection: ['Why Protect Environment', 'Environmental Issues', 'Climate Action', 'Clean Energy', 'Clean Water', 'Clean Air', 'Forest Protection', 'Ocean Protection', 'Wildlife Protection', 'Species Conservation', 'Habitat Protection', 'Pollution Control', 'Waste Reduction', 'Sustainable Living', 'Green Lifestyle', 'Environmental Laws', 'Environmental Policy', 'Environmental Education', 'Environmental Careers', 'Environmental Activism', 'Protection for Kids', 'Protection Facts', 'Protection Research', 'Protection Projects', 'Protection Around World', 'Protection Future', 'Protecting Nature', 'Protecting Future', 'Environmental Heroes', 'Our Planet Our Home'],
};

const VOCAB_POOLS = {
  trees: [{ w: 'Photosynthesis', m: 'Process by which plants make food from sunlight', p: 'fo-to-sin-thuh-sis' }, { w: 'Canopy', m: 'The upper layer of branches in a forest', p: 'kan-uh-pee' }, { w: 'Deforestation', m: 'Cutting down of forests', p: 'dee-for-uh-stray-shun' }],
  water: [{ w: 'Evaporation', m: 'Water turning into vapor', p: 'ee-vap-uh-ray-shun' }, { w: 'Condensation', m: 'Vapor turning into liquid', p: 'kon-den-say-shun' }, { w: 'Precipitation', m: 'Rain or snow falling from clouds', p: 'pre-sip-uh-tay-shun' }],
  earth: [{ w: 'Atmosphere', m: 'Layer of gases around Earth', p: 'at-muh-sfeer' }, { w: 'Erosion', m: 'Wearing away of Earth\'s surface', p: 'ee-roh-zhun' }, { w: 'Tectonic', m: 'Related to Earth\'s crust movement', p: 'tek-ton-ik' }],
  animals: [{ w: 'Mammal', m: 'Warm-blooded animal with fur', p: 'mam-uhl' }, { w: 'Habitat', m: 'Natural home of an animal', p: 'hab-uh-tat' }, { w: 'Endangered', m: 'At risk of becoming extinct', p: 'en-dan-jerd' }],
  plants: [{ w: 'Chlorophyll', m: 'Green pigment in plants', p: 'klor-uh-fil' }, { w: 'Germination', m: 'When a seed starts to grow', p: 'jur-muh-nay-shun' }, { w: 'Pollination', m: 'Transfer of pollen between flowers', p: 'pol-uh-nay-shun' }],
  forests: [{ w: 'Biodiversity', m: 'Variety of life in an area', p: 'bye-oh-duh-vur-suh-tee' }, { w: 'Ecosystem', m: 'Community of living things', p: 'ee-koh-sis-tem' }, { w: 'Canopy', m: 'Top layer of forest', p: 'kan-uh-pee' }],
  birds: [{ w: 'Migration', m: 'Seasonal movement of birds', p: 'my-gray-shun' }, { w: 'Feathers', m: 'Outer covering of birds', p: 'feth-ers' }, { w: 'Beak', m: 'Bird\'s mouth part', p: 'beek' }],
  insects: [{ w: 'Metamorphosis', m: 'Complete change in body form', p: 'met-uh-mor-fuh-sis' }, { w: 'Antennae', m: 'Sensory organs on insect head', p: 'an-ten-ee' }, { w: 'Exoskeleton', m: 'Hard outer covering', p: 'ek-soh-skel-uh-ton' }],
  oceans: [{ w: 'Current', m: 'Flow of ocean water', p: 'kur-ent' }, { w: 'Tide', m: 'Rise and fall of sea level', p: 'tyd' }, { w: 'Salinity', m: 'Saltiness of water', p: 'suh-lin-uh-tee' }],
  fish: [{ w: 'Gills', m: 'Organs fish use to breathe', p: 'gilz' }, { w: 'Scales', m: 'Protective plates on fish skin', p: 'skaylz' }, { w: 'Fins', m: 'Body parts fish use to swim', p: 'finz' }],
  coral: [{ w: 'Symbiosis', m: 'Living together for mutual benefit', p: 'sim-bye-oh-sis' }, { w: 'Bleaching', m: 'When coral loses its color', p: 'bleech-ing' }, { w: 'Reef', m: 'Underwater structure made by coral', p: 'reef' }],
  energy: [{ w: 'Renewable', m: 'Can be naturally replaced', p: 'ree-noo-uh-bul' }, { w: 'Conservation', m: 'Saving resources', p: 'kon-ser-vay-shun' }, { w: 'Efficiency', m: 'Using less to do more', p: 'ee-fish-en-see' }],
  solar: [{ w: 'Photovoltaic', m: 'Converts sunlight to electricity', p: 'fo-to-vol-tay-ik' }, { w: 'Solar Panel', m: 'Device that captures sunlight', p: 'soh-lar pan-ul' }, { w: 'Renewable', m: 'Energy that never runs out', p: 'ree-noo-uh-bul' }],
  wind: [{ w: 'Turbine', m: 'Machine that converts wind to energy', p: 'tur-byn' }, { w: 'Renewable', m: 'Can be naturally replaced', p: 'ree-noo-uh-bul' }, { w: 'Generator', m: 'Device that produces electricity', p: 'jen-uh-ray-tor' }],
  hydro: [{ w: 'Turbine', m: 'Machine turned by water flow', p: 'tur-byn' }, { w: 'Reservoir', m: 'Artificial lake behind a dam', p: 'rez-er-vwahr' }, { w: 'Sustainable', m: 'Can continue long-term', p: 'suh-stay-nuh-bul' }],
  recycling: [{ w: 'Biodegradable', m: 'Can be broken down naturally', p: 'bye-oh-dee-gray-duh-bul' }, { w: 'Compost', m: 'Decomposed organic matter', p: 'kom-post' }, { w: 'Landfill', m: 'Place where waste is buried', p: 'land-fil' }],
  plastic: [{ w: 'Microplastic', m: 'Very small plastic particles', p: 'my-kro-plas-tik' }, { w: 'Biodegradable', m: 'Can decompose naturally', p: 'bye-oh-dee-gray-duh-bul' }, { w: 'Pollution', m: 'Contamination of environment', p: 'puh-loo-shun' }],
  waste: [{ w: 'Decompose', m: 'Break down naturally', p: 'dee-kum-pohz' }, { w: 'Incinerator', m: 'Facility that burns waste', p: 'in-sin-uh-ray-tor' }, { w: 'Hazardous', m: 'Dangerous to health', p: 'haz-ur-dus' }],
  climate: [{ w: 'Greenhouse Gas', m: 'Gas that traps heat in atmosphere', p: 'green-hous gas' }, { w: 'Global Warming', m: 'Rise in Earth\'s temperature', p: 'gloh-bul worm-ing' }, { w: 'Carbon Footprint', m: 'CO2 emissions from activities', p: 'kar-bun foot-print' }],
  weather: [{ w: 'Atmosphere', m: 'Layer of gases around Earth', p: 'at-muh-sfeer' }, { w: 'Humidity', m: 'Amount of water in air', p: 'hyoo-mid-uh-tee' }, { w: 'Barometer', m: 'Instrument to measure air pressure', p: 'buh-rom-uh-ter' }],
  air: [{ w: 'Particulate', m: 'Tiny particles in air', p: 'par-tik-yoo-lit' }, { w: 'Emission', m: 'Release of gases into air', p: 'ee-mish-un' }, { w: 'Ozone', m: 'Gas that protects from UV rays', p: 'oh-zohn' }],
  soil: [{ w: 'Erosion', m: 'Wearing away of soil', p: 'ee-roh-zhun' }, { w: 'Nutrient', m: 'Substance that helps plants grow', p: 'noo-tree-ent' }, { w: 'Humus', m: 'Decomposed organic matter in soil', p: 'hyoo-mus' }],
  habitats: [{ w: 'Ecosystem', m: 'Community of living things', p: 'ee-koh-sis-tem' }, { w: 'Adaptation', m: 'Change to survive better', p: 'ad-ap-tay-shun' }, { w: 'Biodiversity', m: 'Variety of life forms', p: 'bye-oh-duh-vur-suh-tee' }],
  foodchain: [{ w: 'Producer', m: 'Organism that makes its own food', p: 'pruh-doo-ser' }, { w: 'Consumer', m: 'Organism that eats others', p: 'kun-soo-mer' }, { w: 'Decomposer', m: 'Breaks down dead matter', p: 'dee-kum-poh-zer' }],
  biodiversity: [{ w: 'Species', m: 'Group of similar organisms', p: 'spee-sheez' }, { w: 'Ecosystem', m: 'Community and its environment', p: 'ee-koh-sis-tem' }, { w: 'Conservation', m: 'Protection of nature', p: 'kon-ser-vay-shun' }],
  greentech: [{ w: 'Sustainable', m: 'Can continue without harming', p: 'suh-stay-nuh-bul' }, { w: 'Innovation', m: 'New idea or invention', p: 'in-uh-vay-shun' }, { w: 'Efficient', m: 'Using resources wisely', p: 'ee-fish-ent' }],
  protection: [{ w: 'Conservation', m: 'Protecting natural resources', p: 'kon-ser-vay-shun' }, { w: 'Sustainability', m: 'Living without depleting resources', p: 'suh-stay-nuh-bil-uh-tee' }, { w: 'Environment', m: 'World around us', p: 'en-vy-run-ment' }],
};

const FACTS = [
  'This helps maintain ecological balance on Earth',
  'Every living thing depends on this for survival',
  'Scientists study this to understand our planet better',
  'Protecting this is essential for future generations',
  'This plays a crucial role in the ecosystem',
  'Learning about this helps us care for nature',
  'This is connected to everything in the environment',
  'Small actions can help protect this resource',
  'This has been part of Earth for millions of years',
  'Understanding this helps us make better choices',
];

function generateLessons() {
  const allLessons = [];
  let order = 1;

  for (const [catId, cat] of Object.entries(CATS)) {
    const topics = TOPIC_POOLS[catId] || [];
    const vocabs = VOCAB_POOLS[catId] || [{ w: 'Nature', m: 'The natural world', p: 'nay-chur' }];
    const diffs = ['beginner', 'beginner', 'beginner', 'intermediate', 'intermediate', 'advanced'];
    
    for (let i = 0; i < 30 && i < topics.length; i++) {
      const topic = topics[i];
      const diff = diffs[i % diffs.length];
      const vocab = vocabs[i % vocabs.length];
      const fact = FACTS[i % FACTS.length];
      const lessonNum = i + 1;

      allLessons.push({
        id: crypto.randomBytes(6).toString('hex'),
        title: `${lessonNum}. ${topic}`,
        subtitle: `Exploring ${topic.toLowerCase()}`,
        category: catId,
        icon: cat.icon,
        difficulty: diff,
        order: order++,
        xpReward: 20 + (i % 3) * 5,
        coinReward: 10 + (i % 3) * 5,
        readingTime: `${5 + (i % 3) * 2} min`,
        estimatedDuration: `${10 + (i % 3) * 5} min`,
        ageGroup: '5-14',
        isActive: true,
        content: {
          english: {
            title: topic,
            description: `Learn about ${topic.toLowerCase()} and its importance in our world`,
            learningObjectives: [`Understand what ${topic.toLowerCase()} is`, `Learn why ${topic.toLowerCase()} is important`, `Discover how ${topic.toLowerCase()} helps the environment`],
            introduction: `Today we will explore ${topic.toLowerCase()}. ${cat.name} are amazing and play a vital role in nature. Let's discover why they are so important!`,
            simpleExplanation: `${topic} is a fascinating part of our natural world. ${fact} When we learn about ${topic.toLowerCase()}, we understand more about how nature works.`,
            detailedExplanation: `${topic} plays a crucial role in maintaining ecological balance. It is connected to many other aspects of the environment. ${fact} Scientists and researchers study ${topic.toLowerCase()} to better understand our planet and how to protect it for future generations.`,
            examples: [`${topic} can be found in many places around the world`, `People study ${topic.toLowerCase()} to learn about nature`, `${topic} helps support life on Earth`],
            funFacts: [fact, `${cat.name} are essential for life on Earth`, `Learning about ${topic.toLowerCase()} helps us protect the environment`],
            didYouKnow: [fact, `${cat.name} play a vital role in ecosystems`, `Protecting ${topic.toLowerCase()} helps all living things`],
            environmentalTips: [`Learn more about ${topic.toLowerCase()} every day`, `Share what you learn with friends and family`, `Take action to protect ${cat.name.toLowerCase()}`],
            vocabulary: [
              { word: topic.split(' ').slice(-1)[0], meaning: `Related to ${topic.toLowerCase()}`, pronunciation: topic.toLowerCase() },
              { word: vocab.w, meaning: vocab.m, pronunciation: vocab.p },
              { word: cat.name, meaning: `An important part of nature`, pronunciation: cat.name.toLowerCase() },
            ],
            miniStory: {
              title: `The Story of ${topic}`,
              content: `In a beautiful corner of nature, ${topic.toLowerCase()} stood as a testament to the wonder of our natural world. Every day, it played its part in the grand tapestry of life. Animals relied on it, plants grew near it, and the ecosystem thrived because of its presence. This reminds us that every part of nature, no matter how small, has value and deserves our respect and protection.`,
              moral: 'Every part of nature has value and deserves protection.'
            },
            summary: `${topic} is an important part of our natural world. By learning about it, we understand more about how nature works and how we can help protect our planet for future generations.`,
            completionBadge: `${topic} Explorer`,
          }
        },
        nextLesson: lessonNum < 30 ? `${lessonNum + 1}. ${topics[i + 1] || topics[0]}` : 'Category Complete! 🎉',
        previousLesson: lessonNum > 1 ? `${lessonNum - 1}. ${topics[i - 1]}` : 'Start Here',
      });
    }
  }
  return allLessons;
}

module.exports = { generateLessons };