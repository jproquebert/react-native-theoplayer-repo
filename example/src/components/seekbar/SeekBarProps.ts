// default value when skipping forward
import type { TimeRange } from '../../../../src/api/timeranges/TimeRange';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export const SKIP_FORWARD_MSEC_DEFAULT = 30000;

// default value when skipping backwards
export const SKIP_BACKWARD_MSEC_DEFAULT = 15000;

// wait for scrubbing to settle down before doing an actual seek
export const SEEK_TIMER_DELAY_MSEC = 500;

// wait for a number of time updates after seeking to avoid progress jumps.
export const TIMEUPDATES_AFTER_SEEKING = 3;

export interface SeekBarProps {
  /**
   * Invoked on TV platforms when the user presses the progress dot.
   */
  onDotPress?: () => void;

  /**
   * Invoked after the scrubber settles.
   */
  onSeek?: (time: number) => void;

  /**
   * Invoked when the user starts scrubbing.
   */
  onStartScrubbing?: () => void;

  /**
   * Invoked on each scrubber time change.
   */
  onScrubbingPositionChanged?: (time: number, prevTime: number) => void;

  /**
   * Invoked when the user stops scrubbing.
   */
  onStopScrubbing?: () => void;

  /**
   * Used to set whether the current media is a live stream.
   */
  isLive: boolean;

  /**
   * Used to set the current media's seekable range.
   */
  seekable: TimeRange[];

  /**
   * Used to set the player's currentTime.
   */
  currentTime: number;

  /**
   * Used to set the amount of time the seek bar will skip forward, in milliseconds.
   * By default equals to SKIP_FORWARD_MSEC_DEFAULT.
   */
  skipForwardMsec?: number;

  /**
   * Used to set the amount of time the seek bar will skip backward, in milliseconds.
   * By default equals to SKIP_BACKWARD_MSEC_DEFAULT.
   */
  skipBackwardMsec?: number;

  /**
   * Optional style applied to the SeekBar.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional style applied to the progressDot.
   */
  progressDotStyle?: StyleProp<ViewStyle>;

  /**
   * Optional style applied to the progress label.
   */
  labelStyle?: StyleProp<TextStyle>;
}
