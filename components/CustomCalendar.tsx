import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ArrowLeftIcon from '~/assets/icons/ArrowLeftIcon';
import ArrowRightIcon from '~/assets/icons/ArrowRightIcon';
import { Direction } from 'react-native-calendars/src/types';
import { useColorScheme } from '~/hooks/useColorScheme';

type CustomCalendarProps = {
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
};

const CustomCalendar = ({
  selectedDate,
  setSelectedDate,
}: CustomCalendarProps) => {
  const { isDarkMode } = useColorScheme();

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const markedDates = selectedDate
    ? {
        [selectedDate]: {
          selected: true,
          selectedColor: isDarkMode ? '#fff' : '#313131',
          selectedTextColor: isDarkMode ? 'white' : null,
        },
      }
    : {};

  return (
    <>
      <Calendar
        onDayPress={handleDayPress}
        renderArrow={(direction: Direction) => (
          <Text style={styles.headerButton}>
            {direction === 'left' ? <ArrowLeftIcon /> : <ArrowRightIcon />}
          </Text>
        )}
        theme={{
          todayTextColor: null,
          calendarBackground: null,
          // Customize the theme for unselected days
          'stylesheet.calendar.main': {
            dayContainer: {
              // Center the content
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent', // Transparent background for unselected days
            },
          },
          // Customize the theme for selected days
          'stylesheet.day.basic': {
            selected: {
              backgroundColor: 'blue', // Overrides the selectedColor in markedDates
              borderRadius: 5, // Round the selected date
            },
            selectedText: {
              color: 'white', // Overrides the selectedTextColor in markedDates
              fontWeight: 'bold', // Make the selected text bold
            },
            base: {
              width: 36, // Fixed width for days
              height: 36, // Fixed height for days
              alignItems: 'center',
              justifyContent: 'center',
            },
            text: {
              marginTop: 4, // Adjust to center vertically
              fontSize: 16,
              color: '#5d6970', // Default color for unselected date
            },
          },
        }}
        markedDates={markedDates}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButton: {
    fontSize: 24,
    paddingHorizontal: 8,
  },
  selectedDateText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  calendar: {
    // You can add overall calendar styles here
    borderRadius: 10,
    elevation: 2, // Add a shadow for Android
    margin: 10,
  },
});

export default CustomCalendar;
