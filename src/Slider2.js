import React from 'react';
import {StyleSheet, View, Alert, Button} from 'react-native';
import {shadowStyle} from './style';
import Knob from './Knob';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  interpolateColor,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {useSlider} from './useSlider';
import AnimatedText from './AnimatedText';

const SLIDER_WIDTH = 300;
const KNOB_WIDTH = 30;
const STEP = 100;
const SLIDER_RANGE = SLIDER_WIDTH - KNOB_WIDTH;

const Slider2 = () => {
  const onDragCompleteHandler = () => {
    Alert.alert(stepText.value, String(translateX.value));
  };

  const {
    onGestureEvent,
    values: {translateX, isSliding, stepText},
    styles: {scrollTranslationStyle, progressStyle},
  } = useSlider(SLIDER_WIDTH, KNOB_WIDTH, onDragCompleteHandler, STEP);

  const rotateStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [0, SLIDER_RANGE],
      [0, 4 * 360],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{rotate: `${rotate}deg`}],
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      [0, SLIDER_RANGE],
      ['rgb(129,212,250)', 'rgb(3,169,244)'],
    );

    return {
      backgroundColor,
    };
  });

  return (
    <>
      <View style={styles.slider}>
        <Animated.View
          style={[styles.progress, progressStyle, backgroundStyle]}
        />
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View style={[styles.knobContainer, scrollTranslationStyle]}>
            <Knob isSliding={isSliding} rotateStyle={rotateStyle} />
          </Animated.View>
        </PanGestureHandler>
      </View>

      <View style={{marginTop: 40}}>
        <AnimatedText text={stepText} />
      </View>

      <View>
        <Button
          title="Slide to beginning"
          onPress={() => {
            isSliding.value = true;
            translateX.value = withTiming(
              0,
              {
                duration: 3000,
                easing: Easing.bounce,
              },
              () => {
                isSliding.value = false;
              },
            );
          }}
        />
        <Button
          title="Slide to end"
          onPress={() => {
            isSliding.value = true;

            translateX.value = withTiming(
              SLIDER_RANGE,
              {
                duration: 1000,
                easing: Easing.linear,
              },
              () => {
                isSliding.value = false;
              },
            );
          }}
        />
      </View>
    </>
  );
};

export default Slider2;

const styles = StyleSheet.create({
  slider: {
    height: 20,
    width: SLIDER_WIDTH,
    borderRadius: 25,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    ...shadowStyle,
  },
  progress: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#87ceeb',
    borderRadius: 25,
  },
  knobContainer: {
    height: KNOB_WIDTH,
    width: KNOB_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
