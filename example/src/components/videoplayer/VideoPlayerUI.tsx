import React, { PureComponent } from 'react';
import type { PlayerError, TextTrack, MediaTrack, TimeRange } from 'react-native-theoplayer';

import { Platform, StyleProp, Text, View, ViewStyle } from 'react-native';
import { SeekBar } from '../seekbar/SeekBar';
import styles from './VideoPlayerUI.style';
import { DelayedActivityIndicator } from '../delayedactivityindicator/DelayedActivityIndicator';
import { FullScreenIcon, FullScreenExitIcon, SubtitlesIcon, AudioIcon, PlayButton, MutedIcon, UnMutedIcon } from '../../res/images';
import { MenuButton } from '../menubutton/MenuButton';
import { MenuItem } from '../modalmenu/MenuItem';
import { Language } from '../../utils/language/Language';
import type { Source } from '../../utils/source/Source';
import { ActionButton } from '../actionbutton/ActionButton';
import { ControlOption } from '../controloption/ControlOption';

export interface VideoPlayerUIProps {
  sources: Source[];
  srcIndex: number;
  playbackRate: number;
  volume: number;
  muted: boolean;
  duration: number;
  seekable: TimeRange[];
  currentTime: number;
  paused: boolean;
  fullscreen: boolean;
  showLoadingIndicator: boolean;
  textTracks: TextTrack[];
  videoTracks: MediaTrack[];
  audioTracks: MediaTrack[];
  selectedTextTrack: number | undefined;
  selectedVideoTrack: number | undefined;
  selectedAudioTrack: number | undefined;
  error: PlayerError | undefined;

  onSetPlayPause?: (pause: boolean) => void;
  onSeek?: (time: number) => void;
  onSelectSource?: (index: number) => void;
  onSelectTextTrack?: (uid: number | undefined) => void;
  onSelectAudioTrack?: (uid: number | undefined) => void;
  onSelectVideoTrack?: (uid: number | undefined) => void;
  onSetFullScreen?: (fullscreen: boolean) => void;
  onSetMuted?: (muted: boolean) => void;
  onSetPlaybackRate?: (playbackRate: number) => void;
  onSetVolume?: (volume: number) => void;

  style?: StyleProp<ViewStyle>;
}

export class VideoPlayerUI extends PureComponent<VideoPlayerUIProps> {
  constructor(props: VideoPlayerUIProps) {
    super(props);
  }

  private onSeek = (time: number) => {
    const { onSeek } = this.props;
    if (onSeek) {
      onSeek(time);
    }
  };

  private togglePlayPause = () => {
    const { paused, onSetPlayPause } = this.props;
    if (onSetPlayPause) {
      onSetPlayPause(!paused);
    }
  };

  private toggleFullScreen = () => {
    const { fullscreen, onSetFullScreen } = this.props;
    if (onSetFullScreen) {
      onSetFullScreen(!fullscreen);
    }
  };

  private toggleMuted = () => {
    const { muted, onSetMuted } = this.props;
    if (onSetMuted) {
      onSetMuted(!muted);
    }
  };

  private selectTextTrack = (index: number) => {
    const { textTracks, onSelectTextTrack } = this.props;
    if (onSelectTextTrack) {
      const uid = textTracks && index >= 0 && index < textTracks.length ? textTracks[index].uid : undefined;
      onSelectTextTrack(uid);
    }
  };

  private selectAudioTrack = (index: number) => {
    const { audioTracks, onSelectAudioTrack } = this.props;
    if (onSelectAudioTrack) {
      if (audioTracks && index >= 0 && index < audioTracks.length) {
        onSelectAudioTrack(audioTracks[index].uid);
      }
    }
  };

  private selectVideoTrack = (index: number) => () => {
    const { videoTracks, onSelectVideoTrack } = this.props;
    if (onSelectVideoTrack) {
      if (videoTracks && index >= 0 && index < videoTracks.length) {
        onSelectVideoTrack(videoTracks[index].uid);
      }
    }
  };

  private selectSource = (index: number) => () => {
    const { onSelectSource } = this.props;
    if (onSelectSource) {
      onSelectSource(index);
    }
  };

  private setPlaybackRate = (playbackRate: number) => () => {
    const { onSetPlaybackRate } = this.props;
    if (onSetPlaybackRate) {
      onSetPlaybackRate(playbackRate);
    }
  };

  private setVolume = (volume: number) => () => {
    const { onSetVolume } = this.props;
    if (onSetVolume) {
      onSetVolume(volume);
    }
  };

  private renderSources(index: number) {
    const { sources, srcIndex } = this.props;
    const isSelected = srcIndex === index;
    return (
      <ControlOption
        key={`src${index}`}
        onPress={this.selectSource(index)}
        isSelected={isSelected}
        text={`${sources[index].name}`}
        textStyle={styles.controlOption}
      />
    );
  }

  renderRateControl(playbackRate: number) {
    const isSelected = this.props.playbackRate === playbackRate;

    return (
      <ControlOption
        key={`rate${playbackRate}`}
        onPress={this.setPlaybackRate(playbackRate)}
        isSelected={isSelected}
        text={`${playbackRate}x`}
        textStyle={styles.controlOption}
      />
    );
  }

  renderVolumeControl(volume: number) {
    const isSelected = this.props.volume === volume;

    return (
      <ControlOption
        key={`volume${volume}`}
        onPress={this.setVolume(volume)}
        isSelected={isSelected}
        text={`${volume * 100}%`}
        textStyle={styles.controlOption}
      />
    );
  }

  private renderVideoTrackControl(track: MediaTrack) {
    const label = !track.label || track.label === '' ? 'no_name' : track.label;
    const uid = track?.uid;
    const isSelected = this.props.selectedVideoTrack === uid;

    return (
      <ControlOption
        key={`videoTrack${uid ?? 'none'}`}
        onPress={this.selectVideoTrack(uid)}
        isSelected={isSelected}
        text={`${label}`}
        textStyle={styles.controlOption}
      />
    );
  }

  render() {
    const {
      style,
      sources,
      error,
      paused,
      muted,
      fullscreen,
      showLoadingIndicator,
      duration,
      seekable,
      currentTime,
      textTracks,
      selectedTextTrack,
      videoTracks,
      audioTracks,
      selectedAudioTrack,
    } = this.props;

    return (
      <View style={[styles.container, style]}>
        {showLoadingIndicator && !paused && (
          <View style={styles.fullScreenCenter}>
            <DelayedActivityIndicator size="large" color="#ffc50f" />
          </View>
        )}

        {!error && (
          <ActionButton
            touchable={!Platform.isTV}
            icon={paused ? PlayButton : null}
            style={styles.fullScreenCenter}
            iconStyle={styles.playButton}
            onPress={this.togglePlayPause}
          />
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>
              {error.errorCode} - {error.errorMessage}
            </Text>
          </View>
        )}

        <View style={styles.controls}>
          <View style={styles.generalControls}>
            <View style={styles.controlContainer}>
              <Text style={styles.controlLabel}>sources: </Text>
              <View style={styles.sourcesContainer}>{sources.map((_src: Source, index: number) => this.renderSources(index))}</View>
            </View>
            <View style={styles.controlContainer}>
              <Text style={styles.controlLabel}>playbackRate: </Text>
              {[0.25, 0.5, 1.0, 1.5, 2.0].map((rate: number) => this.renderRateControl(rate))}
            </View>
            <View style={styles.controlContainer}>
              <Text style={styles.controlLabel}>videoTracks: </Text>
              {videoTracks.map((track: MediaTrack) => this.renderVideoTrackControl(track))}
            </View>
            {Platform.OS != 'ios' && (
              <View style={styles.controlContainer}>
                <Text style={styles.controlLabel}>volume: </Text>
                {[0.0, 0.25, 0.5, 1.0].map((v: number) => this.renderVolumeControl(v))}
              </View>
            )}
          </View>

          <SeekBar
            isLive={!isFinite(duration)}
            // On TV platforms we use the progress dot to play/pause
            onDotPress={this.togglePlayPause}
            onSeek={this.onSeek}
            seekable={seekable}
            currentTime={currentTime}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <ActionButton
              icon={muted ? MutedIcon : UnMutedIcon}
              onPress={this.toggleMuted}
              iconStyle={styles.menuIcon}
              style={{ flex: 1, alignItems: 'flex-end', marginLeft: 0 }}
            />

            {textTracks && textTracks.length > 0 && (
              <MenuButton
                title={'Subtitles'}
                icon={SubtitlesIcon}
                data={[...textTracks, null].map((textTrack) =>
                  textTrack ? new MenuItem(Language.fromCode(textTrack.language)?.name ?? textTrack.language) : new MenuItem('None'),
                )}
                onItemSelected={this.selectTextTrack}
                selectedItem={selectedTextTrack ? textTracks.findIndex((textTrack) => textTrack.uid === selectedTextTrack) : textTracks.length}
                keyExtractor={(index: number) => `sub${index}`}
              />
            )}

            {audioTracks && audioTracks.length > 0 && (
              <MenuButton
                title={'Language'}
                icon={AudioIcon}
                data={audioTracks.map((audioTrack) => new MenuItem(Language.fromCode(audioTrack.language)?.name ?? audioTrack.language))}
                onItemSelected={this.selectAudioTrack}
                selectedItem={audioTracks.findIndex((audioTrack) => audioTrack.uid === selectedAudioTrack)}
                keyExtractor={(index: number) => `lng${index}`}
              />
            )}

            {!Platform.isTV && (
              <ActionButton icon={fullscreen ? FullScreenExitIcon : FullScreenIcon} onPress={this.toggleFullScreen} iconStyle={styles.menuIcon} />
            )}
          </View>
        </View>
      </View>
    );
  }
}
