import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DAYS_OF_WEEK, DAY_NUMBERS } from '../../domain/alarm/value-objects';

interface RepeatDaysPickerProps {
  selectedDays: number[];
  onDaysChange: (days: number[]) => void;
}

export function RepeatDaysPicker({ selectedDays, onDaysChange }: RepeatDaysPickerProps) {
  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter((d) => d !== day));
    } else {
      onDaysChange([...selectedDays, day].sort());
    }
  };

  const selectAll = () => {
    onDaysChange([0, 1, 2, 3, 4, 5, 6]);
  };

  const selectWeekdays = () => {
    onDaysChange([1, 2, 3, 4, 5]);
  };

  const selectWeekends = () => {
    onDaysChange([0, 6]);
  };

  const clearAll = () => {
    onDaysChange([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.quickSelects}>
        <TouchableOpacity style={styles.quickButton} onPress={selectAll}>
          <Text style={styles.quickButtonText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickButton} onPress={selectWeekdays}>
          <Text style={styles.quickButtonText}>Weekdays</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickButton} onPress={selectWeekends}>
          <Text style={styles.quickButtonText}>Weekends</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.daysRow}>
        {DAY_NUMBERS.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDays.includes(day) && styles.dayButtonSelected,
            ]}
            onPress={() => toggleDay(day)}
          >
            <Text
              style={[
                styles.dayText,
                selectedDays.includes(day) && styles.dayTextSelected,
              ]}
            >
              {DAYS_OF_WEEK[day]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedDays.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <Text style={styles.clearButtonText}>Clear repeat</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  quickSelects: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  quickButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#333333',
  },
  quickButtonText: {
    color: '#ffffff',
    fontSize: 12,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#4a90d9',
  },
  dayText: {
    color: '#888888',
    fontSize: 12,
  },
  dayTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  clearButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  clearButtonText: {
    color: '#ff6b6b',
    fontSize: 14,
  },
});
