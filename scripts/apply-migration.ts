/**
 * Script to apply database migrations
 * 
 * Usage:
 * npx ts-node scripts/apply-migration.ts
 */

import { supabase } from '../src/lib/supabase';
import fs from 'fs';
import path from 'path';

const MIGRATIONS_DIR = path.resolve(__dirname, '../supabase/migrations');

async function applyMigrations() {
  console.log('Reading migrations directory:', MIGRATIONS_DIR);
  
  // Get list of migration files
  const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Sort to ensure migrations are applied in order
  
  console.log(`Found ${migrationFiles.length} migration files:`, migrationFiles);
  
  // Apply each migration
  for (const file of migrationFiles) {
    console.log(`\nApplying migration: ${file}`);
    
    // Read the SQL file
    const filePath = path.join(MIGRATIONS_DIR, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Execute SQL statements
    const statements = sql.split(';')
      .filter(statement => statement.trim())
      .map(statement => statement.trim());
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        console.log(`Executing statement ${i+1}/${statements.length}`);
        // For debugging
        // console.log('SQL:', statement);
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`Error executing SQL statement: ${error.message}`);
          console.error(`Statement: ${statement}`);
          
          // Ask if we should continue
          console.error('Error applying migration. Continue? (y/n)');
          const answer = await new Promise<string>((resolve) => {
            process.stdin.once('data', (data) => {
              resolve(data.toString().trim().toLowerCase());
            });
          });
          
          if (answer !== 'y') {
            console.log('Stopping migration');
            break;
          }
        }
      } catch (error) {
        console.error('Error executing statement:', error);
      }
    }
  }
  
  console.log('\nMigrations complete!');
}

// Run the migrations
applyMigrations().catch(console.error);
