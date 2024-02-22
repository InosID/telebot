import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import https from 'https';

interface VideoData {
  title: string;
  a: string;
  vid: string;
  links: {
    mp3: {
      mp3128: {
        k: string;
        size: string;
        q: string;
      };
    };
    mp4: {
      "17"?: {
        size: string;
      };
      "18": {
        k: string;
        q: string;
      };
    };
  };
}

interface VideoDetails {
  title: string;
  channel: string;
  videoID: string;
  size: string;
  quality: string;
  url: string;
}

async function ytmp3(url: string): Promise<VideoDetails> {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
        Cookie: "_ga=GA1.2.56066711.1640019302; _gid=GA1.2.1024042191.1640019302; __atuvc=1%7C51; __atuvs=61c0b56a497017fe000; __atssc=google%3B1; prefetchAd_4425332=true",
      },
    };

    const { data }: AxiosResponse<VideoData> = await axios.post("https://yt1s.com/api/ajaxSearch/index", `q=${encodeURIComponent(url)}&vt=home`, config);
    const { data: result }: AxiosResponse<any> = await axios.post("https://yt1s.com/api/ajaxConvert/convert", `vid=${encodeURIComponent(data.vid)}&k=${encodeURIComponent(data.links.mp3["mp3128"].k)}`, config);

    return {
      title: data.title,
      channel: data.a,
      videoID: data.vid,
      size: data.links.mp3["mp3128"].size,
      quality: data.links.mp3["mp3128"].q,
      url: result.dlink,
    };
  } catch (error: any) {
    throw new Error(`Error in ytmp3: ${error.message}`);
  }
}

async function ytmp4(url: string): Promise<VideoDetails> {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
        Accept: "*/*",
        Origin: "https://yt1s.com/",
        Referer: "https://yt1s.com/id89",
        Cookie: "_ga=GA1.2.56066711.1640019302; _gid=GA1.2.1024042191.1640019302; __atssc=google%3B1; __atuvc=2%7C51; __atuvs=61c0b56a497017fe001; prefetchAd_3897490=true",
      },
    };

    const { data }: AxiosResponse<VideoData> = await axios.post("https://yt1s.com/api/ajaxSearch/index", `q=${encodeURIComponent(url)}&vt=home`, config);
    const { data: result }: AxiosResponse<any> = await axios.post("https://yt1s.com/api/ajaxConvert/convert", `vid=${encodeURIComponent(data.vid)}&k=${encodeURIComponent(data.links.mp4["18"].k)}`, config);

    return {
      title: data.title,
      channel: data.a,
      videoID: data.vid,
      size: data.links.mp4["17"]?.size ?? "",
      quality: data.links.mp4["18"].q,
      url: result.dlink,
    };
  } catch (error: any) {
    throw new Error(`Error in ytmp4: ${error.message}`);
  }
}

interface Config {
  base: string;
  quality: {
    [key: string]: string;
  };
}

const config: Config = {
  base: 'https://i.ytimg.com/vi/',
  quality: {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    standard: 'sddefault',
    maxres: 'maxresdefault'
  }
};

function valid(id: string, proxy: string, callback: (exist: { maxres: boolean; standard: boolean }) => void): void {
  https.get(proxy + config.base + id + '/' + config.quality.maxres + '.jpg', function(response) {
    if (response.statusCode === 200)
      callback({ maxres: true, standard: true });
    else {
      https.get(proxy + config.base + id + '/' + config.quality.standard + '.jpg', function(response) {
        if (response.statusCode === 200)
          callback({ maxres: false, standard: true });
        else
          callback({ maxres: false, standard: false });
      });
    }
  });
}

function allThumbnail(id: string, proxy = '', callback: (allYouthumbs: { [key: string]: string }) => void): void {

  const allYouthumbs: { [key: string]: string } = {};

  valid(id, proxy, function(exist) {
    if (exist.maxres) {

      for (const quality in config.quality) {
        allYouthumbs[quality] = config.base + id + '/' + config.quality[quality] + '.jpg';
      }

    }
    else if (exist.standard) {

      for (const quality in config.quality) {
        if (quality === 'maxres')
          continue;
        allYouthumbs[quality] = config.base + id + '/' + config.quality[quality] + '.jpg';
      }

    }
    else {

      for (const quality in config.quality) {
        if (quality === 'maxres' || quality === 'standard')
          continue;
        allYouthumbs[quality] = config.base + id + '/' + config.quality[quality] + '.jpg';
      }

    }

    // Move the callback function call inside the asynchronous callback
    callback(allYouthumbs);
  });
};

async function tiktod(url: string): Promise<any> {
  if (!url) {
    throw new Error('Url input is required');
  }

  try {
    const response = await axios.get('https://tiktod.eu.org/download', { params: { url } });
    return response.data;
  } catch (error) {
    throw new Error('Failed to download TikTok content');
  }
}


export { ytmp3, ytmp4, allThumbnail, tiktod };
