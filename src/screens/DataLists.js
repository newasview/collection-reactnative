import React from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

/**
 * Fuctional component variables
 */

const DataLists = ({data, columns}) => {
  const renderItem = ({item, index}) => {
    return (
      <View style={styles.rowWrapper}>
        {columns.map((key, index) => {
          const keyItem = Object.keys(key);
          return (
            <Text key={index} style={{fontSize: 18}}>
              {item[keyItem]}
            </Text>
          );
        })}
      </View>
    );
  };

  if (data.length) {
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item + ''}
      />
    );
  } else {
    return <ActivityIndicator />;
  }
};
export default DataLists;

/**
 * Fuctional component styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  item: {
    backgroundColor: '#000000',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
  },
});
