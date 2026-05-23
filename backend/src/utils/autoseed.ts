import { User } from '../models/user.model';
import { Lead } from '../models/lead.model';
import { logger } from './logger';

const DEMO_USERS = [
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

const DEMO_LEADS = [
  { name: "Rahul Sharma", email: "rahul.sharma@acme.io", status: "New", source: "Instagram", owner: "admin" },
  { name: "Priya Patel", email: "priya.patel@startup.in", status: "Qualified", source: "Referral", owner: "admin" },
  { name: "Amit Kumar", email: "amit.kumar@techcorp.com", status: "Contacted", source: "Website", owner: "admin" },
  { name: "Sneha Reddy", email: "sneha.reddy@cloudnine.com", status: "New", source: "Website", owner: "admin" },
  { name: "Vikram Singh", email: "vikram.singh@buildit.co", status: "Lost", source: "Referral", owner: "admin" },
  { name: "Ananya Iyer", email: "ananya.iyer@designlab.io", status: "Qualified", source: "Instagram", owner: "admin" },
  { name: "Karan Mehta", email: "karan.mehta@fintech.in", status: "Contacted", source: "Website", owner: "admin" },
  { name: "Divya Nair", email: "divya.nair@healthplus.com", status: "New", source: "Referral", owner: "admin" },
  { name: "Arjun Desai", email: "arjun.desai@saasworld.io", status: "Qualified", source: "Website", owner: "admin" },
  { name: "Meera Joshi", email: "meera.joshi@edutech.in", status: "Contacted", source: "Instagram", owner: "admin" },
  { name: "Rohan Gupta", email: "rohan.gupta@logistics.co", status: "New", source: "Website", owner: "admin" },
  { name: "Isha Kapoor", email: "isha.kapoor@retailhub.com", status: "Lost", source: "Instagram", owner: "admin" },
  { name: "Neha Verma", email: "neha.verma@bright.co", status: "New", source: "Instagram", owner: "sales" },
  { name: "Suresh Pillai", email: "suresh.pillai@marine.io", status: "Contacted", source: "Referral", owner: "sales" },
  { name: "Tanvi Shah", email: "tanvi.shah@creative.agency", status: "Qualified", source: "Website", owner: "sales" },
  { name: "Aditya Rao", email: "aditya.rao@automate.in", status: "New", source: "Website", owner: "sales" },
  { name: "Pooja Menon", email: "pooja.menon@wellness.com", status: "Contacted", source: "Instagram", owner: "sales" },
  { name: "Manish Tiwari", email: "manish.tiwari@consult.co", status: "Qualified", source: "Referral", owner: "sales" },
  { name: "Kavya Nambiar", email: "kavya.nambiar@events.io", status: "Lost", source: "Website", owner: "sales" },
  { name: "Harish Bose", email: "harish.bose@export.in", status: "New", source: "Referral", owner: "sales" }
];

export const autoSeed = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      logger.info('Database already seeded, skipping auto-seed.');
      return;
    }

    logger.info('Database empty, starting auto-seed...');

    const userByRole: Record<string, string> = {};
    for (const userData of DEMO_USERS) {
      const user = new User(userData);
      await user.save();
      userByRole[user.role] = user._id.toString();
      logger.info(`  Created ${user.role} user: ${user.email}`);
    }

    const leadDocs = DEMO_LEADS.map((lead) => ({
      name: lead.name,
      email: lead.email,
      status: lead.status as 'New' | 'Contacted' | 'Qualified' | 'Lost',
      source: lead.source as 'Website' | 'Instagram' | 'Referral',
      createdBy: userByRole[lead.owner],
    }));

    await Lead.insertMany(leadDocs);
    logger.info(`Auto-seeded ${DEMO_LEADS.length} leads successfully!`);
  } catch (error) {
    logger.error('Auto-seed failed', { error: String(error) });
  }
};
