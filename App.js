import { StyleSheet, Text, View, TouchableOpacity
 } from 'react-native';
import React, { useState, useEffect } from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

export default function App() {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  }, []);

  const scrollViewStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: 300 -scrollY.value }],
      width: 300,
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scrollY.value }],
    };
  },[]);

  return (
    <View style={styles.container}>
      <Animated.ScrollView 
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={scrollViewStyle}
      >
        <Animated.View style={[{ height: 5000, backgroundColor: 'red' }, contentStyle]} >
          {Array.from({ length: 100 }).map((_, i) => (
            <Text key={i}>{i}</Text>
          ))}
        </Animated.View>
      </Animated.ScrollView>
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

