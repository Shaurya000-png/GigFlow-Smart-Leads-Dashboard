import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { resetEnvCache } from '../config/env';
import { User } from '../models/user.model';
import { Lead } from '../models/lead.model';

dotenv.config({ path: path.join(__dirname, '../../.env') });
resetEnvCache();

const DATASETS_DIR = path.join(__dirname, '../../../datasets');

interface DemoUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'sales';
}

interface SeedLead {
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  owner: 'admin' | 'sales';
}

const loadJson = <T>(filename: string): T => {
  const filePath = path.join(DATASETS_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
};

const seed = async () => {
  await connectDB();

  const { users } = loadJson<{ users: DemoUser[] }>('demo-users.json');
  const { leads } = loadJson<{ leads: SeedLead[] }>('leads.json');

  const demoEmails = users.map((u) => u.email.toLowerCase());

  console.log('Clearing existing demo data...');
  const existingDemoUsers = await User.find({ email: { $in: demoEmails } });
  const demoUserIds = existingDemoUsers.map((u) => u._id.toString());
  if (demoUserIds.length > 0) {
    await Lead.deleteMany({ createdBy: { $in: demoUserIds } });
  }
  await User.deleteMany({ email: { $in: demoEmails } });

  console.log('Creating demo users...');
  const userByRole: Record<string, string> = {};
  for (const userData of users) {
    const user = await User.create(userData);
    userByRole[user.role] = user._id.toString();
    console.log(`  ${user.role}: ${user.email}`);
  }

  console.log(`Inserting ${leads.length} leads...`);
  const leadDocs = leads.map((lead) => ({
    name: lead.name,
    email: lead.email,
    status: lead.status,
    source: lead.source,
    createdBy: userByRole[lead.owner],
  }));
  await Lead.insertMany(leadDocs);

  const adminCount = leads.filter((l) => l.owner === 'admin').length;
  const salesCount = leads.filter((l) => l.owner === 'sales').length;

  console.log('\nSeed complete!');
  console.log(`  Admin leads: ${adminCount} (admin sees all ${leads.length} on dashboard)`);
  console.log(`  Sales leads: ${salesCount} (sales sees only their ${salesCount})`);
  console.log('\nDemo logins:');
  for (const u of users) {
    console.log(`  ${u.role}: ${u.email} / ${u.password}`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
