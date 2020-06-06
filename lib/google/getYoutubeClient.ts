/* eslint-disable camelcase */
import { google, youtube_v3 } from 'googleapis';
import 'dotenv/config';

export default function getYoutubeClient(): youtube_v3.Youtube {
  const auth = process.env.YT_API_KEY;
  if (auth) {
    const youtubeClient = google.youtube({
      version: 'v3',
      auth,
    });
    return youtubeClient;
  }
  throw Error('No API-Key set!');
}
