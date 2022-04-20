## Creating a minimal demo app

### Overview

In this section we start from an empty React Native template, include a dependency to `react-native-theoplayer`,
and deploy it on an Android or iOS device.

There is no React Native UI included in this app as this is covered in the accompanying [example application](example-app.md).

### Getting started

First initialize a template for a React Native app. In this example we use a template that also provides support for tvOS, as it will
depend on `react-native-tvos`, a fork of the main React Native branch.

```bash
$ npx react-native init rntheodemo --template=react-native-template-typescript-tv
$ cd rntheodemo
```

Next, include the dependency to `react-native-theoplayer`. For now, we will refer to the local package
`react-native-theoplayer-0.1.0.tgz`. Once the package is publicly available the package can be fetched from the npm repository
similar to other npm dependencies.

```bash
$ npm i
$ npm i <location >/react-native-theoplayer-0.1.0.tgz
```

Note: depending on your node version, an extra `--legacy-peer-deps` option has to be added:

```bash
$ npm i
$ npm i <location >/react-native-theoplayer-0.1.0.tgz --legacy-peer-deps
```

Finally, replace the `App.tsx` with this minimal code:

```typescript
import React from 'react';
import {View} from 'react-native';
import {PlayerConfiguration, THEOplayerView} from 'react-native-theoplayer';

const license = Platform.select(
  {
  'android': undefined, // insert Android THEOplayer license here
  'ios': undefined,     // insert iOS THEOplayer license here
  'web': undefined,     // insert Web THEOplayer license here
  });

const playerConfig: PlayerConfiguration = {
  license
};

const source = {
  sources: [
    {
      src: 'https://contentserver.prudentgiraffe.com/videos/dash/webvtt-embedded-in-isobmff/Manifest.mpd',
      type: 'application/dash+xml',
    },
  ],
};

const App = () => {
  return (
    <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}>
      <THEOplayerView config={playerConfig} source={source} paused={false} />
    </View>
  );
};

export default App;
```

### Android specific setup
For Android, this line of configuration has to be added to `./android/app/build.gradle` to avoid issues during packaging:
```bash
android {
    // ...
    packagingOptions {
      exclude 'META-INF/kotlin-stdlib.kotlin_module'
    }
}
```

### iOS and tvOS specific setup
For iOS/tvOS, change the source to the following HLS stream:
```typescript
const source = {
  sources: [
    {
      src: 'https://cdn.theoplayer.com/video/elephants-dream/playlist.m3u8',
      type: 'application/x-mpegurl',
    },
  ],
};
```

You need an additional change for tvOS, since the tvOS SDK needs to be prepared before it can be used in a RN context. First, include TheoplayerSDK into your project's AppDelegate:
```swift
#if TARGET_OS_TV
#import <THEOplayerSDK/THEOplayerSDK-Swift.h>
#endif
```
Next, prepare the THEOplayer right after the creation of the rootViewController in your AppDelegate's didFinishLaunchingWithOptions:
```swift
#if TARGET_OS_TV
  [THEOplayer prepareWithFirstViewController: [UIViewController new]];
#endif
```

Some RN templates miss a specific Swift version setting for tvOS. To fix this add a custom build setting to your tvOS app target:
```
SWIFT_VERSION 5.0
```

Run pod install in your app's ios folder
```bash
pod install
```

### Building and running the app

Finally build and deploy the app. Make sure an emulator is available, or there is a physical
device connected to deploy to.

```bash
$ npx react-native run-android
$ npx react-native run-ios
```

or using the npm scripts:

```bash
$ npm run android
$ npm run ios
```

### Final notes

- On some platforms issues with [React Native Flipper](https://fbflipper.com/), a platform for debugging apps, can occur,
either during building or running the app. If so, it is advised to just remove it for this demo app.
- Deploying a web app requires a little more work. We refer to the example application for a demonstration of how this could be done.
