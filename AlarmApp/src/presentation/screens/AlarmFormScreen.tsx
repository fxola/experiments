import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlarmForm } from '../components/AlarmForm';
import { Alarm } from '../../domain/alarm';

interface AlarmFormScreenProps {
  alarm?: Alarm | null;
  onSave: (formData: import('../../application/alarm/AlarmFactory').AlarmFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function AlarmFormScreen({ alarm, onSave, onCancel, onDelete }: AlarmFormScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.header}>
        <Text style={styles.title}>
          {alarm ? 'Edit Alarm' : 'New Alarm'}
        </Text>
      </View>
      <AlarmForm 
        alarm={alarm ?? undefined} 
        onSave={onSave} 
        onCancel={onCancel} 
        onDelete={onDelete}
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
});
