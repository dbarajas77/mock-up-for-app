import { listTables } from '../src/lib/api/tables';

const main = async () => {
  try {
    const tables = await listTables();
    console.log('Tables in Supabase:');
    tables.forEach(table => console.log(`- ${table}`));
  } catch (error) {
    console.error('Failed to list tables:', error);
  }
};

main(); 