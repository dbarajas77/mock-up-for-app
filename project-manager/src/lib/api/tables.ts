import { supabase } from '../supabase';

export const listTables = async () => {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) {
      console.error('Error fetching tables:', error);
      throw error;
    }

    return data?.map(table => table.table_name) || [];
  } catch (error) {
    console.error('Error in listTables:', error);
    throw error;
  }
}; 