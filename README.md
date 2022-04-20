# React Native THEOplayer

## License

This projects falls under the license as defined in https://github.com/THEOplayer/license-and-disclaimer.

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)

## Overview

The `react-native-theoplayer` package provides a `THEOplayerView` component supporting video playback on the
following platforms:

- Android, Android TV & FireTV
- iOS & tvOS (Apple TV)
- Web (currently only HTML5 browsers are tested)

For each platform, a dependency to the corresponding THEOplayer SDK is included through the dependency manager:

- Gradle & Maven for Android
- Cocoapods for iOS
- npm for Web

This document covers the creation of a minimal app including a `THEOplayerView` component,
and an overview of the included example app with its basic UI.
It also gives a description of the properties of the `THEOplayerView` component, and
a list of features and known limitations.

Note that the `react-native-theoplayer` package and accompanying documentation discussed here have no relation to
the React Native sample applications and documentation that is currently available on our THEOplayer website.

## Getting Started: Early Access Program

The `react-native-theoplayer` package is not yet available on a public npm repository.
For now, as part of the early access program, we provide these two artefacts:

- `react-native-theoplayer-0.1.0.tgz`: a compressed version of the package as if it was fetched from a npm repository.
It contains only what is needed to create a dependency for apps wanting to integrate THEOplayer.
- `react-native-theoplayer-repo.tgz`: an archive of the repository's develop branch. In addition to the source, it has an
example project that demonstrates how to integrate the `THEOplayerView` component with a basic UI in React Native.

For more information on how to integrate the package, we refer to:

- [Creating a minimal demo app](./doc/creating-minimal-app.md)
- [The example application with React Native UI](./doc/example-app.md)
- [The THEOplayerView component](./doc/theoplayerview-component.md)
- [Features](./doc/features.md)
- [Limitations and known issues](./doc/limitations.md)
