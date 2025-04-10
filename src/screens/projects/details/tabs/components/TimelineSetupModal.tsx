import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, isValid, differenceInDays, addDays, getDaysInMonth, getDay, getDate, getMonth, getYear } from 'date-fns';
import { theme } from '../../../../../theme';

interface TimelineSetupModalProps {
  visible: boolean;
  startDate: Date;
  endDate: Date;
  showStartDatePicker: boolean;
  showEndDatePicker: boolean;
  onClose: () => void;
  onStartDateChange: (event: any, date?: Date) => void;
  onEndDateChange: (event: any, date?: Date) => void;
  onShowStartDatePicker: () => void;
  onShowEndDatePicker: () => void;
  onSubmit: () => void;
}

const TimelineSetupModal: React.FC<TimelineSetupModalProps> = ({
  visible,
  startDate,
  endDate,
  showStartDatePicker,
  showEndDatePicker,
  onClose,
  onStartDateChange,
  onEndDateChange,
  onShowStartDatePicker,
  onShowEndDatePicker,
  onSubmit,
}) => {
  const [currentMonth, setCurrentMonth] = useState(startDate);
  const [startDateText, setStartDateText] = useState(format(startDate, 'MM/dd/yyyy'));
  const [endDateText, setEndDateText] = useState(format(endDate, 'MM/dd/yyyy'));
  
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getDay(new Date(getYear(currentMonth), getMonth(currentMonth), 1));
    const days = [];
    
    // Header row with day names
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    // Calendar grid
    let dayCounter = 1;
    const rows = [];
    let cells = [];
    
    // Add header row
    rows.push(
      <View key="header" style={styles.calendarRow}>
        {dayNames.map((day, index) => (
          <View key={`header-${index}`} style={styles.calendarCell}>
            <Text style={styles.calendarHeaderText}>{day}</Text>
          </View>
        ))}
      </View>
    );
    
    // Add empty cells for days before first of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(
        <View key={`empty-${i}`} style={styles.calendarCell}>
          <Text style={styles.calendarEmptyText}></Text>
        </View>
      );
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(getYear(currentMonth), getMonth(currentMonth), day);
      const isToday = getDate(new Date()) === day && 
                     getMonth(new Date()) === getMonth(currentMonth) && 
                     getYear(new Date()) === getYear(currentMonth);
      const isSelected = (day === getDate(startDate) && 
                         getMonth(currentMonth) === getMonth(startDate) &&
                         getYear(currentMonth) === getYear(startDate)) ||
                        (day === getDate(endDate) && 
                         getMonth(currentMonth) === getMonth(endDate) &&
                         getYear(currentMonth) === getYear(endDate));
      
      const isInRange = date >= startDate && date <= endDate;
      
      cells.push(
        <TouchableOpacity 
          key={`day-${day}`} 
          style={[
            styles.calendarCell, 
            isSelected && styles.calendarSelectedCell,
            isInRange && styles.calendarRangeCell
          ]}
          onPress={() => {
            // Determine which date to update based on selection logic
            if (date < startDate || (getDate(startDate) === getDate(endDate) && getMonth(startDate) === getMonth(endDate))) {
              onStartDateChange(null, date);
            } else {
              onEndDateChange(null, date);
            }
          }}
        >
          <Text style={[
            styles.calendarDayText,
            isToday && styles.calendarTodayText,
            isSelected && styles.calendarSelectedText,
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
      
      // Create a new row after every 7 cells
      if ((firstDayOfMonth + dayCounter) % 7 === 0 || dayCounter === daysInMonth) {
        rows.push(
          <View key={`row-${dayCounter}`} style={styles.calendarRow}>
            {cells}
          </View>
        );
        cells = [];
      }
      
      dayCounter++;
    }
    
    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarMonthText}>{format(currentMonth, 'MMMM yyyy')}</Text>
          <View style={styles.calendarControls}>
            <TouchableOpacity 
              onPress={() => setCurrentMonth(prevMonth => addDays(prevMonth, -30))}
              style={styles.calendarControlButton}
            >
              <Feather name="chevron-left" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setCurrentMonth(prevMonth => addDays(prevMonth, 30))}
              style={styles.calendarControlButton}
            >
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
        {rows}
      </View>
    );
  };
  
  // Parse and validate a date string in MM/dd/yyyy format
  const parseDate = (dateString: string): Date | null => {
    // Regex to validate MM/dd/yyyy format
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/([0-9]{4})$/;
    if (!regex.test(dateString)) {
      return null;
    }

    const [month, day, year] = dateString.split('/').map(n => parseInt(n, 10));
    const date = new Date(year, month - 1, day);
    
    // Verify that the date is valid (e.g., not 02/31/2023)
    if (date.getMonth() !== month - 1 || date.getDate() !== day || date.getFullYear() !== year) {
      return null;
    }
    
    return date;
  };

  // Update the date input field for start date
  const handleStartDateTextChange = (text: string) => {
    setStartDateText(text);
    
    // Try to parse the date
    const parsedDate = parseDate(text);
    if (parsedDate) {
      onStartDateChange(null, parsedDate);
    }
  };

  // Update the date input field for end date
  const handleEndDateTextChange = (text: string) => {
    setEndDateText(text);
    
    // Try to parse the date
    const parsedDate = parseDate(text);
    if (parsedDate && parsedDate >= startDate) {
      onEndDateChange(null, parsedDate);
    }
  };

  // Update text when date changes via calendar
  React.useEffect(() => {
    setStartDateText(format(startDate, 'MM/dd/yyyy'));
    setEndDateText(format(endDate, 'MM/dd/yyyy'));
  }, [startDate, endDate]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Set Project Timeline</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.timelineSetupDescription}>
              Define the start and end dates for your project to better track progress and milestone completion.
            </Text>

            <View style={styles.dateInputsContainer}>
              <View style={styles.dateInputWrapper}>
                <Text style={styles.inputLabel}>Project Start Date</Text>
                {Platform.OS === 'web' ? (
                  <TextInput
                    style={styles.dateInput}
                    value={startDateText}
                    onChangeText={handleStartDateTextChange}
                    onFocus={() => {/* Keep this empty to allow editing */}}
                    placeholder="MM/DD/YYYY"
                  />
                ) : (
                  <View style={styles.dateInputContainer}>
                    <TextInput
                      style={styles.dateInput}
                      value={startDateText}
                      onChangeText={handleStartDateTextChange}
                      placeholder="MM/DD/YYYY"
                    />
                    <TouchableOpacity
                      style={styles.calendarButton}
                      onPress={onShowStartDatePicker}
                    >
                      <Feather name="calendar" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                )}
                {showStartDatePicker && Platform.OS !== 'web' && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onStartDateChange}
                  />
                )}
              </View>

              <View style={styles.dateInputWrapper}>
                <Text style={styles.inputLabel}>Project End Date</Text>
                {Platform.OS === 'web' ? (
                  <TextInput
                    style={styles.dateInput}
                    value={endDateText}
                    onChangeText={handleEndDateTextChange}
                    onFocus={() => {/* Keep this empty to allow editing */}}
                    placeholder="MM/DD/YYYY"
                  />
                ) : (
                  <View style={styles.dateInputContainer}>
                    <TextInput
                      style={styles.dateInput}
                      value={endDateText}
                      onChangeText={handleEndDateTextChange}
                      placeholder="MM/DD/YYYY"
                    />
                    <TouchableOpacity
                      style={styles.calendarButton}
                      onPress={onShowEndDatePicker}
                    >
                      <Feather name="calendar" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                )}
                {showEndDatePicker && Platform.OS !== 'web' && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    minimumDate={startDate}
                    onChange={onEndDateChange}
                  />
                )}
              </View>
            </View>

            {/* Calendar View */}
            {renderCalendar()}

            <View style={styles.durationContainer}>
              <Feather name="clock" size={16} color="#666" />
              <Text style={styles.durationText}>
                Duration: {differenceInDays(endDate, startDate)} days
              </Text>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={onSubmit}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#001532',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalBody: {
    padding: 20,
  },
  timelineSetupDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  dateInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dateInputWrapper: {
    width: '48%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  dateInput: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  calendarButton: {
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
  calendarContainer: {
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calendarMonthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  calendarControls: {
    flexDirection: 'row',
  },
  calendarControlButton: {
    padding: 8,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calendarCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarHeaderText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  calendarEmptyText: {
    color: 'transparent',
  },
  calendarDayText: {
    fontSize: 14,
    color: '#333',
  },
  calendarTodayText: {
    fontWeight: 'bold',
    color: '#001532',
  },
  calendarSelectedCell: {
    backgroundColor: '#001532',
    borderRadius: 20,
  },
  calendarRangeCell: {
    backgroundColor: 'rgba(0, 21, 50, 0.1)',
  },
  calendarSelectedText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f9',
    padding: 12,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#001532',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default TimelineSetupModal;
