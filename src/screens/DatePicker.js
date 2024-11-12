import React from 'react';
import {Calendar} from 'react-native-calendars';

const DatePicker = ({navigation, route}) => {

  const handleDate = (date) => {
    navigation.navigate('Agents', {dateValue: date});
  };

   return (
    <Calendar
      onDayPress={day => {
        handleDate(day.dateString)
      }}
      markedDates={{
        [route.params.dateValue]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
      }}
    />
  );
};

export default DatePicker;