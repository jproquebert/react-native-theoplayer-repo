import { StyleProp, Text, TextStyle } from 'react-native';
import React from 'react';
import styles from './TimeLabel.style';

export interface TimeLabelProps {
  currentTime: number;
  duration: number;
  isLive: boolean;
  style?: StyleProp<TextStyle>;
}
const LIVE_LABEL = 'LIVE';

export const TimeLabel = (props: TimeLabelProps) => {
  const { currentTime, duration, isLive, style } = props;

  // An unknown duration is reported as NaN.
  if (isNaN(duration)) {
    return <Text style={[styles.timeLabel, style]}>{currentTime}</Text>;
  }

  // Live streams report an Infinity duration.
  if (isLive || !isFinite(duration)) {
    return <Text style={[styles.timeLabel, style]}>{LIVE_LABEL}</Text>;
  }

  const renderHours = duration >= 3600 * 1e3;
  const s = renderHours ? 11 : 14;
  const currentTimeLabel = new Date(currentTime).toISOString().substring(s, 19);
  const durationLabel = new Date(duration).toISOString().substring(s, 19);
  return (
    <Text style={[styles.timeLabel, style]}>
      {currentTimeLabel} / {durationLabel}
    </Text>
  );
};
