import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AlarmListScreen } from './src/presentation/screens/AlarmListScreen';
import { AlarmFormScreen } from './src/presentation/screens/AlarmFormScreen';
import { useAnalyticsTracker } from './src/presentation/hooks';
import { getDatabase } from './src/infrastructure/database/DatabaseProvider';
import { Alarm, CreateAlarmParams, UpdateAlarmParams } from './src/domain/alarm';
import { AlarmFactory, AlarmFormData } from './src/application/alarm/AlarmFactory';
import { container } from './src/di/container';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

type Screen = 'list' | 'form';

function AppContent() {
  useAnalyticsTracker();
  const [screen, setScreen] = useState<Screen>('list');
  const [isDbReady, setIsDbReady] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);

  useEffect(() => {
    const initDb = async () => {
      try {
        await getDatabase();
        setIsDbReady(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        Alert.alert('Error', 'Failed to initialize database');
      }
    };
    initDb();
  }, []);

  const handleCreateAlarm = useCallback(() => {
    setEditingAlarm(null);
    setScreen('form');
  }, []);

  const handleEditAlarm = useCallback((alarm: Alarm) => {
    setEditingAlarm(alarm);
    setScreen('form');
  }, []);

  const handleSave = useCallback(async (formData: AlarmFormData) => {
    try {
      const params = AlarmFactory.createFromFormData(formData);
      
      if (editingAlarm) {
        await container.alarmUseCases.updateAlarm(editingAlarm.id, params);
      } else {
        await container.alarmUseCases.createAlarm(params);
      }
      
      queryClient.invalidateQueries({ queryKey: ['alarms'] });
      setScreen('list');
      setEditingAlarm(null);
    } catch (error) {
      console.error('Failed to save alarm:', error);
      Alert.alert('Error', 'Failed to save alarm');
    }
  }, [editingAlarm]);

  const handleDelete = useCallback(async (alarmId: string) => {
    try {
      await container.alarmUseCases.deleteAlarm(alarmId);
      queryClient.invalidateQueries({ queryKey: ['alarms'] });
      setScreen('list');
      setEditingAlarm(null);
    } catch (error) {
      console.error('Failed to delete alarm:', error);
      Alert.alert('Error', 'Failed to delete alarm');
    }
  }, []);

  const handleCancel = useCallback(() => {
    setScreen('list');
    setEditingAlarm(null);
  }, []);

  if (!isDbReady) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading} />
      </SafeAreaView>
    );
  }

  if (screen === 'form') {
    return (
      <AlarmFormScreen
        alarm={editingAlarm}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={editingAlarm ? () => handleDelete(editingAlarm.id) : undefined}
      />
    );
  }

  return (
    <AlarmListScreen
      onCreateAlarm={handleCreateAlarm}
      onEditAlarm={handleEditAlarm}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loading: {
    flex: 1,
    backgroundColor: '#121212',
  },
});
