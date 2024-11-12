import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {GenericStyles} from '../styles/Styles';

/**
 * Functional component variables
 */
const Home = ({navigation}) => {
  return (
    <ScrollView nestedScrollEnabled={true} style={styles.scrollView}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.btnWrapper}
          onPress={() => navigation.navigate('Accounts')}
          activeOpacity={0.5}>
          <Text style={GenericStyles.buttonTextStyle}>Accounts</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.btnWrapper}
          onPress={() => navigation.navigate('FundTransferView')}
          activeOpacity={0.5}>
          <Text style={GenericStyles.buttonTextStyle}>Fund Transfers</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Home;
/**
 * Functional component Styles
 */
const styles = StyleSheet.create({
  scrollView: {
    // flexGrow: 3,
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#f4f4f4',
    position: 'relative',
    top: 40,
    left: 50,
  },
  btnWrapper: {
    marginBottom: 40,
    height: 100,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#01403c',
  },
});
