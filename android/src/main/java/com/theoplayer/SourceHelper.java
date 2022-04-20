package com.theoplayer;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.google.gson.Gson;
import com.theoplayer.android.api.source.SourceDescription;
import com.theoplayer.android.api.source.SourceType;
import com.theoplayer.android.api.source.TypedSource;
import com.theoplayer.android.api.source.addescription.AdDescription;
import com.theoplayer.android.api.source.addescription.GoogleImaAdDescription;
import com.theoplayer.android.api.source.drm.DRMConfiguration;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Source parsing helper class, because we don't support GSON object deserialization currently
 */
public class SourceHelper {

  private final Gson gson = new Gson();

  public SourceDescription parseSourceFromJS(ReadableMap source) {
      HashMap<String, Object> hashmap = eliminateReadables(source);
      try {
        String json = gson.toJson(hashmap);
        JSONObject jsonSourceObject = new JSONObject(json);

        // typed sources
        ArrayList<TypedSource> typedSources = new ArrayList<>();

        // sources can be an array or single object
        JSONArray jsonSources = jsonSourceObject.optJSONArray("sources");
        if (jsonSources != null) {
          for (int i = 0 ; i < jsonSources.length(); i++) {
            TypedSource typedSource = parseTypedSource((JSONObject)jsonSources.get(i));
            if (typedSource != null) {
              typedSources.add(typedSource);
            }
          }
        } else {
          TypedSource typedSource = parseTypedSource(jsonSourceObject.getJSONObject("sources"));
          if (typedSource != null) {
            typedSources.add(typedSource);
          }
        }

        // poster
        String poster = jsonSourceObject.optString("poster");

        // ads
        JSONArray jsonAds = jsonSourceObject.optJSONArray("ads");
        ArrayList<AdDescription> ads = new ArrayList<>();
        if (jsonAds != null) {
          for (int i = 0 ; i < jsonAds.length(); i++) {
            JSONObject jsonAdDescription = (JSONObject) jsonAds.get(i);

            // Currently only ima-ads are supported.
            GoogleImaAdDescription ad = parseImaAdFromJS(jsonAdDescription);
            if (ad != null) {
              ads.add(ad);
            }
          }
        }

        return SourceDescription.Builder.sourceDescription(typedSources.toArray(new TypedSource[]{})).poster(poster).ads(ads.toArray(new AdDescription[]{})).build();
      } catch (JSONException e) {
        e.printStackTrace();
      }

      return null;
  }

  @Nullable
  private TypedSource parseTypedSource(@NonNull final JSONObject jsonTypedSource) {
    try {
      SourceType sourceType = parseSourceType(jsonTypedSource);
      String src = jsonTypedSource.getString("src");
      TypedSource.Builder tsBuilder = TypedSource.Builder.typedSource().src(src);
      if (sourceType != null) {
        tsBuilder.type(sourceType);
      }

      if (jsonTypedSource.has("contentProtection")) {
        DRMConfiguration drmConfiguration = gson.fromJson(jsonTypedSource.get("contentProtection").toString(), DRMConfiguration.class);
        tsBuilder.drm(drmConfiguration);
      }
      return tsBuilder.build();
    }
    catch(JSONException e) {
      e.printStackTrace();
    }
    return null;
  }

  private static SourceType parseSourceType(@NonNull final JSONObject jsonTypedSource) {
    String type = jsonTypedSource.optString("type");
    if (!type.isEmpty()) {
      if ("application/dash+xml".equals(type)) {
        return SourceType.DASH;
      }
      if ("application/x-mpegurl".equals(type)) {
        return SourceType.HLSX;
      }
      if ("application/vnd.theo.hesp+json".equals(type)) {
        return SourceType.HESP;
      }
      if ("application/vnd.apple.mpegurl".equals(type)) {
        return SourceType.HLS;
      }
      if ("video/mp4".equals(type)) {
        return SourceType.MP4;
      }
    }
    return null;
  }

  @Nullable
  private static GoogleImaAdDescription parseImaAdFromJS(JSONObject jsonAdDescription) throws JSONException {
    if (jsonAdDescription.optString("integration").equals("google-ima")) {
      return GoogleImaAdDescription.Builder.googleImaAdDescription()
        .source(jsonAdDescription.optString("sources"))
        .timeOffset(jsonAdDescription.optString("timeOffset"))
        .build();
    }
    return null;
  }

  /**
   * Eliminate all the Readable* classes from the map
   *
   * @param readableMap
   * @return
   */
  protected static HashMap<String, Object> eliminateReadables(ReadableMap readableMap) {
    HashMap<String, Object> hashMap = readableMap.toHashMap();
    HashMap<String, Object> eliminatedHashMap = new HashMap<>();

    for (Map.Entry<String, Object> entry : hashMap.entrySet()) {
      Object value = entry.getValue();
      if (value instanceof ReadableMap) {
        value = eliminateReadables((ReadableMap) value);
      } else if (value instanceof ReadableArray) {
        value = eliminateReadables((ReadableArray) value);
      }
      eliminatedHashMap.put(entry.getKey(), value);
    }
    return eliminatedHashMap;
  }

  /**
   * Eliminate all the Readable* classes from the array
   *
   * @param readableArray
   * @return
   */
  protected static ArrayList<Object> eliminateReadables(ReadableArray readableArray) {
    ArrayList<Object> arrayList = readableArray.toArrayList();
    ArrayList<Object> eliminatedArrayList = new ArrayList<>();

    for (Object o : arrayList) {
      Object value = o;

      if (value instanceof ReadableMap) {
        value = eliminateReadables((ReadableMap) value);
      } else if (value instanceof ReadableArray) {
        value = eliminateReadables((ReadableArray) value);
      }

      eliminatedArrayList.add(value);
    }

    return eliminatedArrayList;
  }
}
