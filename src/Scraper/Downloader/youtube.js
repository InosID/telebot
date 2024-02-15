"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allThumbnail = exports.ytmp4 = exports.ytmp3 = void 0;
const axios_1 = __importDefault(require("axios"));
function ytmp3(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "User-Agent": "Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
                    Cookie: "_ga=GA1.2.56066711.1640019302; _gid=GA1.2.1024042191.1640019302; __atuvc=1%7C51; __atuvs=61c0b56a497017fe000; __atssc=google%3B1; prefetchAd_4425332=true",
                },
            };
            const { data } = yield axios_1.default.post("https://yt1s.com/api/ajaxSearch/index", `q=${encodeURIComponent(url)}&vt=home`, config);
            const { data: result } = yield axios_1.default.post("https://yt1s.com/api/ajaxConvert/convert", `vid=${encodeURIComponent(data.vid)}&k=${encodeURIComponent(data.links.mp3["mp3128"].k)}`, config);
            return {
                title: data.title,
                channel: data.a,
                videoID: data.vid,
                size: data.links.mp3["mp3128"].size,
                quality: data.links.mp3["mp3128"].q,
                url: result.dlink,
            };
        }
        catch (error) {
            throw new Error(`Error in ytmp3: ${error.message}`);
        }
    });
}
exports.ytmp3 = ytmp3;
function ytmp4(url) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "User-Agent": "Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
                    Accept: "*/*",
                    Origin: "https://yt1s.com/",
                    Referer: "https://yt1s.com/id89",
                    Cookie: "_ga=GA1.2.56066711.1640019302; _gid=GA1.2.1024042191.1640019302; __atssc=google%3B1; __atuvc=2%7C51; __atuvs=61c0b56a497017fe001; prefetchAd_3897490=true",
                },
            };
            const { data } = yield axios_1.default.post("https://yt1s.com/api/ajaxSearch/index", `q=${encodeURIComponent(url)}&vt=home`, config);
            const { data: result } = yield axios_1.default.post("https://yt1s.com/api/ajaxConvert/convert", `vid=${encodeURIComponent(data.vid)}&k=${encodeURIComponent(data.links.mp4["18"].k)}`, config);
            return {
                title: data.title,
                channel: data.a,
                videoID: data.vid,
                size: (_b = (_a = data.links.mp4["17"]) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : "",
                quality: data.links.mp4["18"].q,
                url: result.dlink,
            };
        }
        catch (error) {
            throw new Error(`Error in ytmp4: ${error.message}`);
        }
    });
}
exports.ytmp4 = ytmp4;
const https_1 = __importDefault(require("https"));
const config = {
    base: 'https://i.ytimg.com/vi/',
    quality: {
        default: 'default',
        medium: 'mqdefault',
        high: 'hqdefault',
        standard: 'sddefault',
        maxres: 'maxresdefault'
    }
};
function valid(id, proxy, callback) {
    https_1.default.get(proxy + config.base + id + '/' + config.quality.maxres + '.jpg', function (response) {
        if (response.statusCode === 200)
            callback({ maxres: true, standard: true });
        else {
            https_1.default.get(proxy + config.base + id + '/' + config.quality.standard + '.jpg', function (response) {
                if (response.statusCode === 200)
                    callback({ maxres: false, standard: true });
                else
                    callback({ maxres: false, standard: false });
            });
        }
    });
}
function allThumbnail(id, proxy = '', callback) {
    const allYouthumbs = {};
    valid(id, proxy, function (exist) {
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
}
exports.allThumbnail = allThumbnail;
;
