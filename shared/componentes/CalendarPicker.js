import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import modalCss from './sass/Modal'


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
    this.props.dateChange(date)
  }
  render() {
    const { selectedStartDate } = this.state;
    return (
        <Modal
            onRequestClose={this.props.onClose}
            onDismiss={this.props.onClose}
            visible={this.props.show}
            transparent={true}
            animationType={"fade"}
        >
            <TouchableWithoutFeedback onPressOut={this.props.onClose}>
                <View style={stylesModal.modalOverlay} />
            </TouchableWithoutFeedback>
            <View style={[stylesModal.modalContent, {alignItems: "flex-start", width: 400, padding: 0}]}>
                <View style={styles.container}>
                    <CalendarPicker
                        scaleFactor={410}
                        weekdays={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']}
                        months={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                        previousTitle="Anterior"
                        nextTitle="Próximo"
                        onDateChange={this.onDateChange}
                        disabledDates={this.props.disabledDates}
                    />
                </View>
            </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#FFFFFF',
      marginRight: 12
    },
  });
const stylesModal = StyleSheet.create(modalCss);