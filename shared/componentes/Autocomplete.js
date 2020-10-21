import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  LayoutAnimation,
  Image
} from 'react-native'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import Icon from 'react-native-vector-icons/MaterialIcons'
import color from 'color'
import theme from '../themes/baseTheme'

// Sorry for the mess

const items = [
  {
    id: 0,
    children: []
  }
]

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    display: "flex",
    flexDirection: 'row',
    height: "100%"
  },
  container: {
    paddingTop: 8,
    paddingHorizontal: 0,
  },
  welcome: {
    fontSize: 16,
    color: '#333',
    paddingBottom: 4
  },
  border: {
    borderBottomWidth: 20,
    borderBottomColor: '#dadada',
    marginBottom: 20
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 20
  },
  label: {
    fontWeight: 'bold'
  },
  switch: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  }
})

const Loading = () =>
    <View style={styles.center}>
      <ActivityIndicator size="large" color="red" />
    </View>
  

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      items: null,
      selectedItems: [],
      selectedItems2: [],
      loading: false,
      selectedItemObjects: [],
      currentItems: [],
      showDropDowns: false,
      single: false,
      readOnlyHeadings: false,
      highlightChildren: false,
      selectChildren: false,
      hideChipRemove: false,
      hasErrored: false
    }
    this.termId = 100
    this.maxItems = 5
  }

  componentDidMount() {
    this.pretendToLoad()
    // programatically opening the select
    // this.SectionedMultiSelect._toggleSelector()
  }

  // custom icon renderer passed to iconRenderer prop
  // see the switch for possible icon name
  // values
  icon = ({ name, size = 18, style }) => {
    // flatten the styles
    const flat = StyleSheet.flatten(style)
    // remove out the keys that aren't accepted on View
    const { color, fontSize, ...styles } = flat

    let iconComponent
    // the colour in the url on this site has to be a hex w/o hash
    const iconColor =
      color && color.substr(0, 1) === '#' ? `${color.substr(1)}/` : '/'

    const Search = (
      <Image
        source={{ uri: `https://png.icons8.com/search/${iconColor}ios/` }}
        style={{ width: size, height: size }}
      />
    )

    switch (name) {
      case 'search':
        iconComponent = Search
        break
      case 'keyboard-arrow-up':
        iconComponent = Up
        break
      case 'keyboard-arrow-down':
        iconComponent = Down
        break
      case 'close':
        iconComponent = Close
        break
      case 'check':
        iconComponent = Check
        break
      case 'cancel':
        iconComponent = Cancel
        break
      default:
        iconComponent = null
        break
    }
    return <View style={styles}>{iconComponent}</View>
  }

  getProp = (object, key) => object && object[key]

  rejectProp = (items, fn) => items.filter(fn)

  pretendToLoad = () => {
    this.setState({ items })
  }

  filterItems = (searchTerm, items, { subKey, displayKey, uniqueKey }) => {
    let filteredItems = []
    let newFilteredItems = []
      items.forEach(item => {
        const parts = searchTerm
          .replace(/[\^$\\.*+?()[\]{}|]/g, '\\$&')
          .trim()
          .split(' ')
        const regex = new RegExp(`(${parts.join('|')})`, 'i')
        if (regex.test(this.getProp(item, displayKey))) {
          filteredItems.push(item)
        }
        if (item[subKey]) {
          const newItem = Object.assign({}, item)
          newItem[subKey] = []
          item[subKey].forEach(sub => {
            if (regex.test(this.getProp(sub, displayKey))) {
              newItem[subKey] = [...newItem[subKey], sub]
              newFilteredItems = this.rejectProp(
                filteredItems,
                singleItem => item[uniqueKey] !== singleItem[uniqueKey]
              )
              newFilteredItems.push(newItem)
              filteredItems = newFilteredItems
            }
          })
        }
      })
    return filteredItems
  }

  onSelectedItemsChange = selectedItems => {

    if (selectedItems.length >= this.maxItems) {
      if (selectedItems.length === this.maxItems) {
        this.setState({ selectedItems })
      }
      this.setState({
        maxItems: true
      })
      return
    }
    this.setState({
      maxItems: false
    })

    const filteredItems = selectedItems.filter(
      val => !this.state.selectedItems2.includes(val)
    )
    this.setState({ selectedItems: filteredItems })
  }

  onConfirm = () => {
    this.setState({ currentItems: this.state.selectedItems })
  }

  onCancel = () => {
    this.SectionedMultiSelect._removeAllItems()

    this.setState({
      selectedItems: this.state.currentItems
    })
  }
  onSelectedItemObjectsChange = selectedItemObjects => {
    this.setState({ selectedItemObjects })
    this.props.onChangeItem(selectedItemObjects[0].title)
  }

  noResults = (
    <View key="a" style={styles.center}>
      <Text>Desculpe, não foi encontrado nenhum resultado...</Text>
    </View>
  )

  handleAddSearchTerm = () => {
    const searchTerm = this.SectionedMultiSelect._getSearchTerm()
    const id = (this.termId += 1)
    if (
      searchTerm.length &&
      !(this.state.items || []).some(item => item.title.includes(searchTerm))
    ) {
      const newItem = { id, title: searchTerm }
      this.setState(prevState => ({
        items: [...(prevState.items || []), newItem]
      }))
      this.onSelectedItemsChange([...this.state.selectedItems, id])
      this.SectionedMultiSelect._submitSelection()
    }
  }

  searchAdornment = searchTerm =>
    searchTerm.length ? (
      <TouchableOpacity
        style={{ alignItems: 'flex-start', justifyContent: 'center' }}
        onPress={this.handleAddSearchTerm}>
        <View style={{}}>
          <Image
            source={{ uri: 'https://png.icons8.com/plus' }}
            style={{ width: 16, height: 16, marginHorizontal: 15 }}
          />
          {/*   <Icon size={18} style={{ marginHorizontal: 15 }} name="add" /> */}
        </View>
      </TouchableOpacity>
    ) : null

  renderSelectText = () => {
    const { selectedItemObjects } = this.state
    const { value } = this.props

    if (value) {
      return <Text style={{  fontSize: 16, width: 200, padding: 8 }}>{value}</Text>
    }

    const selectText = selectedItemObjects.length
      ? `${selectedItemObjects
          .map((item, i) => {
            let label = `${item.title}`
            if (i === selectedItemObjects.length - 1) label = `${item.title}`
            return label
          })
          .join('')}`
      : this.props.placeholder
    return <Text style={{  fontSize: 16, width: 200, padding: 8 }}>{selectText}</Text>
  }

  render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.container}>
        <SectionedMultiSelect
          items={this.props.items}
          ref={SectionedMultiSelect => {
            (this.SectionedMultiSelect = SectionedMultiSelect)
          }}
          onChangeText={(texto) => {
            this.props.pesquisarTexto(texto)
          }}
          uniqueKey="id"
          subKey="children"
          displayKey="title"
          iconKey="icon"
          autoFocus
          modalWithTouchable
          modalWithSafeAreaView
          // showCancelButton
          // hideConfirm
          loading={this.props.loading}
          filterItems={this.filterItems}
          // alwaysShowSelectText
          chipsPosition="top"
          renderSelectText={this.renderSelectText}
          noResultsComponent={this.noResults}
          loadingComponent={
            <Loading
              hasErrored={this.state.hasErrored}
            />
          }
          IconRenderer={Icon}
          //  cancelIconComponent={<Text style={{color:'white'}}>Cancel</Text>}
          showDropDowns={false}
          expandDropDowns={false}
          animateDropDowns={false}
          readOnlyHeadings={true}
          single={true}
          searchPlaceholderText={this.props.searchPlaceholderText}
          showRemoveAll
          hideChipRemove={false}
          selectChildren={true}
          highlightChildren={true}
          //  hideSearch
          //  itemFontFamily={fonts.boldCondensed}
          onSelectedItemsChange={this.onSelectedItemsChange}
          onSelectedItemObjectsChange={this.onSelectedItemObjectsChange}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
          confirmText='Confirmar'
          selectedItems={this.state.selectedItems}
          colors={{ primary: '#5c3a9e', success: '#5c3a9e', searchPlaceholderTextColor: theme.colors.placeholder }}
          itemNumberOfLines={3}
          selectLabelNumberOfLines={3}
          styles={{
            // chipText: {
            //   maxWidth: Dimensions.get('screen').width - 90,
            // },
            // itemText: {
            //   color: this.state.selectedItems.length ? 'black' : 'lightgrey'
            // },
            // selectedItemText: {
            //   color: 'blue',
            // },
            // subItemText: {
            //   color: this.state.selectedItems.length ? 'black' : 'lightgrey'
            // },
            item: {
              paddingHorizontal: 10
            },
            subItem: {
              paddingHorizontal: 10
            },
            selectedItem: {
              backgroundColor: 'rgba(0,0,0,0.1)'
            },
            selectedSubItem: {
              backgroundColor: 'rgba(0,0,0,0.1)'
            },
            // selectedSubItemText: {
            //   color: 'blue',
            // },
            scrollView: { paddingHorizontal: 0 },
            selectToggle: {borderColor: color('#000000').alpha(0.54).rgb().string(), borderWidth: 1, borderRadius: 2, paddingHorizontal: 4, paddingVertical: 2}
          }}
        />
        {/* <View>
          <TouchableWithoutFeedback
            onPress={() => this.SectionedMultiSelect._removeAllItems()}>
            <View style={styles.switch}>
              <Text style={styles.label}>Remove All</Text>
            </View>
          </TouchableWithoutFeedback>
        </View> */}
      </ScrollView>
    )
  }
}