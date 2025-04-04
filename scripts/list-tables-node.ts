import { createClient } from '@supabase/supabase-js';

// Use the same hardcoded credentials
const supabaseUrl = 'https://nnwlkgzbvkidyrdrtiyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ud2xrZ3pidmtpZHlyZHJ0aXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNTM5NTksImV4cCI6MjA1NzcyOTk1OX0.9oV9H_mY_w-d9DnWG5b9PEcdBAr_d2LJvnzptFxqG80';

// Create a minimal Supabase client for Node.js
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const listPublicTables = async () => {
  console.log('Attempting to fetch tables from Supabase...');
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public'); // Query only tables in the 'public' schema

    if (error) {
      console.error('Error fetching tables:', error.message);
      throw error;
    }

    if (data && data.length > 0) {
      console.log('\nTables in Supabase (public schema):');
      data.forEach(table => console.log(`- ${table.table_name}`));
    } else {
      console.log('No tables found in the public schema or unable to fetch.');
    }

  } catch (error) {
    console.error('\nFailed to list tables due to an error:', error);
  }
};

listPublicTables();
