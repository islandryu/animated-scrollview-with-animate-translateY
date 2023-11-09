import { StyleSheet, Text, View, TouchableOpacity
 } from 'react-native';
import React, { useState, useEffect, useCallback, useMemo,useRef } from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedRef,
  scrollTo,
  withSpring,
} from 'react-native-reanimated';
import { 
  PanGestureHandler,
  GestureHandlerRootView,
  GestureDetector,
  Gesture
 } from 'react-native-gesture-handler';

export default function App() {
  const scrollY = useSharedValue(0);
  const animatedScrollViewRef = useAnimatedRef();
  const previousValue = useSharedValue(0);
  const secondPreviousValue = useSharedValue(0);
  const onChangeRef = useRef("scroll");

  const onScroll = useAnimatedScrollHandler((event) => {
    const currentScrollY = event.contentOffset.y;

    if(onChangeRef.current === "scroll") {
      // scrollTo(animatedScrollViewRef, 0, secondPreviousValue.value, true);
      onChangeRef.current = "scrollTo";
      console.log("scrollTo");
    } else if(onChangeRef.current === "end") {
       secondPreviousValue.value = previousValue.value;
       previousValue.value = scrollY.value;
       scrollY.value = currentScrollY;
       onChangeRef.current = "scroll";
       console.log("scroll");
    } else {
      onChangeRef.current = "end";
      console.log("end");
    }
    // const isNearSecondPreviousValue = Math.abs(currentScrollY - secondPreviousValue.value) < 1;
    // const isNearPreviousValue = Math.abs(currentScrollY - previousValue.value) < 1;

    // console.log("currentScrollY", currentScrollY,  previousValue.value, secondPreviousValue.value);

    // if(isNearSecondPreviousValue) {
    //   // console.log("ok");
    //   // scrollTo(animatedScrollViewRef, 0, previousValue.value, true);
    // } else if (isNearPreviousValue) {
    //   console.log("ok", secondPreviousValue.value);
    //   scrollTo(animatedScrollViewRef, 0, secondPreviousValue.value, true);
    // } else {
    //   secondPreviousValue.value = previousValue.value;
    //   previousValue.value = scrollY.value;
    //   scrollY.value = currentScrollY;

    // }
  }, [animatedScrollViewRef]);

  const scrollViewStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: 300 -scrollY.value }],
      width: 300,
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: 0 }],
    };
  },[]);

  const panRef = useSharedValue(0);
  const [disable, setDisable] = useState(false);

  const pan = Gesture.Pan().onStart(() => {
    panRef.value = scrollY.value;
    console.log("start", panRef.value);
  }).onChange((event) => {
    console.log("change", panRef.value);
    scrollY.value = panRef.value - event.translationY;
    scrollTo(animatedScrollViewRef, 0, scrollY.value, false);
  }).onEnd(() => {
    scrollY.value = withSpring(scrollY.value + 10);
  });

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector
        gesture={pan}
        
      >
      <Animated.ScrollView 
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={scrollViewStyle}
        ref={animatedScrollViewRef}
        onLayout={() => {
          console.log('Layout event', Object.keys( animatedScrollViewRef.current));
          // Returns a reference to the component
          const component = animatedScrollViewRef.current;
        }}
      >
          {Array.from({ length: 100 }).map((_, i) => (
            <Text key={i}>{i}</Text>
          ))}
      </Animated.ScrollView>
      </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// // import Animated, { useAnimatedRef } from 'react-native-reanimated';

// export default function App() {
//   const animatedRef = useAnimatedRef();

//   return (
//     <View style={styles.container}>
//       <Animated.View
//         ref={animatedRef}
//         style={styles.box}
//         onLayout={() => {
//           console.log('Layout event', animatedRef.current);
//           // Returns a reference to the component
//           const component = animatedRef.current;
//         }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   box: {
//     height: 100,
//     width: 100,
//     backgroundColor: '#b58df1',
//     borderRadius: 20,
//     marginVertical: 64,
//   },
// });