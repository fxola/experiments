import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlarmForm } from '../components/AlarmForm';
import { Alarm } from '../../domain/alarm';
import { AlarmFactory, AlarmFormData } from '../../application/alarm/AlarmFactory';
import { container } from '../../di/container';

interface EditAlarmScreenProps {
  alarm: Alarm;
  onComplete: () => void;
}

export function EditAlarmScreen({ alarm, onComplete }: EditAlarmScreenProps) {
  const handleSave = async (formData: AlarmFormData) => {
    const params = AlarmFactory.createFromFormData(formData);
    await container.alarmUseCases.updateAlarm(alarm.id, params);
    onComplete();
  };

  const handleDelete = async () => {
    await container.alarmUseCases.deleteAlarm(alarm.id);
    onComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.header}>
        <Text style={styles.title}>Edit Alarm</Text>
      </View>
      <AlarmForm
        alarm={alarm}
        onSave={handleSave}
        onCancel={onComplete}
        onDelete={handleDelete}
      />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});
