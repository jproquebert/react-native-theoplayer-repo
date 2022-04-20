package com.theoplayer.track;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.theoplayer.android.api.player.track.mediatrack.MediaTrack;
import com.theoplayer.android.api.player.track.mediatrack.MediaTrackList;
import com.theoplayer.android.api.player.track.mediatrack.quality.AudioQuality;
import com.theoplayer.android.api.player.track.mediatrack.quality.QualityList;
import com.theoplayer.android.api.player.track.mediatrack.quality.VideoQuality;
import com.theoplayer.android.api.player.track.texttrack.TextTrack;
import com.theoplayer.android.api.player.track.texttrack.TextTrackList;

public class TrackListInfo {

  private static final String PROP_ID = "id";
  private static final String PROP_UID = "uid";
  private static final String PROP_KIND = "kind";
  private static final String PROP_LANGUAGE = "language";
  private static final String PROP_MODE = "mode";
  private static final String PROP_LABEL = "label";
  private static final String PROP_TYPE = "type";
  private static final String PROP_CODECS = "codecs";
  private static final String PROP_NAME = "name";
  private static final String PROP_AUDIO_SAMPLING_RATE = "audioSamplingRate";
  private static final String PROP_BANDWIDTH = "bandwidth";
  private static final String PROP_QUALITIES = "qualities";
  private static final String PROP_ACTIVE_QUALITY = "activeQuality";
  private static final String PROP_TARGET_QUALITY = "targetQuality";
  private static final String PROP_WIDTH = "width";
  private static final String PROP_HEIGHT = "height";
  private static final String PROP_FRAMERATE = "framerate";

  public static WritableArray fromTextTrackList(final TextTrackList textTrackList) {
    WritableArray textTracks = Arguments.createArray();
    for (int i = 0; i < textTrackList.length(); i++) {
      final TextTrack textTrack = textTrackList.getItem(i);
      WritableMap textTrackPayload = Arguments.createMap();
      textTrackPayload.putString(PROP_ID, textTrack.getId());
      textTrackPayload.putInt(PROP_UID, textTrack.getUid());
      textTrackPayload.putString(PROP_KIND, textTrack.getKind());
      textTrackPayload.putString(PROP_LANGUAGE, textTrack.getLanguage());
      textTrackPayload.putString(PROP_MODE, textTrack.getMode().getMode());
      textTrackPayload.putString(PROP_LABEL, textTrack.getLabel());
      textTrackPayload.putString(PROP_TYPE, textTrack.getType().getType());
      textTracks.pushMap(textTrackPayload);
    }
    return textTracks;
  }

  @NonNull
  public static WritableArray fromAudioTrackList(@NonNull final MediaTrackList<AudioQuality> audioTrackList) {
    WritableArray audioTracks = Arguments.createArray();
    for (int i = 0; i < audioTrackList.length(); i++) {
      final MediaTrack<AudioQuality> audioTrack = audioTrackList.getItem(i);
      WritableMap audioTrackPayload = Arguments.createMap();
      audioTrackPayload.putString(PROP_ID, audioTrack.getId());
      audioTrackPayload.putInt(PROP_UID, audioTrack.getUid());
      audioTrackPayload.putString(PROP_KIND, audioTrack.getKind());
      audioTrackPayload.putString(PROP_LABEL, audioTrack.getLabel());
      audioTrackPayload.putString(PROP_LANGUAGE, audioTrack.getLanguage());

      final QualityList<AudioQuality> qualityList = audioTrack.getQualities();
      WritableArray qualities = Arguments.createArray();
      if (qualityList != null) {
        for (int j = 0; j < qualityList.length(); j++) {
          final AudioQuality audioQuality = qualityList.getItem(j);
          WritableMap audioQualityPayload = Arguments.createMap();
          audioQualityPayload.putString(PROP_ID, audioQuality.getId());
          audioQualityPayload.putInt(PROP_UID, audioQuality.getUid());
          audioQualityPayload.putString(PROP_CODECS, audioQuality.getCodecs());
          audioQualityPayload.putString(PROP_NAME, audioQuality.getName());
          audioQualityPayload.putDouble(PROP_BANDWIDTH, audioQuality.getBandwidth());
          audioQualityPayload.putDouble(PROP_AUDIO_SAMPLING_RATE, audioQuality.getAudioSamplingRate());
          qualities.pushMap(audioQualityPayload);
        }
      }
      audioTrackPayload.putArray(PROP_QUALITIES, qualities);

      final QualityList<AudioQuality> targetQualityList = audioTrack.getTargetQualities();
      WritableArray targetQualities = Arguments.createArray();
      if (targetQualityList != null) {
        for (int j = 0; j < targetQualityList.length(); j++) {
          final AudioQuality quality = targetQualityList.getItem(j);
          WritableMap audioQualityPayload = Arguments.createMap();
          audioQualityPayload.putInt(PROP_UID, quality.getUid());
          targetQualities.pushMap(audioQualityPayload);
        }
      }

      final AudioQuality activeQuality = audioTrack.getActiveQuality();
      if (activeQuality != null) {
        audioTrackPayload.putInt(PROP_ACTIVE_QUALITY, activeQuality.getUid());
      }

      final AudioQuality targetQuality = audioTrack.getTargetQuality();
      if (targetQuality != null) {
        audioTrackPayload.putInt(PROP_TARGET_QUALITY, targetQuality.getUid());
      }

      audioTracks.pushMap(audioTrackPayload);
    }
    return audioTracks;
  }

  @NonNull
  static public WritableArray fromVideoTrackList(@NonNull final MediaTrackList<VideoQuality> videoTrackList) {
    WritableArray videoTracks = Arguments.createArray();
    for (int i = 0; i < videoTrackList.length(); i++) {
      final MediaTrack<VideoQuality> videoTrack = videoTrackList.getItem(i);
      WritableMap videoTrackPayload = Arguments.createMap();
      videoTrackPayload.putString(PROP_ID, videoTrack.getId());
      videoTrackPayload.putInt(PROP_UID, videoTrack.getUid());
      videoTrackPayload.putString(PROP_KIND, videoTrack.getKind());
      videoTrackPayload.putString(PROP_LABEL, videoTrack.getLabel());
      videoTrackPayload.putString(PROP_LANGUAGE, videoTrack.getLanguage());

      final QualityList<VideoQuality> qualityList = videoTrack.getQualities();
      WritableArray qualities = Arguments.createArray();
      if (qualityList != null) {
        for (int j = 0; j < qualityList.length(); j++) {
          final VideoQuality quality = qualityList.getItem(j);
          WritableMap videoQualityPayload = Arguments.createMap();
          videoQualityPayload.putString(PROP_ID, quality.getId());
          videoQualityPayload.putInt(PROP_UID, quality.getUid());
          videoQualityPayload.putString(PROP_CODECS, quality.getCodecs());
          videoQualityPayload.putString(PROP_NAME, quality.getName());
          videoQualityPayload.putDouble(PROP_BANDWIDTH, quality.getBandwidth());
          videoQualityPayload.putDouble(PROP_WIDTH, quality.getWidth());
          videoQualityPayload.putDouble(PROP_HEIGHT, quality.getHeight());
          videoQualityPayload.putDouble(PROP_FRAMERATE, quality.getFrameRate());
          qualities.pushMap(videoQualityPayload);
        }
      }
      videoTrackPayload.putArray(PROP_QUALITIES, qualities);

      final QualityList<VideoQuality> targetQualityList = videoTrack.getTargetQualities();
      WritableArray targetQualities = Arguments.createArray();
      if (targetQualityList != null) {
        for (int j = 0; j < targetQualityList.length(); j++) {
          final VideoQuality quality = targetQualityList.getItem(j);
          WritableMap videoQualityPayload = Arguments.createMap();
          videoQualityPayload.putInt(PROP_UID, quality.getUid());
          targetQualities.pushMap(videoQualityPayload);
        }
      }

      final VideoQuality activeQuality = videoTrack.getActiveQuality();
      if (activeQuality != null) {
        videoTrackPayload.putInt(PROP_ACTIVE_QUALITY, activeQuality.getUid());
      }

      final VideoQuality targetQuality = videoTrack.getTargetQuality();
      if (targetQuality != null) {
        videoTrackPayload.putInt(PROP_TARGET_QUALITY, targetQuality.getUid());
      }

      videoTracks.pushMap(videoTrackPayload);
    }
    return videoTracks;
  }
}
