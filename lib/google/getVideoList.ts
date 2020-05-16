/* eslint-disable @typescript-eslint/camelcase */
import getYoutubeClient from './getYoutubeClient';

export type SearchResult = {
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
      maxResults: 10,
      part: 'snippet',
    });
    result = data.items?.map((item) => {
      const currentVideo = {
        id: item.id as string,
        title: item.snippet?.title as string,
      };
      return currentVideo;
    }) as SearchResult[];
  } catch (err) {
    console.error(err);
  }
  return result;
}
