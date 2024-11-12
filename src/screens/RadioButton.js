import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const RadioButtons = (props) => {
  const radioPress = () => {
    props.setChecked(props?.item?.id)
  }
  return (
    <View>
        <TouchableOpacity  style={styles.radioWrapper} onPress={radioPress}>
            <View style={[styles. radioCircle, props.style]}>
                {
                    props?.checked == props?.item?.id ?
                    <View style={styles.cicleSelected} />
                    : null
                }
            </View>
            <Text style={styles.textlabel}>
                {props?.item?.label}
            </Text>
        </TouchableOpacity>
    </View>
 )
}

export default RadioButtons

const styles = StyleSheet.create({
    radioWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin:5,
    },
    radioCircle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cicleSelected: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#000',
    },
    textlabel: {
        marginLeft: 5,
        fontWeight:"500",
        fontSize:14,
        textTransform:"capitalize"
    }
})