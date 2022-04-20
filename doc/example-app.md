## Example Application

The `react-native-theoplayer` package only provides the `THEOplayerView` component.
Additionally, the example application demonstrates how to integrate the component in a single-page app with a basic UI that
allows interaction on both touch-based and remote-controlled devices.

The example app depends on [`react-native-tvos`](https://github.com/react-native-tvos/react-native-tvos),
a fork of the main `react-native` repository, to properly include support for Apple TV.

### The `react-native-theoplayer-repo.tgz` archive

The `react-native-theoplayer-repo.tgz` is an archive created from our react-native-theoplayer git
repository's current develop branch, which is for now still private.

### Building the example application

Install dependencies for the `react-native-theoplayer` package:

```bash
$ cd react-native-theoplayer-repo
$ npm i
```

Install dependencies for the example application:

```bash
$ (cd example && npm i)
```

For iOS and tvOS, make sure to install pod dependencies

```bash
$ (cd example/ios && pod install)
```

Finally, build & deploy the example:

```bash
$ cd example
$ npm run android
$ npm run ios
$ npm run web
```

### User interface

TODO
