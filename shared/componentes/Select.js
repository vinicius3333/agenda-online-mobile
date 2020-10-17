import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import theme from '../themes/baseTheme'

export default class App extends React.Component {
    pickerSelectStyles = StyleSheet.create({
      inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: this.props.disabled ? theme.colors.disabled : theme.colors.borderColor,
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
      },
      inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: this.props.disabled ? theme.colors.disabled : theme.colors.borderColor,
        borderRadius: 2,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
      },
    });

    constructor(props) {
        super(props);

        this.inputRefs = {
            select: ''
        };

        this.state = {
            value: ''
        };
    }

    handlerValueChange (value) {
        if ([null, '', undefined].includes(value) || this.state.value === value) {
            return;
        } else {
            this.setState({value})
            this.props.onValueChange(value)
        }
    }

  render() {
    const placeholder = {
      label: this.props.placeholder || '',
      value: null,
      color: this.props.disabled ? theme.colors.disabled : theme.colors.borderColor
    };

    return (
      <View>
          <RNPickerSelect
            key={this.state.value}
            disabled={this.props.disabled || false}
            placeholder={placeholder}
            items={this.props.items || []}
            onValueChange={value => {
                this.handlerValueChange(value)
            }}
            style={{...this.pickerSelectStyles, placeholder: {
                color: this.props.disabled ? theme.colors.disabled : theme.colors.borderColor
            },}}
            value={this.state.value}
            useNativeAndroidPickerStyle={false}
            ref={el => {
              this.inputRefs.select = el;
            }}
          />
      </View>
    );
  }
}

