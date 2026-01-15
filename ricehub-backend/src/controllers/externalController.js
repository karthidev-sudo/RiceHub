import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Simple In-Memory Cache to save API Quota
let cache = {
  data: [],
  lastFetch: 0,
};

const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour

export const getExternalRices = async (req, res) => {
  try {
    const now = Date.now();

    // 1. Serve from Cache if valid
    if (cache.data.length > 0 && now - cache.lastFetch < CACHE_DURATION) {
      return res.json(cache.data);
    }

    console.log('Fetching fresh data from GitHub & YouTube...');

    // 2. Fetch GitHub "Dotfiles" (Top Starred)
    // Query: topic:dotfiles + topic:rice, Sort by Stars
    const githubPromise = axios.get(
      'https://api.github.com/search/repositories?q=topic:dotfiles+topic:rice&sort=stars&per_page=6',
      {
        headers: {
          // GitHub requires a User-Agent
          'User-Agent': 'RiceHub-App',
          // Authorization: `token ${process.env.GITHUB_TOKEN}` // Uncomment if you hit rate limits
        },
      }
    );

    // 3. Fetch YouTube "Linux Rice" Videos
    // Query: "linux rice customization", Type: video, Order: viewCount
    const youtubePromise = axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=linux+rice+customization&type=video&maxResults=6&order=viewCount&key=${process.env.YOUTUBE_API_KEY}`
    );

    // Wait for both
    const [githubRes, youtubeRes] = await Promise.allSettled([
        githubPromise, 
        youtubePromise
    ]);

    let results = [];

    // Process GitHub Results
    if (githubRes.status === 'fulfilled') {
      const repos = githubRes.value.data.items.map(repo => ({
        source: 'github',
        id: repo.id,
        title: repo.name,
        author: repo.owner.login,
        url: repo.html_url,
        // GitHub doesn't give good images in search, so we use the owner's avatar or a default placeholder
        thumbnail: repo.owner.avatar_url, 
        stats: `${repo.stargazers_count} ⭐`,
        description: repo.description
      }));
      results = [...results, ...repos];
    } else {
        console.error("GitHub Fetch Failed:", githubRes.reason?.message);
    }

    // Process YouTube Results
    if (youtubeRes.status === 'fulfilled') {
      const videos = youtubeRes.value.data.items.map(video => ({
        source: 'youtube',
        id: video.id.videoId,
        title: video.snippet.title,
        author: video.snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        thumbnail: video.snippet.thumbnails.high.url,
        stats: 'Video',
        description: video.snippet.description
      }));
      results = [...results, ...videos];
    } else {
        console.error("YouTube Fetch Failed:", youtubeRes.reason?.message);
    }

    // 4. Shuffle the results for "Randomness"
    results = results.sort(() => Math.random() - 0.5);

    // 5. Update Cache
    cache = {
      data: results,
      lastFetch: now,
    };

    res.json(results);
  } catch (error) {
    console.error('External Fetch Error:', error);
    res.status(500).json({ message: 'Failed to fetch external rices' });
  }
};