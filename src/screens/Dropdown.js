import React, { useRef, useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
  Image,
  TextInput,
} from 'react-native';

const Dropdown = ({ label, data, onSelect, labelName, isSearch = false }) => {
  const DropdownButton = useRef();
  const [searchData, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('');
  const [dropdownTop, setDropdownTop] = useState({top: 0, left: 0});

  const toggleDropdown = () => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = () => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop({top: py + h, left: _px});
    });
    setVisible(true);
  };

  useEffect(() => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop({top: py + h, left: _px});
    });
  }, [])

  const onItemPress = (item) => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  const handleText = (text) => {
    const re = new RegExp(text, 'i');
    let filteredData = data.filter(item => {
      return item[labelName].match(re);
    });
    setSearch(filteredData);
    setVisible(true);
    setQuery(text)
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text>{item[labelName]}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = () => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.dropdown, { top: dropdownTop.top, left: dropdownTop.left }]}>
            {isSearch ? <View style={styles.textBox}>
              <Image
                source={require('../../assets/search.png')}
                style={styles.searchIcon}
              />
              <TextInput value={query} style={styles.textInput} placeholder='Search' autoCorrect={false} onChangeText={handleText} />
            </View> : ''}
            <FlatList
              persistentScrollbar
              style={{maxHeight:250}}
              data={searchData || data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={styles.button}
      onPress={toggleDropdown}
    >
      {renderDropdown()}
      <Text style={styles.textLabel} numberOfLines={1}>
        {(selected && selected[labelName]) || label}
      </Text>
      <Image style={styles.arrowImage} source={require('../../assets/down-arrow.png')} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ebedf0',
    borderColor: '#ccc',
    borderWidth: 1,
    height: 40,
    zIndex: 1,
    paddingLeft: 10,
    paddingRight: 5,
  },
  arrowImage: {
    height: 25,
    width: 25,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    right: 20
  },
  overlay: {
    width: '100%',
    height: '100%',
    overflow: 'auto'
  },
  textBox: {
    paddingLeft: 25,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    flex: 1,
    width: '100%',
    height: 40,
    flexDirection: 'row',
  },
  textInput: {
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    top: 9,
    left: 5,
    width: 20,
    height: 20,
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef'
  },
});

export default Dropdown;