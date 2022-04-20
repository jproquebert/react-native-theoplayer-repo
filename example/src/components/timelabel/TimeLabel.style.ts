import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  timeLabel: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: 'white',
    lineHeight: 14,
    marginTop: 5,
  },
  liveContainer: {
    flexDirection: 'row',
  },
  liveDot: {
    width: 16,
    height: 16,
    marginLeft: -8,
    borderRadius: 8,
    backgroundColor: 'red',
  },
});
