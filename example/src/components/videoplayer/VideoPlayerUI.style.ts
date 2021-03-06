import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  fullScreenCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#00000066',
    padding: 10,
  },
  sourcesContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  innerProgressCompleted: {
    height: 20,
    backgroundColor: '#ffc50f',
  },
  innerProgressRemaining: {
    height: 20,
    backgroundColor: '#2C2C2C',
  },
  generalControls: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 4,
    overflow: 'hidden',
    paddingVertical: 10,
  },
  controlContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 5,
  },
  controlLabel: {
    alignSelf: 'center',
    fontSize: 12,
    color: 'lightblue',
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 12,
    color: 'white',
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 16,
    paddingLeft: 50,
    paddingRight: 50,
    color: 'white',
  },
  playButton: {
    width: 90,
    height: 90,
    tintColor: '#ffc50f',
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
});
