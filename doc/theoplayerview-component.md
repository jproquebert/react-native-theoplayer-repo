## The `THEOplayerView` Component

This section will discuss the most important properties of `THEOplayerView`.
The component's properties are also described in its [THEOplayerViewProps interface]('./src/api/THEOplayerView.ts').

```typescript
import { THEOplayerView } from 'react-native-theoplayer';

function Player() {
  // ...
  return <THEOplayerView
      config={config}
      source={source}
      fullscreen={fullscreen}
      style={styles.video}
      playbackRate={playbackRate}
      paused={paused}
      volume={volume}
      muted={muted}
      selectedTextTrack={selectedTextTrack}
      selectedAudioTrack={selectedAudioTrack}
      selectedVideoTrack={selectedVideoTrack}
      onBufferingStateChange={noop}
      onSourceChange={noop}
      onLoadStart={noop}
      onLoadedMetadata={noop}
      onLoadedData={noop}
      onReadyStateChange={noop}
      onError={noop}
      onProgress={noop}
      onPlay={noop}
      onPlaying={noop}
      onPause={noop}
      onSeeking={noop}
      onSeeked={noop}
      onEnded={noop}
      onTimeUpdate={noop}
      onDurationChange={noop}
  />;
}
```

### Configuration

The `THEOplayerView` component accepts a `config` property that contains basic player configuration.

```typescript
const player: PlayerConfiguration = {
  license: undefined, //'insert THEOplayer license here'
  chromeless: true,
};
```

The `license` is an obfuscated string that contains the THEOplayer license needed for play-out, and which can be found in your
THEOplayer Portal account. If separate licenses per platform are needed, `Platform.select()` could be used to configure them:

```typescript
const license = Platform.select(
  {
  'android': undefined, // insert Android THEOplayer license here
  'ios': undefined,     // insert iOS THEOplayer license here
  'web': undefined,     // insert Web THEOplayer license here
  });
```

If no license is provided, only sources hosted on the `theoplayer.com` domain can be played. On Web platforms,
CORS rules applied on `theoplayer.com` will also prohibit playing sources from this domain.

### Chromeless vs. Chromefull

The `chromeless` property relates to whether the underlying _native_ SDK provides the UI or not.
If `chromeless = true`, the player does not include the native UI provided by the SDK and it is expected the UI is
created in React Native. The accompanying example application provides a basic UI created in React Native.

### Setting a source

The `source` property provided to a `THEOplayerView` component contains a source description, including the
manifest or playlist, a DRM configuration object and ads description. The type definition of a `SourceDescription`
maps to the type used in the [Web SDK's documentation](https://docs.theoplayer.com/api-reference/web/theoplayer.sourcedescription.md).

### Seeking to a timestamp

Changing the player's current time, or seeking to a specific timestamp, is done by executing a
method on the `THEOplayerView` component. To enable this, it is necessary to keep a reference to the component,
as demonstrated in the [example application](example-app.md):

```typescript
    // ...
    <THEOplayerView
      ref={(ref: THEOplayerView) => {
        this.video = ref;
      }}
      config={config}
      source={source}
    />
```

and subsequently calling the seek method:

```typescript
  const seek = (time: number) => {
    console.log(TAG, 'Seeking to', time);
    this.video.seek(time);
  };
```

### Text tracks and media tracks

The text tracks and media tracks available in the stream are provided once the
onLoadedMetadata event is dispatched.

```typescript
  const onLoadedMetadata = (data: LoadedMetadataEvent) => {
    console.log(TAG, 'loadedmetadata', JSON.stringify(data));
    this.setState({
      duration: data.duration,
      textTracks: data.textTracks,
      audioTracks: data.audioTracks,
      videoTracks: data.videoTracks,
      selectedTextTrack: data.selectedTextTrack,
      selectedVideoTrack: data.selectedVideoTrack,
      selectedAudioTrack: data.selectedAudioTrack,
    });
  };
```

### Buffering state changes

The `onBufferingStateChange` callback is triggered to indicate changes in the player's buffering state.
It could be coupled to an activity indicator that is part of the UI, as shown in the example application.

The callback value `isBuffering` is defined as follows:

- Initially set to `false`;
- When `onLoadStart` is dispatched, set to `true`;
- When `onReadyStateChange` is dispatched with `readyState` value < `HAVE_FUTURE_DATA`, set to `true`;
- When `onError` is dispatched, set to `false`.

The value `readyState` can switch radically, so it is advised to add a time-out when using
`onBufferingStateChange` in combination with a UI loading indicator. The example application
illustrates a possible implementation.
