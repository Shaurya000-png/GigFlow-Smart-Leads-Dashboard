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
const LEGACY_DEMO_EMAILS = ['admin@gigflow.com', 'john@gigflow.com'];
const DEMO_USERS: DemoUser[] = [
  {
    name: 'Demo Admin',
    email: 'demo.admin@gigflow.com',
    password: 'Demo123!',
    role: 'admin',
  },
  {
    name: 'Demo Sales',
    email: 'demo.sales@gigflow.com',
    password: 'Demo123!',
    role: 'sales',
  },
];

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

  const { leads } = loadJson<{ leads: SeedLead[] }>('leads.json');
  const adminLeadCount = leads.filter((l) => l.owner === 'admin').length;
  const salesLeadCount = leads.filter((l) => l.owner === 'sales').length;

  if (leads.length !== 20 || adminLeadCount !== 12 || salesLeadCount !== 8) {
    throw new Error(
      `Seed dataset must contain exactly 20 leads: 12 admin and 8 sales. Found ${leads.length} total, ${adminLeadCount} admin, ${salesLeadCount} sales.`
    );
  }

  const demoEmails = [
    ...DEMO_USERS.map((u) => u.email.toLowerCase()),
    ...LEGACY_DEMO_EMAILS,
  ];

  console.log('Clearing existing demo data...');
  await Lead.deleteMany({});
  await User.deleteMany({ email: { $in: demoEmails } });

  console.log('Creating demo users...');
  const userByRole: Record<string, string> = {};
  for (const userData of DEMO_USERS) {
    const user = new User(userData);
    await user.save();
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

  console.log('\nSeed complete!');
  console.log(`  Admin leads: ${adminLeadCount} (admin sees all ${leads.length} on dashboard)`);
  console.log(`  Sales leads: ${salesLeadCount} (sales sees only their ${salesLeadCount})`);
  console.log('\nDemo logins:');
  for (const u of DEMO_USERS) {
    console.log(`  ${u.role}: ${u.email} / ${u.password}`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
