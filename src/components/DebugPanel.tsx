import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { addTestUser } from '../utils/addTestUser';
import { debugSupabaseConnection } from '../utils/debugSupabase';

interface LogMessage {
  type: 'info' | 'success' | 'error';
  message: string;
}

export const DebugPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (type: LogMessage['type'], message: string) => {
    setLogs(prev => [{ type, message }, ...prev].slice(0, 20));
  };

  const handleAddTestUser = async () => {
    setIsLoading(true);
    addLog('info', 'Adding test user...');
    
    try {
      const result = await addTestUser();
      if (result.success) {
        addLog('success', `Test user added: ${result.user.email}`);
      } else {
        addLog('error', `Failed to add test user: ${result.error.message}`);
      }
    } catch (error: any) {
      addLog('error', `Exception adding test user: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebugConnection = async () => {
    setIsLoading(true);
    addLog('info', 'Testing Supabase connection...');
    
    try {
      await debugSupabaseConnection();
      addLog('success', 'Supabase debug complete - check console for details');
    } catch (error: any) {
      addLog('error', `Supabase debug failed: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  if (!isExpanded) {
    return (
      <TouchableOpacity 
        style={styles.expandButton} 
        onPress={() => setIsExpanded(true)}
      >
        <Text style={styles.expandButtonText}>Debug</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Debug Panel</Text>
        <TouchableOpacity onPress={() => setIsExpanded(false)}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.disabledButton]} 
          onPress={handleAddTestUser}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Add Test User</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.disabledButton]} 
          onPress={handleDebugConnection}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Test Connection</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={handleClearLogs}
        >
          <Text style={styles.clearButtonText}>Clear Logs</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.logContainer}>
        {logs.map((log, index) => (
          <View 
            key={index} 
            style={[
              styles.logItem, 
              log.type === 'success' && styles.successLog,
              log.type === 'error' && styles.errorLog
            ]}
          >
            <Text style={styles.logText}>{log.message}</Text>
          </View>
        ))}
        {logs.length === 0 && (
          <Text style={styles.emptyLogs}>No logs yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  expandButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 1000,
  },
  expandButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 300,
    height: 400,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 10,
    padding: 10,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: '#7f8c8d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  logContainer: {
    flex: 1,
    marginTop: 10,
  },
  logItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  successLog: {
    backgroundColor: 'rgba(46, 204, 113, 0.3)',
  },
  errorLog: {
    backgroundColor: 'rgba(231, 76, 60, 0.3)',
  },
  logText: {
    color: 'white',
    fontSize: 12,
  },
  emptyLogs: {
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 20,
  },
}); 