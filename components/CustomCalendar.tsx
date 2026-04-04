import React from 'react';
import { Calendar } from 'react-native-calendars';
import { Text, StyleSheet } from 'react-native';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import { Direction } from 'react-native-calendars/src/types';
import { useColorScheme } from '@/hooks/useColorScheme';

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
          selectedTextColor: isDarkMode ? 'white' : undefined,
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
        theme={
          {
            // Customize the theme for unselected days
            'stylesheet.calendar.main': {
              dayContainer: {
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              },
            },
            // Customize the theme for selected days
            'stylesheet.day.basic': {
              selected: {
                backgroundColor: 'blue',
                borderRadius: 5,
              },
              selectedText: {
                color: 'white',
                fontWeight: 'bold',
              },
              base: {
                width: 36,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
              },
              text: {
                marginTop: 4,
                fontSize: 16,
                color: '#5d6970',
              },
            },
          } as any
        }
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
