import React, { useEffect, useRef, useState } from 'react'
import {
  TextInput,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native'

const TextField = (props) => {
  const {
    errorText,
    value,
    onBlur,
    onFocus,
    label,
    placeholder,
    ...restOfProps
  } = props
  let refProps = {}
  if (props.innerRef) {
    refProps = {restOfProps, ref : props.innerRef}
  }
  const [isFocused, setIsFocused] = useState(false)

  const focusAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused || !!value ? 1 : 0,
      duration: 150,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start()
  }, [focusAnim, isFocused, value])

  const setFocus = (data) => () => {
    setIsFocused(data)
  }

  let color = isFocused ? '#01403c' : '#B9C4CA'
  if (errorText) {
    color = '#B00020'
  }

  const animateStyle = [
    styles.labelContainer,
    {
      transform: [
        {
          scale: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.75],
          }),
        },
        {
          translateY: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [14, -12],
          }),
        },
        {
          translateX: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [6, 0],
          }),
        },
      ],
    },
    {zIndex: isFocused ? 1 : 0}, 
  ];

  const textInputStyle = [
    styles.input,
    {
      borderColor: color,
    },
    {borderWidth: isFocused ? 2 : 1}, 
  ];

  return (
    <>
      <Animated.Text style={animateStyle}>
        {isFocused ? label: ''}
      </Animated.Text>
      <TextInput
        style={textInputStyle}
        {...restOfProps}
        {...refProps}
        value={value}
        placeholder={isFocused ? placeholder : label}
        placeholderTextColor="#888"
        underlineColorAndroid="#f000"
        onBlur={setFocus(false)}
        onFocus={setFocus(true)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
    height: 50,
    color: '#000000',
    paddingHorizontal: 12,
    backgroundColor: '#f4f4f4',
  },
  labelContainer: {
    position: 'absolute',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    backgroundColor: '#f4f4f4',
  },
  label: {
    fontSize: 16,
  },
})

export default TextField