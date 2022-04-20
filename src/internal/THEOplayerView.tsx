import React, { PureComponent } from 'react';
import { StyleSheet, requireNativeComponent, View, UIManager, Platform, NativeSyntheticEvent } from 'react-native';
import type {
  DurationChangeEvent,
  ErrorEvent,
  LoadedMetadataEvent,
  ReadyStateChangeEvent,
  THEOplayerViewComponent,
  THEOplayerViewProps,
  TimeUpdateEvent,
  ProgressEvent,
  PlayerError,
  SegmentNotFoundEvent,
} from 'react-native-theoplayer';

import styles from './THEOplayerView.style';
import type { SourceDescription } from 'react-native-theoplayer';

interface THEOplayerRCTViewProps extends THEOplayerViewProps {
  ref: React.RefObject<THEOplayerViewNativeComponent>;
  src: SourceDescription;
  seek?: number;

  onNativeSourceChange: () => void;
  onNativeLoadStart: () => void;
  onNativeLoadedData: () => void;
  onNativeLoadedMetadata: (event: NativeSyntheticEvent<LoadedMetadataEvent>) => void;
  onNativeReadyStateChange?: (event: NativeSyntheticEvent<ReadyStateChangeEvent>) => void;
  onNativeError: (event: NativeSyntheticEvent<ErrorEvent>) => void;
  onNativeProgress: (event: NativeSyntheticEvent<ProgressEvent>) => void;
  onNativePlay: () => void;
  onNativePlaying: () => void;
  onNativePause: () => void;
  onNativeSeeking: () => void;
  onNativeSeeked: () => void;
  onNativeEnded: () => void;
  onNativeTimeUpdate: (event: NativeSyntheticEvent<TimeUpdateEvent>) => void;
  onNativeDurationChange: (event: NativeSyntheticEvent<DurationChangeEvent>) => void;
  onNativeSegmentNotFound: (event: NativeSyntheticEvent<SegmentNotFoundEvent>) => void;
  onNativeFullscreenPlayerWillPresent?: () => void;
  onNativeFullscreenPlayerDidPresent?: () => void;
  onNativeFullscreenPlayerWillDismiss?: () => void;
  onNativeFullscreenPlayerDidDismiss?: () => void;
}

interface THEOplayerRCTViewState {
  isBuffering: boolean;
  error?: PlayerError;
}

interface THEOplayerViewNativeComponent extends THEOplayerViewComponent {
  setNativeProps: (props: Partial<THEOplayerRCTViewProps>) => void;
}

export class THEOplayerView extends PureComponent<THEOplayerViewProps, THEOplayerRCTViewState> {
  private readonly _root: React.RefObject<THEOplayerViewNativeComponent>;

  private static initialState: THEOplayerRCTViewState = {
    isBuffering: false,
    error: undefined,
  };

  constructor(props: THEOplayerRCTViewProps) {
    super(props);
    this._root = React.createRef();
    this.state = THEOplayerView.initialState;
  }

  public seek(time: number): void {
    if (isNaN(time)) {
      throw new Error('Specified time is not a number');
    }
    this.setNativeProps({ seek: time });
  }

  private reset() {
    this.setState(THEOplayerView.initialState);
  }

  private setNativeProps(nativeProps: Partial<THEOplayerRCTViewProps>) {
    if (this._root?.current) {
      this._root.current.setNativeProps(nativeProps);
    }
  }

  private maybeChangeBufferingState(isBuffering: boolean) {
    const { isBuffering: wasBuffering, error } = this.state;
    const { paused } = this.props;

    // do not change state to buffering in case of an error or if the player is paused
    const newIsBuffering = isBuffering && !error && !paused;
    this.setState({ isBuffering: newIsBuffering });

    // notify change in buffering state
    if (newIsBuffering !== wasBuffering && this.props.onBufferingStateChange) {
      this.props.onBufferingStateChange(isBuffering);
    }
  }

  private _onSourceChange = () => {
    this.reset();

    if (this.props.onSourceChange) {
      this.props.onSourceChange();
    }
  };

  private _onLoadStart = () => {
    // potentially notify change in buffering state
    this.maybeChangeBufferingState(true);

    if (this.props.onLoadStart) {
      this.props.onLoadStart();
    }
  };

  private _onLoadedData = () => {
    if (this.props.onLoadedData) {
      this.props.onLoadedData();
    }
  };

  private _onLoadedMetadata = (event: NativeSyntheticEvent<LoadedMetadataEvent>) => {
    if (this.props.onLoadedMetadata) {
      this.props.onLoadedMetadata(event.nativeEvent);
    }
  };

  private _onError = (event: NativeSyntheticEvent<ErrorEvent>) => {
    const { error } = event.nativeEvent;
    this.setState({ error });

    // potentially notify change in buffering state
    this.maybeChangeBufferingState(false);

    if (this.props.onError) {
      this.props.onError(event.nativeEvent);
    }
  };

  private _onProgress = (event: NativeSyntheticEvent<ProgressEvent>) => {
    if (this.props.onProgress) {
      this.props.onProgress(event.nativeEvent);
    }
  };

  private _onPlay = () => {
    if (this.props.onPlay) {
      this.props.onPlay();
    }
  };

  private _onPlaying = () => {
    if (this.props.onPlaying) {
      this.props.onPlaying();
    }
  };

  private _onPause = () => {
    if (this.props.onPause) {
      this.props.onPause();
    }
  };

  private _onSeeking = () => {
    if (this.props.onSeeking) {
      this.props.onSeeking();
    }
  };

  private _onSeeked = () => {
    if (this.props.onSeeked) {
      this.props.onSeeked();
    }
  };

  private _onEnded = () => {
    if (this.props.onEnded) {
      this.props.onEnded();
    }
  };

  private _onReadStateChange = (event: NativeSyntheticEvent<ReadyStateChangeEvent>) => {
    // potentially notify change in buffering state
    this.maybeChangeBufferingState(event.nativeEvent.readyState < 3);

    if (this.props.onReadyStateChange) {
      this.props.onReadyStateChange(event.nativeEvent);
    }
  };

  private _onTimeUpdate = (event: NativeSyntheticEvent<TimeUpdateEvent>) => {
    if (this.props.onTimeUpdate) {
      this.props.onTimeUpdate(event.nativeEvent);
    }
  };

  private _onDurationChange = (event: NativeSyntheticEvent<DurationChangeEvent>) => {
    if (this.props.onDurationChange) {
      this.props.onDurationChange(event.nativeEvent);
    }
  };

  private _onSegmentNotFound = (event: NativeSyntheticEvent<SegmentNotFoundEvent>) => {
    if (this.props.onSegmentNotFound) {
      this.props.onSegmentNotFound(event.nativeEvent);
    }
  };

  private _onFullscreenPlayerWillPresent = () => {
    if (this.props.onFullscreenPlayerWillPresent) {
      this.props.onFullscreenPlayerWillPresent();
    }
  };

  private _onFullscreenPlayerDidPresent = () => {
    if (this.props.onFullscreenPlayerDidPresent) {
      this.props.onFullscreenPlayerDidPresent();
    }
  };

  private _onFullscreenPlayerWillDismiss = () => {
    if (this.props.onFullscreenPlayerWillDismiss) {
      this.props.onFullscreenPlayerWillDismiss();
    }
  };

  private _onFullscreenPlayerDidDismiss = () => {
    if (this.props.onFullscreenPlayerDidDismiss) {
      this.props.onFullscreenPlayerDidDismiss();
    }
  };

  public render(): JSX.Element {
    const wrapperProps = Object.assign({}, this.props);

    return (
      <View style={[styles.base, wrapperProps.style]}>
        <THEOplayerRCTView
          ref={this._root}
          src={this.props.source || {}}
          onNativeSourceChange={this._onSourceChange}
          onNativeLoadStart={this._onLoadStart}
          onNativeLoadedData={this._onLoadedData}
          onNativeLoadedMetadata={this._onLoadedMetadata}
          onNativeError={this._onError}
          onNativeProgress={this._onProgress}
          onNativePlay={this._onPlay}
          onNativePlaying={this._onPlaying}
          onNativePause={this._onPause}
          onNativeSeeking={this._onSeeking}
          onNativeSeeked={this._onSeeked}
          onNativeEnded={this._onEnded}
          onNativeReadyStateChange={this._onReadStateChange}
          onNativeTimeUpdate={this._onTimeUpdate}
          onNativeDurationChange={this._onDurationChange}
          onNativeSegmentNotFound={this._onSegmentNotFound}
          onNativeFullscreenPlayerWillPresent={this._onFullscreenPlayerWillPresent}
          onNativeFullscreenPlayerDidPresent={this._onFullscreenPlayerDidPresent}
          onNativeFullscreenPlayerWillDismiss={this._onFullscreenPlayerWillDismiss}
          onNativeFullscreenPlayerDidDismiss={this._onFullscreenPlayerDidDismiss}
          style={StyleSheet.absoluteFill}
          {...wrapperProps}
        />
      </View>
    );
  }
}

const LINKING_ERROR =
  `The package 'react-native-theoplayer' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const ComponentName = 'THEOplayerRCTView';

const THEOplayerRCTView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<THEOplayerRCTViewProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
