import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { DAYS_OF_WEEK, DAY_NUMBERS } from '../../domain/alarm/value-objects';
import { Time } from '../../domain/alarm/value-objects';

interface TimePickerProps {
  hour: number;
  minute: number;
  onTimeChange: (hour: number, minute: number) => void;
}

export function TimePicker({ hour, minute, onTimeChange }: TimePickerProps) {
  const [selectedHour, setSelectedHour] = useState(hour);
  const [selectedMinute, setSelectedMinute] = useState(minute);

  const handleConfirm = () => {
    onTimeChange(selectedHour, selectedMinute);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const formatHour = (h: number) => h.toString().padStart(2, '0');
  const formatMinute = (m: number) => m.toString().padStart(2, '0');

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.timeDisplay}>
          {formatHour(selectedHour)}:{formatMinute(selectedMinute)}
        </Text>
      </View>

      <View style={styles.pickers}>
        <View style={styles.pickerColumn}>
          <Text style={styles.pickerLabel}>Hour</Text>
          <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
            {hours.map((h) => (
              <TouchableOpacity
                key={h}
                style={[
                  styles.pickerItem,
                  selectedHour === h && styles.selectedItem,
                ]}
                onPress={() => setSelectedHour(h)}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    selectedHour === h && styles.selectedText,
                  ]}
                >
                  {formatHour(h)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.pickerColumn}>
          <Text style={styles.pickerLabel}>Minute</Text>
          <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
            {minutes.map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.pickerItem,
                  selectedMinute === m && styles.selectedItem,
                ]}
                onPress={() => setSelectedMinute(m)}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    selectedMinute === m && styles.selectedText,
                  ]}
                >
                  {formatMinute(m)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmText}>Set Time</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  display: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timeDisplay: {
    fontSize: 64,
    fontWeight: '200',
    color: '#ffffff',
  },
  pickers: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pickerColumn: {
    alignItems: 'center',
    width: 80,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
  },
  picker: {
    height: 150,
    width: 80,
  },
  pickerItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: '#4a90d9',
  },
  pickerItemText: {
    fontSize: 20,
    color: '#ffffff',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#4a90d9',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  confirmText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
