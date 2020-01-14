import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Animated } from 'react-native'
import Touchable from 'react-native-platform-touchable'

const useEffectOnUpdate = (callback, dependencies) => {
  const alreadyCalledIt = useRef(false)
  useEffect(() => {
    if (alreadyCalledIt) {
      callback()
      return
    }

    alreadyCalledIt.current = true
  }, dependencies)
}

const TabSwipe = ({
  index = 0,
  onPressTab,
}) => {
  const tabsContainerLeftPosition = useRef(new Animated.Value(0))
  const animation = useRef()
  const [tabsContainerWidth, setTabsContainerWidth] = useState(-1)
  const selectedStyle = { borderBottomWidth: 5, color: 'green' }

  const onTabsLayout = ({nativeEvent: { layout: {width}}}) => {
    setTabsContainerWidth(width)
    tabsContainerLeftPosition.current = new Animated.Value((-index) * width)
  }

  useEffectOnUpdate(() => {
    if (animation.current && animation.current.stop) {
      animation.current.stop()
    }
    animation.current = Animated.timing(
      tabsContainerLeftPosition.current,
      {
        toValue: (-index) * tabsContainerWidth,
        duration: 200,
      }
    ).start()
  }, [index])

  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <View style={{ backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 5, borderBottomColor: 'black' }}>
          <Touchable onPress={() => onPressTab(0)} style={{ flex: 1, ...(index === 0 ? selectedStyle : {})  }}>
            <Text>Tab 1</Text>
          </Touchable>
          <Touchable onPress={() => onPressTab(1)} style={{ flex: 1, ...(index === 1 ? selectedStyle : {}) }}>
            <Text>Tab 2</Text>
          </Touchable>
          <Touchable onPress={() => onPressTab(2)} style={{ flex: 1, ...(index === 2 ? selectedStyle : {}) }}>
            <Text>Tab 3</Text>
          </Touchable>
        </View>

        <Animated.View onLayout={onTabsLayout} style={{ width: '100%', flexDirection: 'row', left: tabsContainerLeftPosition.current }}>
          <View style={{ width: '100%', height: 200, backgroundColor: 'yellow' }} />
          <View style={{ width: '100%', height: 200, backgroundColor: 'grey' }} />
          <View style={{ width: '100%', height: 200, backgroundColor: 'cyan' }} />
        </Animated.View>
      </View>
    </View>
  )
}

export default TabSwipe
