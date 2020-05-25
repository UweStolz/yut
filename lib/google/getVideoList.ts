/* eslint-disable @typescript-eslint/camelcase */
import getYoutubeClient from './getYoutubeClient';

export interface SearchResult extends Array<string> {
  id: string;
  title: string;
}

const youtube = getYoutubeClient();

export default async function getVideoList(query: string): Promise<SearchResult[]> {
  let result: SearchResult[] = [];
  try {
    const { data } = await youtube.search.list({
      q: query,
      fields: 'items(id(videoId),snippet(title))',
      type: 'video',
      maxResults: 35,
      part: 'snippet',
    });
    result = data.items?.map((item) => {
      const currentVideo = [
        item.id?.videoId,
        item.snippet?.title,
      ];
      return currentVideo;
    }) as SearchResult[];
  } catch (err) {
    console.error(err);
  }
  return result;
}
