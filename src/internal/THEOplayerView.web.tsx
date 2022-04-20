import React, { PureComponent } from 'react';

import type { THEOplayerViewProps, PlayerError, TextTrack, MediaTrack, TimeRange } from 'react-native-theoplayer';

import * as THEOplayer from 'theoplayer';
import type { TextTrack as NativeTextTrack, MediaTrack as NativeMediaTrack, PresentationModeChangeEvent } from 'theoplayer';
import type { ReadyStateChangeEvent as NativeReadyStateChangeEvent } from 'theoplayer';

interface THEOplayerRCTViewState {
  isBuffering: boolean;
  error?: PlayerError;
}

export class THEOplayerView extends PureComponent<THEOplayerViewProps, THEOplayerRCTViewState> {
  private _player: THEOplayer.ChromelessPlayer | null = null;

  private static initialState: THEOplayerRCTViewState = {
    isBuffering: false,
    error: undefined,
  };

  constructor(props: THEOplayerViewProps) {
    super(props);
    this.state = THEOplayerView.initialState;
  }

  componentDidMount() {
    const { config, source } = this.props;
    const element = document.querySelector('.theoplayer-container') as HTMLElement;
    if (config?.chromeless === true || config?.chromeless === undefined) {
      this._player = new THEOplayer.ChromelessPlayer(element, config);
    } else {
      this._player = new THEOplayer.Player(element, {
        ...config,
        ui: {
          fluid: true,
        },
      });
    }
    this._player.prepareWithUserAction();
    this._player.source = source;
    this.addEventListeners();
  }

  componentWillUnmount() {
    if (this._player) {
      this._player.destroy();
    }
  }

  public seek(time: number): void {
    if (isNaN(time)) {
      throw new Error('Specified time is not a number');
    }
    if (this._player) {
      this._player.currentTime = time / 1e3;
    }
  }

  private reset() {
    this.setState(THEOplayerView.initialState);
  }

  componentDidUpdate(prevProps: Readonly<THEOplayerViewProps>) {
    if (!this._player) {
      return;
    }
    // track property changes
    const { paused, volume, selectedTextTrack, selectedAudioTrack, selectedVideoTrack, source, muted, playbackRate, fullscreen } = this.props;
    const {
      paused: wasPaused,
      selectedTextTrack: prevSelectedTextTrack,
      selectedAudioTrack: prevSelectedAudioTrack,
      selectedVideoTrack: prevSelectedVideoTrack,
      source: prevSource,
      muted: wasMuted,
      playbackRate: prevPlaybackRate,
      fullscreen: wasFullscreen,
      volume: prevVolume,
    } = prevProps;

    if (source !== prevSource) {
      this._player.source = source;
    }
    if (paused !== wasPaused) {
      if (paused) {
        this._player.pause();
      } else {
        this._player.play();
      }
    }
    if (muted !== wasMuted) {
      this._player.muted = Boolean(muted);
    }
    if (volume !== prevVolume) {
      this._player.volume = Number(volume);
    }
    if (fullscreen !== wasFullscreen) {
      const { onFullscreenPlayerWillPresent, onFullscreenPlayerWillDismiss } = this.props;
      if (fullscreen) {
        if (onFullscreenPlayerWillPresent) {
          onFullscreenPlayerWillPresent();
        }
        this._player.presentation.requestMode('fullscreen');
      } else {
        if (onFullscreenPlayerWillDismiss) {
          onFullscreenPlayerWillDismiss();
        }
        this._player.presentation.requestMode('inline');
      }
    }
    if (playbackRate && playbackRate !== prevPlaybackRate) {
      this._player.playbackRate = playbackRate;
    }
    if (selectedTextTrack !== prevSelectedTextTrack) {
      this._player.textTracks.forEach((textTrack: NativeTextTrack) => {
        textTrack.mode = textTrack.uid === selectedTextTrack ? 'showing' : 'disabled';
      });
    }
    if (selectedAudioTrack !== prevSelectedAudioTrack) {
      this._player.audioTracks.forEach((audioTrack: NativeMediaTrack) => {
        audioTrack.enabled = audioTrack.uid === selectedAudioTrack;
      });
    }
    if (selectedTextTrack !== prevSelectedVideoTrack) {
      this._player.videoTracks.forEach((videoTrack: NativeMediaTrack) => {
        videoTrack.enabled = videoTrack.uid === selectedVideoTrack;
      });
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
      this.props.onBufferingStateChange(newIsBuffering);
    }
  }

  private addEventListeners() {
    const player = this._player;
    if (!player) {
      return;
    }

    player.addEventListener('sourcechange', () => {
      const { onSourceChange, paused } = this.props;

      this.reset();
      if (!paused) {
        player.play();
      }
      if (onSourceChange) {
        onSourceChange();
      }
    });

    player.addEventListener('loadstart', () => {
      // potentially notify change in buffering state
      this.maybeChangeBufferingState(true);

      const { onLoadStart } = this.props;
      if (onLoadStart) {
        onLoadStart();
      }
    });

    player.addEventListener('loadeddata', () => {
      const { onLoadedData } = this.props;
      if (onLoadedData) {
        onLoadedData();
      }
    });

    player.addEventListener('loadedmetadata', () => {
      const { onLoadedMetadata } = this.props;
      if (onLoadedMetadata) {
        onLoadedMetadata({
          textTracks: player.textTracks.map((textTrack: NativeTextTrack) => textTrack as TextTrack),
          audioTracks: player.audioTracks.map((audioTrack: NativeMediaTrack) => audioTrack as MediaTrack),
          videoTracks: player.videoTracks.map((videoTrack: NativeMediaTrack) => videoTrack as MediaTrack),
          duration: player.duration,
          selectedTextTrack: player.textTracks.find((track: NativeTextTrack) => track.mode === 'showing')?.uid,
          selectedVideoTrack: player.videoTracks.find((track: NativeMediaTrack) => track.enabled)?.uid,
          selectedAudioTrack: player.audioTracks.find((track: NativeMediaTrack) => track.enabled)?.uid,
        });
      }
    });

    player.addEventListener('error', (event) => {
      const { errorObject } = event;
      const error = {
        errorCode: errorObject.code.toString(),
        errorMessage: errorObject.message,
      };
      this.setState({ error });

      // potentially notify change in buffering state
      this.maybeChangeBufferingState(false);

      const { onError } = this.props;
      if (onError) {
        onError({ error });
      }
    });

    player.addEventListener('progress', () => {
      const { onProgress } = this.props;
      if (onProgress) {
        const seekable: TimeRange[] = [];
        for (let i = 0; i < player.seekable.length; i++) {
          seekable.push({
            start: player.seekable.start(i) * 1e3,
            end: player.seekable.end(i) * 1e3,
          });
        }
        onProgress({ seekable });
      }
    });

    player.addEventListener('play', () => {
      const { onPlay } = this.props;
      if (onPlay) {
        onPlay();
      }
    });

    player.addEventListener('playing', () => {
      const { onPlaying } = this.props;
      if (onPlaying) {
        onPlaying();
      }
    });

    player.addEventListener('pause', () => {
      const { onPause } = this.props;
      if (onPause) {
        onPause();
      }
    });

    player.addEventListener('seeking', () => {
      const { onSeeking } = this.props;
      if (onSeeking) {
        onSeeking();
      }
    });

    player.addEventListener('seeked', () => {
      const { onSeeked } = this.props;
      if (onSeeked) {
        onSeeked();
      }
    });

    player.addEventListener('ended', () => {
      const { onEnded } = this.props;
      if (onEnded) {
        onEnded();
      }
    });

    player.addEventListener('readystatechange', (event: NativeReadyStateChangeEvent) => {
      // potentially notify change in buffering state
      this.maybeChangeBufferingState(event.readyState < 3);

      const { onReadyStateChange } = this.props;
      if (onReadyStateChange) {
        onReadyStateChange({ readyState: event.readyState });
      }
    });

    player.addEventListener('timeupdate', () => {
      const { onTimeUpdate } = this.props;
      if (onTimeUpdate) {
        onTimeUpdate({
          currentTime: player.currentTime * 1e3,
          currentProgramDateTime: player.currentProgramDateTime?.getTime(),
        });
      }
    });
    player.addEventListener('durationchange', (event) => {
      const { onDurationChange } = this.props;
      if (onDurationChange) {
        onDurationChange({
          duration: event.duration * 1e3,
        });
      }
    });
    player.addEventListener('segmentnotfound', () => {
      const { onSegmentNotFound } = this.props;
      if (onSegmentNotFound) {
        onSegmentNotFound({
          segmentStartTime: 0,
          error: 'Segment not found',
          retryCount: -1,
        });
      }
    });
    player.presentation.addEventListener('presentationmodechange', (event: PresentationModeChangeEvent) => {
      const { presentationMode } = event;
      const { onFullscreenPlayerDidPresent, onFullscreenPlayerDidDismiss } = this.props;
      if (presentationMode === 'fullscreen') {
        if (onFullscreenPlayerDidPresent) {
          onFullscreenPlayerDidPresent();
        }
      } else if (presentationMode === 'inline') {
        if (onFullscreenPlayerDidDismiss) {
          onFullscreenPlayerDidDismiss();
        }
      }
    });
  }

  public render(): JSX.Element {
    const { config } = this.props;
    const chromeless = config?.chromeless === undefined || config?.chromeless === true;

    return (
      <div id={'theoplayer-wrapper'}>
        <div className={chromeless ? 'theoplayer-container' : 'theoplayer-container video-js theoplayer-skin'} />
      </div>
    );
  }
}
