import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlarmForm } from '../components/AlarmForm';
import { Alarm } from '../../domain/alarm';
import { AlarmFactory, AlarmFormData } from '../../application/alarm/AlarmFactory';
import { container } from '../../di/container';

interface CreateAlarmScreenProps {
  onComplete: () => void;
}

export function CreateAlarmScreen({ onComplete }: CreateAlarmScreenProps) {
  const handleSave = async (formData: AlarmFormData) => {
    const params = AlarmFactory.createFromFormData(formData);
    await container.alarmUseCases.createAlarm(params);
    onComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.header}>
      </View>
      <AlarmForm onSave={handleSave} onCancel={onComplete} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    height: 48,
  },
});
