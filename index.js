import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import Touchable from 'react-native-platform-touchable'

const TabSwipe = ({
  index = 0,
}) => {
  const selectedStyle = { borderBottomWidth: 5, color: 'green' }
  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <View style={{ backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 5, borderBottomColor: 'black' }}>
          <Touchable style={{ flex: 1, ...(index === 0 ? selectedStyle : {})  }}>
            <Text>Tab 1</Text>
          </Touchable>
          <Touchable style={{ flex: 1, ...(index === 1 ? selectedStyle : {}) }}>
            <Text>Tab 2</Text>
          </Touchable>
          <Touchable style={{ flex: 1, ...(index === 2 ? selectedStyle : {}) }}>
            <Text>Tab 3</Text>
          </Touchable>
        </View>

        <View style={{ width: '100%' }}>
          <View style={{ width: '100%', backgroundColor: 'yellow' }} />
          <View style={{ width: '100%', backgroundColor: 'grey' }} />
          <View style={{ width: '100%', backgroundColor: 'cyan' }} />
        </View>
      </View>
    </View>
  )
}

export default TabSwipe
