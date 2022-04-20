import type { Track } from './Track';

export type TextTrackType = 'srt' | 'ttml' | 'webvtt' | 'cea608' | '';

export type TextTrackKind = 'subtitles' | 'captions' | 'descriptions';

export type TextTrackMode = 'disabled' | 'showing';

export interface TextTrack extends Track {
  /**
   * The kind of the text track, represented by a value from the following list:
   * <br/> - `'subtitles'`: The track contains subtitles.
   * <br/> - `'captions'`: The track contains closed captions, a translation of dialogue and sound effects.
   * <br/> - `'descriptions'`: The track contains descriptions, a textual description of the video.
   */
  readonly kind: TextTrackKind;

  /**
   * The language of the text track.
   */
  readonly language: string;

  /**
   * The identifier of the text track.
   *
   * @remarks
   * <br/> - This identifier can be used to distinguish between related tracks, e.g. tracks in the same list.
   */
  readonly id: string;

  /**
   * A unique identifier of the text track.
   *
   * @remarks
   * <br/> - This identifier is unique across tracks of a THEOplayer instance and can be used to distinguish between tracks.
   */
  readonly uid: number;

  /**
   * The mode of the text track, represented by a value from the following list:
   * <br/> - `'disabled'`: The track is disabled.
   * <br/> - `'showing'`: The track is showing.
   */
  mode: TextTrackMode;

  /**
   * The content type of the text track.
   */
  readonly type: TextTrackType;
}
