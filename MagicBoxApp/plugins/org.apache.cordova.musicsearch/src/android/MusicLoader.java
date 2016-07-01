package org.apache.cordova.musicsearch;

import java.util.ArrayList;
import java.util.List;

import android.content.ContentResolver;
import android.content.ContentUris;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore.Audio.Media;
import android.util.Log;

public class MusicLoader {
	// static {
	// System.loadLibrary("musicList");
	// }

	private static final String TAG = "com.example.songlist.MusicLoader";

	private static List<MusicInfo> musicList = new ArrayList<MusicInfo>();

	private static MusicLoader musicLoader;

	private static ContentResolver contentResolver;
	// Uri，指向external的database
	private Uri contentUri = Media.EXTERNAL_CONTENT_URI;
	// projection：选择的列; where：过滤条件; sortOrder：排序。
	private String[] projection = { Media._ID, Media.DISPLAY_NAME, Media.DATA,
			Media.ALBUM, Media.ARTIST, Media.DURATION, Media.SIZE };
	private String where = "mime_type in ('audio/mpeg','audio/x-ms-wma') and _display_name <> 'audio' and is_music > 0 ";
	private String sortOrder = Media.DATA;

	public static MusicLoader instance(ContentResolver cResolver) {
		if (musicLoader == null) {
			contentResolver = cResolver;
			musicLoader = new MusicLoader();
		}
		return musicLoader;
	}

	private MusicLoader() { // 利用ContentResolver的query函数来查询数据，然后将得到的结果放到MusicInfo对象中，最后放到数组中
		Cursor cursor = contentResolver.query(contentUri, projection, where,
				null, sortOrder);
		if (cursor == null) {
			Log.v(TAG, "Line(53  )   Music Loader cursor == null.");
		} else if (!cursor.moveToFirst()) {
			Log.v(TAG,
					"Line(55  )   Music Loader cursor.moveToFirst() returns false.");
		} else {
			int displayNameCol = cursor.getColumnIndex(Media.DISPLAY_NAME);
			int albumCol = cursor.getColumnIndex(Media.ALBUM);
			int idCol = cursor.getColumnIndex(Media._ID);
			int durationCol = cursor.getColumnIndex(Media.DURATION);
			int sizeCol = cursor.getColumnIndex(Media.SIZE);
			int artistCol = cursor.getColumnIndex(Media.ARTIST);
			int urlCol = cursor.getColumnIndex(Media.DATA);
			do {
				String title = cursor.getString(displayNameCol);
				String album = cursor.getString(albumCol);
				long id = cursor.getLong(idCol);
				int duration = cursor.getInt(durationCol);
				long size = cursor.getLong(sizeCol);
				String artist = cursor.getString(artistCol);
				String url = cursor.getString(urlCol);

				int minute = duration / (60 * 1000);
				String val = duration % (60 * 1000) + "";
				String seconds = (val.length() > 2 ? val.substring(0, 2) : val);
				String length = Integer.toString(minute) + ":" + seconds;

				MusicInfo musicInfo = new MusicInfo();
				musicInfo.setId(id);// 歌曲 id
				musicInfo.setTitle(title);// 歌曲名称
				musicInfo.setSinger(artist);// 歌手
				musicInfo.setAlbum(album);// 专辑
				musicInfo.setSize(size);// 大小
				musicInfo.setLength(length);// 时长
				musicInfo.setUrl(url);// 歌曲路径
				musicList.add(musicInfo);

			} while (cursor.moveToNext());
		}
	}

	public List<MusicInfo> getMusicList() {
		return musicList;
	}

	public Uri getMusicUriById(long id) {
		Uri uri = ContentUris.withAppendedId(contentUri, id);
		return uri;
	}
}
