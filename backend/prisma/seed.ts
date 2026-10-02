/**
 * Standalone dev-only seed script — NOT part of any migration.
 *
 * Creates ~18 fake-but-realistic onboarded NYU student profiles so the
 * discovery feed has real candidates to swipe through locally. Safe to
 * re-run (upserts by nyuEmail); has nothing to do with production data
 * or app logic — delete or ignore this file if it's ever in the way.
 *
 * Run:   npx prisma db seed        (or: npx tsx prisma/seed.ts)
 * Clear: npx prisma db seed -- --clear
 *
 * "Clear" deletes exactly the users this script created (matched by
 * their nyuEmail), and nothing else — their swipes/matches go with them
 * via onDelete: Cascade. It will not touch any account you created by
 * hand through the real signup flow.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mirrors frontend/src/components/auth/ProfileSetupForm.tsx's vocabulary so
// seeded profiles are filterable the same way real ones are.
const INTEREST_POOL = [
  'Hiking',
  'Photography',
  'Jazz',
  'Cooking',
  'Rock Climbing',
  'Film',
  'Basketball',
  'Chess',
  'Poetry',
  'Coffee',
  'Travel',
  'Yoga',
  'Gaming',
  'Painting',
  'Running',
  'Podcasts',
  'Volunteering',
  'Thrifting',
  'Board Games',
  'Astronomy',
  'Skateboarding',
  'Baking',
  'Debate',
  'Improv',
  'Cycling',
];

const LOOKING_FOR_OPTIONS = ['Friends', 'Study Partner', 'Networking', 'Activity Partner', 'Roommate'];

interface SeedUser {
  firstName: string;
  lastName: string;
  major: string;
  year: string;
  campus: string;
  bio: string;
}

const SEED_USERS: SeedUser[] = [
  {
    firstName: 'Ava',
    lastName: 'Chen',
    major: 'Computer Science',
    year: 'Junior',
    campus: 'Washington Square',
    bio: 'CS major who spends too much time debugging and not enough time sleeping. Always down for late-night diner runs.',
  },
  {
    firstName: 'Marcus',
    lastName: 'Reyes',
    major: 'Film & Television',
    year: 'Senior',
    campus: 'Washington Square',
    bio: 'Tisch senior making a thesis short about my grandmother\'s bodega. Will talk your ear off about 90s cinema.',
  },
  {
    firstName: 'Priya',
    lastName: 'Nair',
    major: 'Economics',
    year: 'Sophomore',
    campus: 'Washington Square',
    bio: 'Econ major, spreadsheet enthusiast, and terrible at keeping plants alive. Looking to explore the city more.',
  },
  {
    firstName: 'Diego',
    lastName: 'Martinez',
    major: 'Mechanical Engineering',
    year: 'Freshman',
    campus: 'Brooklyn',
    bio: 'First year at NYU Tandon, still figuring out the subway. Into building things and bad puns.',
  },
  {
    firstName: 'Sofia',
    lastName: 'Rossi',
    major: 'Art History',
    year: 'Junior',
    campus: 'Washington Square',
    bio: 'I spend most weekends in museums and most weeknights arguing about them. Met desk is my second home.',
  },
  {
    firstName: 'Kwame',
    lastName: 'Boateng',
    major: 'Data Science',
    year: 'Graduate Student',
    campus: 'Washington Square',
    bio: 'Grad student in data science, previously worked in fintech. Trying to actually make friends outside of Slack this time.',
  },
  {
    firstName: 'Lena',
    lastName: 'Kowalski',
    major: 'Journalism',
    year: 'Senior',
    campus: 'Washington Square',
    bio: 'Writing my capstone on campus housing. Will interview you for fun even if you did not ask for it.',
  },
  {
    firstName: 'Omar',
    lastName: 'Farouk',
    major: 'Finance',
    year: 'Junior',
    campus: 'Abu Dhabi',
    bio: 'NYUAD junior visiting the Square this semester. Big on pickup basketball and terrible karaoke.',
  },
  {
    firstName: 'Grace',
    lastName: 'Kim',
    major: 'Biology',
    year: 'Sophomore',
    campus: 'Washington Square',
    bio: 'Pre-med and perpetually running on iced coffee. Looking for a study partner who will actually show up.',
  },
  {
    firstName: 'Noah',
    lastName: 'Bergström',
    major: 'Philosophy',
    year: 'Senior',
    campus: 'Washington Square',
    bio: 'Philosophy senior who promises not to bring up Kant on a first hangout. Mostly. Big into chess and cheap ramen.',
  },
  {
    firstName: 'Isabella',
    lastName: 'Santos',
    major: 'Politics',
    year: 'Junior',
    campus: 'Washington Square',
    bio: 'Student government type by day, karaoke enthusiast by night. Always organizing something.',
  },
  {
    firstName: 'Yusuf',
    lastName: 'Demir',
    major: 'Computer Engineering',
    year: 'Freshman',
    campus: 'Brooklyn',
    bio: 'Building a synth from scratch for a class project and it is not going great. Send help or good playlists.',
  },
  {
    firstName: 'Chloe',
    lastName: 'Dubois',
    major: 'Business',
    year: 'Sophomore',
    campus: 'Washington Square',
    bio: 'Stern sophomore trying to figure out what I actually want to do. In the meantime: thrifting and bad reality TV.',
  },
  {
    firstName: 'Aiden',
    lastName: 'Walsh',
    major: 'Environmental Science',
    year: 'Junior',
    campus: 'Washington Square',
    bio: 'Compost club president, unofficially. Will drag you to a farmers market if you let me.',
  },
  {
    firstName: 'Mei',
    lastName: 'Lin',
    major: 'Global Business',
    year: 'Junior',
    campus: 'Shanghai',
    bio: 'Shanghai campus, here for a semester at Washington Square. Trying to see as much of the city as possible before I leave.',
  },
  {
    firstName: 'Ethan',
    lastName: 'Okafor',
    major: 'Music Technology',
    year: 'Senior',
    campus: 'Washington Square',
    bio: 'Steinhardt senior making beats in my dorm at hours my roommate does not appreciate. Always looking for collabs.',
  },
  {
    firstName: 'Hannah',
    lastName: 'Feldman',
    major: 'Psychology',
    year: 'Graduate Student',
    campus: 'Washington Square',
    bio: 'Masters student researching sleep and stress, which is ironic given how little I sleep. Yoga and podcasts get me through.',
  },
  {
    firstName: 'Lucas',
    lastName: 'Silva',
    major: 'Computer Science',
    year: 'Senior',
    campus: 'Brooklyn',
    bio: 'Tandon senior, job hunting and mildly terrified about it. Climbing gym regular, will always say yes to tacos.',
  },
];

function pick<T>(pool: T[], offset: number, count: number): T[] {
  const result: T[] = [];
  for (let i = 0; i < count; i += 1) {
    result.push(pool[(offset + i) % pool.length]);
  }
  return result;
}

function seedEmailFor(user: SeedUser): string {
  return `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}@nyu.edu`;
}

async function clear(): Promise<void> {
  const emails = SEED_USERS.map(seedEmailFor);
  const { count } = await prisma.user.deleteMany({ where: { nyuEmail: { in: emails } } });
  console.log(`Cleared ${count} seed user(s) (and their swipes/matches, via cascade).`);
}

async function seed(): Promise<void> {
  for (const [index, seedUser] of SEED_USERS.entries()) {
    const nyuEmail = seedEmailFor(seedUser);

    // 3-8 interests, 1-4 lookingFor — matches
    // backend/src/middleware/validate.middleware.ts's ranges for PUT /api/users/me,
    // so seeded rows look like ones a real user could have submitted.
    const interestCount = 3 + (index % 6); // 3..8
    const lookingForCount = 1 + (index % 4); // 1..4

    await prisma.user.upsert({
      where: { nyuEmail },
      update: {},
      create: {
        nyuEmail,
        emailVerified: true,
        name: `${seedUser.firstName} ${seedUser.lastName}`,
        major: seedUser.major,
        year: seedUser.year,
        campus: seedUser.campus,
        bio: seedUser.bio,
        interests: pick(INTEREST_POOL, index * 3, interestCount),
        lookingFor: pick(LOOKING_FOR_OPTIONS, index, lookingForCount),
        onboardingComplete: true,
        // No avatarUrl/photoUrls — UserAvatar's gradient+initials fallback
        // covers this, per the task's preference over fake placeholder images.
      },
    });
  }

  console.log(`Seeded ${SEED_USERS.length} sample users.`);
}

async function main(): Promise<void> {
  if (process.argv.includes('--clear')) {
    await clear();
    return;
  }

  await seed();
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
