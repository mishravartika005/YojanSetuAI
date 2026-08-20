import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Scheme from '../models/Scheme.js';
import { schemes } from './schemes.js';

export async function seedSchemes() {
  try {
    await connectDB();
    console.log('Starting Scheme database seed...');

    let seededCount = 0;
    for (const scheme of schemes) {
      await Scheme.findOneAndUpdate(
        { name: scheme.name },
        { $set: scheme },
        { upsert: true, returnDocument: 'after', runValidators: true }
      );
      seededCount++;
    }

    const totalInDb = await Scheme.countDocuments();
    console.log(`Successfully seeded ${seededCount} scheme records. Total schemes in DB: ${totalInDb}`);
    return { success: true, seededCount, totalInDb };
  } catch (error) {
    console.error(`Scheme seed failed: ${error.message}`);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected cleanly.');
  }
}

// Run directly if called as a script
if (process.argv[1]?.endsWith('seedSchemes.js')) {
  seedSchemes()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
