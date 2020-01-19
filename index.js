import React, { useEffect, useRef, useState, useContext } from 'react'
import { View, Text, Animated } from 'react-native'
import Touchable from 'react-native-platform-touchable'
import { PanGestureHandler, State } from 'react-native-gesture-handler'

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

const childrenNumber = 3

const TabContext = React.createContext()

const withContext = Component => ({
  index: initialIndex,
  ...restOfProps
}) => {
  const [index, setIndex] = useState(initialIndex)
  const [tabsWidth, setTabsWidth] = useState(-1)
  const [tabsContainerLeftPosition, setTabsContainerLeftPosition] = useState(new Animated.Value(0))
  const animation = useRef()

  const onTabsLayout = ({nativeEvent: { layout: {width}}}) => {
    setTabsWidth(width)
  }

  useEffect(() => {
    setTabsContainerLeftPosition(new Animated.Value((-index) * tabsWidth))
  }, [tabsWidth])

  animateToIndex = (newIndex) => {
    if (animation.current && animation.current.stop) {
      animation.current.stop()
    }
    animation.current = Animated.timing(
      tabsContainerLeftPosition,
      {
        toValue: (-newIndex) * tabsWidth,
        duration: 100,
      }
    ).start()
  }

  useEffectOnUpdate(() => {
    animateToIndex(index)
  }, [index])

  return (
    <TabContext.Provider
      value={{
        index,
        setIndex,
        tabsWidth,
        tabsContainerLeftPosition: tabsContainerLeftPosition,
        animateToIndex,
      }}
    >
      <Component
        {...restOfProps}
        onPressTab={newIndex => setIndex(newIndex)}
        index={index}
        onTabsLayout={onTabsLayout}
        tabsLeftPosition={tabsContainerLeftPosition}
      />
    </TabContext.Provider>
  )
}

const withTabControl = TabSwipeComponent => props => {
  const contextState = useContext(TabContext)

  useEffectOnUpdate(() => {
    contextState.animateToIndex(contextState.index)
  }, [contextState.index])

  return (
    <TabSwipeComponent
      {...props}
    />
  )
}

const withSwipeControl = TabSwipeComponent => props => {
  const contextState = useContext(TabContext)
  const rawXOffsetDrag = useRef(null)

  return (
    <PanGestureHandler
      onGestureEvent={({ nativeEvent: { translationX } }) => {
        rawXOffsetDrag.current = translationX

        let newLeftPosition = contextState.tabsWidth * (-contextState.index) + translationX
        contextState.tabsContainerLeftPosition.setValue(
          newLeftPosition
        )
      }}
      onHandlerStateChange={({ nativeEvent: { state } }) => {
        const value = rawXOffsetDrag.current
        if (state === State.END) {
          const scrolledMoreThanHalfTabWidth = Math.abs(value) > contextState.tabsWidth / 3
          const tabsScrolledToRight = value > 0
          const tabsScrolledToLeft = value < 0

          if (
            !scrolledMoreThanHalfTabWidth
            || (tabsScrolledToRight && contextState.index === 0)
            || (tabsScrolledToLeft && contextState.index === childrenNumber - 1)
          ) {
            contextState.animateToIndex(contextState.index)
            return
          }

          if (scrolledMoreThanHalfTabWidth && tabsScrolledToLeft) {
            contextState.setIndex(contextState.index + 1)
          }
          if (scrolledMoreThanHalfTabWidth && tabsScrolledToRight) {
            contextState.setIndex(contextState.index - 1)
          }
        }
      }}
    >
      <View style={{ backgroundColor: 'green', flexDirection: 'row' }}>
        <TabSwipeComponent {...props}/>
      </View>
    </PanGestureHandler>
  )
}

const TabSwipe = ({
  index = 0,
  onPressTab,
  tabsLeftPosition,
  onTabsLayout,
  children,
}) => {
  const selectedStyle = { borderBottomWidth: 5, color: 'green' }

  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <View style={{ backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 5, borderBottomColor: 'black' }}>
          {
            React.Children.map(children, (_child, childrenIndex) => (
              <Touchable key={`child_${childrenIndex}`} onPress={() => onPressTab(childrenIndex)} style={{ flex: 1, ...(index === childrenIndex ? selectedStyle : {})  }}>
                <Text>Tab {childrenIndex}</Text>
              </Touchable>
            ))
          }
        </View>

        <Animated.View onLayout={onTabsLayout} style={{ width: '100%', flexDirection: 'row', left: tabsLeftPosition }}>
          { children }
        </Animated.View>
      </View>
    </View>
  )
}

export default TabSwipe
export { withTabControl, withContext, withSwipeControl }
