const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Load configuration
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../mcp-config.json'), 'utf8'));

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://nnwlkgzbvkidyrdrtiyl.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize PostgreSQL connection pool with improved error handling
const pool = new Pool({
  connectionString: config.database.connectionString,
  max: config.database.pool.max,
  min: config.database.pool.min,
  idleTimeoutMillis: config.database.pool.idleTimeoutMillis,
  ssl: { rejectUnauthorized: false }
});

// Add a more robust connection test
let dbConnected = false;
function testDbConnection() {
  pool.query('SELECT NOW()')
    .then(result => {
      console.log('Database connection successful!');
      console.log('Current database time:', result.rows[0].now);
      dbConnected = true;
      runMigrations(); // Run migrations after successful connection
    })
    .catch(error => {
      console.error('Database connection error:', error);
      console.error('Please check your connection string and credentials');
      console.error('Will retry connection in 5 seconds...');
      setTimeout(testDbConnection, 5000); // Retry after 5 seconds
    });
}

// Function to run migrations
async function runMigrations() {
  try {
    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Get list of migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Get executed migrations
    const { rows: executedMigrations } = await pool.query('SELECT name FROM migrations');
    const executedMigrationNames = executedMigrations.map(m => m.name);

    // Run pending migrations
    for (const file of migrationFiles) {
      if (!executedMigrationNames.includes(file)) {
        console.log(`Running migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        
        await pool.query('BEGIN');
        try {
          await pool.query(sql);
          await pool.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
          await pool.query('COMMIT');
          console.log(`Migration ${file} completed successfully`);
        } catch (error) {
          await pool.query('ROLLBACK');
          console.error(`Error running migration ${file}:`, error);
          throw error;
        }
      }
    }
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}

// Test database connection on startup
testDbConnection();

// Initialize Express app
const app = express();

// Middleware
app.use(cors(config.server.cors));
app.use(express.json());
app.use(morgan('dev'));

// Authentication middleware
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    // Skip authentication for public endpoints
    req.isAuthenticated = false;
    return next();
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) {
      req.isAuthenticated = false;
      req.authError = error;
    } else {
      req.isAuthenticated = true;
      req.user = data.user;
    }
  } catch (error) {
    req.isAuthenticated = false;
    req.authError = error;
  }
  
  next();
};

// Optional: Apply authentication to specific routes
// app.use('/api/secured', authenticate);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'not connected'
  });
});

// List all tables in the database
app.get('/api/tables', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get table structure
app.get('/api/tables/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    
    // Get columns
    const columnsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `, [tableName]);
    
    // Get sample data (first 5 rows)
    let sampleData = [];
    try {
      const sampleResult = await pool.query(`
        SELECT * FROM "${tableName}" LIMIT 5
      `);
      sampleData = sampleResult.rows;
    } catch (err) {
      console.warn(`Could not fetch sample data for ${tableName}:`, err.message);
    }
    
    res.json({
      tableName,
      columns: columnsResult.rows,
      sampleData
    });
  } catch (error) {
    console.error(`Error fetching table structure for ${req.params.tableName}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Add a test endpoint to create and drop a test table
app.post('/api/test-connection', async (req, res) => {
  try {
    // Create test table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // Insert test data
    const insertResult = await pool.query(`
      INSERT INTO test_table (name) 
      VALUES ('Test connection') 
      RETURNING *
    `);
    
    // Query the data
    const selectResult = await pool.query('SELECT * FROM test_table');
    
    // Drop the test table
    await pool.query('DROP TABLE test_table');
    
    res.status(200).json({
      success: true,
      message: 'Database connection test successful',
      testData: selectResult.rows
    });
  } catch (error) {
    console.error('Error testing database connection:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});

// Supabase Auth proxy endpoints
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name || ''
        }
      }
    });
    
    if (error) {
      console.error('Signup error:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(200).json({ success: true, user: data.user });
  } catch (error) {
    console.error('Unexpected signup error:', error);
    res.status(500).json({ error: 'An unexpected error occurred during signup' });
  }
});

// API Routes
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching project ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      address1,
      address2,
      city,
      state,
      zip,
      location,
      contact_name,
      contact_phone,
      start_date,
      end_date
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO projects (
        name,
        description,
        status,
        address1,
        address2,
        city,
        state,
        zip,
        location,
        contact_name,
        contact_phone,
        start_date,
        end_date,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()) RETURNING *`,
      [
        name,
        description,
        status,
        address1,
        address2,
        city,
        state,
        zip,
        location,
        contact_name,
        contact_phone,
        start_date,
        end_date
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, client_id } = req.body;
    
    const result = await pool.query(
      'UPDATE projects SET name = $1, description = $2, status = $3, client_id = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [name, description, status, client_id, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating project ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully', project: result.rows[0] });
  } catch (error) {
    console.error(`Error deleting project ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Project collaborators endpoints
app.get('/api/projects/:projectId/collaborators', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { data, error } = await supabase
      .from('project_collaborators')
      .select(`
        *,
        user:user_id (
          id,
          email
        )
      `)
      .eq('project_id', projectId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching project collaborators:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects/:projectId/collaborators', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.body;

    const { data, error } = await supabase
      .from('project_collaborators')
      .insert([{
        project_id: projectId,
        user_id: userId,
        role
      }])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Error adding project collaborator:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:projectId/collaborators/:userId', async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const { error } = await supabase
      .from('project_collaborators')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error removing project collaborator:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reports endpoints
app.get('/api/reports', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM reports ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

app.get('/api/reports/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM reports WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching report with ID ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

app.post('/api/reports', async (req, res) => {
  const { 
    projectName, 
    address1, 
    address2, 
    city, 
    state, 
    zip, 
    contactName, 
    contactPhone, 
    reportType, 
    description 
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO reports 
        (project_name, address1, address2, city, state, zip, contact_name, contact_phone, report_type, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [projectName, address1, address2, city, state, zip, contactName, contactPhone, reportType, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

app.put('/api/reports/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    projectName, 
    address1, 
    address2, 
    city, 
    state, 
    zip, 
    contactName, 
    contactPhone, 
    reportType, 
    description 
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE reports 
       SET project_name = $1, 
           address1 = $2, 
           address2 = $3, 
           city = $4, 
           state = $5, 
           zip = $6, 
           contact_name = $7, 
           contact_phone = $8, 
           report_type = $9, 
           description = $10,
           updated_at = NOW()
       WHERE id = $11 
       RETURNING *`,
      [projectName, address1, address2, city, state, zip, contactName, contactPhone, reportType, description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating report with ID ${id}:`, error);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

app.delete('/api/reports/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM reports WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting report with ID ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = config.server.port || 3001;
const HOST = config.server.host || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`MCP Server running on http://${HOST}:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
  console.log('Shutting down MCP server...');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
}
