/**
 * Seed script for test users
 * Creates admin, founder, and builder test accounts
 * 
 * Run with: npm run seed:test-users
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure these are set in your .env.local:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nCurrent values:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || '(not set)');
  console.error('  SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? '(set)' : '(not set)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seedTestUsers() {
  console.log('🌱 Seeding test users...\n');

  // Test users configuration
  const testUsers = [
    {
      email: 'admin@test.unblck.dev',
      password: 'admin123',
      role: 'admin',
      stellar_funded: false,
    },
    {
      email: 'founder@test.unblck.dev',
      password: 'founder123',
      role: 'founder',
      stellar_funded: true,
    },
    {
      email: 'builder@test.unblck.dev',
      password: 'builder123',
      role: 'builder',
      stellar_funded: false,
    },
  ];

  for (const testUser of testUsers) {
    console.log(`Creating ${testUser.role}: ${testUser.email}`);

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true, // Skip email verification
      user_metadata: {
        role: testUser.role,
      },
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log(`  ⚠️  User already exists, skipping...`);
        continue;
      }
      console.error(`  ❌ Auth error: ${authError.message}`);
      continue;
    }

    if (!authData.user) {
      console.error('  ❌ No user created');
      continue;
    }

    console.log(`  ✓ Auth user created: ${authData.user.id}`);

    // 2. Create application
    const { data: appData, error: appError } = await supabase
      .from('unblck_applications')
      .insert({
        full_name: `Test ${testUser.role.charAt(0).toUpperCase() + testUser.role.slice(1)}`,
        email: testUser.email,
        project_name: `${testUser.role} Test Project`,
        project_link: 'https://example.com',
        build_description: `Test ${testUser.role} project`,
        location: 'Santiago, Chile',
        stage: 'prototype',
        motivation: 'Testing purposes',
        passport_address: `test_${testUser.role}`, // Database column is passport_address
        application_type: 'hub_access',
        status: 'approved',
        auth_user_id: authData.user.id,
        passport_verified: true,
        stellar_funded: testUser.stellar_funded,
        terms_version: '2026-07-01',
        terms_accepted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (appError) {
      console.error(`  ❌ Application error: ${appError.message}`);
      continue;
    }

    console.log(`  ✓ Application created: ${appData.id}`);

    // 3. Create member profile
    const { data: profileData, error: profileError } = await supabase
      .from('member_profiles')
      .insert({
        auth_user_id: authData.user.id,
        application_id: appData.id,
        email: testUser.email,
        stellar_funded: testUser.stellar_funded,
        passport_verified: true,
      })
      .select()
      .single();

    if (profileError) {
      console.error(`  ❌ Profile error: ${profileError.message}`);
      continue;
    }

    console.log(`  ✓ Member profile created: ${profileData.auth_user_id}`);
    console.log(`  🎉 ${testUser.role.toUpperCase()} user complete!\n`);
  }

  console.log('✅ Test users seeded successfully!\n');
  console.log('Login credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:   admin@test.unblck.dev   / admin123');
  console.log('Founder: founder@test.unblck.dev / founder123');
  console.log('Builder: builder@test.unblck.dev / builder123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

seedTestUsers()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
