/* eslint-disable camelcase */
import { youtube_v3 } from 'googleapis';
import getYoutubeClient from './getYoutubeClient';

export interface SearchResult extends Array<string> {
  id: string;
  title: string;
  duration: string;
}

const youtube = getYoutubeClient();

async function getVideoDurations(id: string[]): Promise<string[]> {
  let durations: string[] = [];
  try {
    const { data } = await youtube.videos.list({
      id,
      part: ['contentDetails'],
    });
    durations = data.items?.map((item) => {
      const isoDuration = item.contentDetails?.duration;
      const date = isoDuration?.substr(2);
      return date;
    }) as string[];
  } catch (err) {
    console.error(err);
  }
  return durations;
}

async function getVideoList(query: string): Promise<youtube_v3.Schema$SearchListResponse> {
  let result: youtube_v3.Schema$SearchListResponse = {};
  try {
    const { data } = await youtube.search.list({
      q: query,
      fields: 'items(id(videoId),snippet(title))',
      type: ['video'],
      videoCategoryId: '10', // music
      maxResults: 35,
      part: ['snippet'],
    });
    result = data;
  } catch (err) {
    console.error(err);
  }
  return result;
}

export default async function performSearch(query: string): Promise<SearchResult[]> {
  const videoList = await getVideoList(query);
  const ids = videoList.items?.map((entry) => entry.id?.videoId);
  const durations = await getVideoDurations(ids as string[]);
  const searchResult = videoList.items?.map((item, index) => {
    const currentVideo = [
        item.id?.videoId,
        item.snippet?.title,
        durations[index],
    ];
    return currentVideo;
  }) as SearchResult[];
  return searchResult;
}
