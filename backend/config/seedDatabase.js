const mongoose = require('mongoose');
const Pricing = require('../models/Pricing');

const defaultPricingData = [
  { serviceName: 'General Checkup', price: 350 },
  { serviceName: 'XRay', price: 500 },
  { serviceName: 'Blood Test', price: 800 },
  { serviceName: 'ECG', price: 600 },
  { serviceName: 'MRI', price: 1200 }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const data of defaultPricingData) {
      const exists = await Pricing.findOne({ serviceName: data.serviceName });
      if (!exists) {
        await Pricing.create(data);
        console.log(`Inserted default pricing data: ${data.serviceName}`);
      }
    }

    console.log('Database seeding completed.');
    mongoose.disconnect();
  } catch (err) {
    console.error(err.message, "hello");
    console.log(process.env.MONGO_URI)
    process.exit(1);
  }
};

module.exports = seedDatabase;
