/* eslint-disable camelcase */
import { google, youtube_v3 } from 'googleapis';

function decryptApiKey(): string {
  const key = 'QUl6YVN5QlBLRVMxRGlSTUIyQlUyR1JHTmVpRVktOHpQZVlFdVRv';
  const encryptedKey = Buffer.from(key, 'base64').toString('ascii');
  return encryptedKey;
}

export default function getYoutubeClient(): youtube_v3.Youtube {
  const auth = decryptApiKey();
  const youtubeClient = google.youtube({
    version: 'v3',
    auth,
  });
  return youtubeClient;
}
