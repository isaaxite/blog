const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const  url = require('url');

const imgOrigins = ['http://2.csc1998.com/', 'http://pic.csc1998.com/'];
const viewidThreshold = 519253;

const config = {
  catalog: 'http://www.chuixue.net/manhua/552/'
};

/**
 * 获取目录dom对象
 * @param {*} _url 
 */
function getCatalogDom(_url) {
  const reqOptions = {
    method: 'GET',
    url: _url,
    responseType: 'arraybuffer'
  };
  return axios.request(reqOptions).then((resp) => {
    const data = iconv.decode(resp.data, 'GBK');
    const doc = cheerio.load(data);
    return doc;
  }).catch((err) => {
    console.log(err);
  });
}

/**
 * 获取漫画名字
 * @param { string } _doc 
 */
function getComicName(_doc) {
  const selectorPath = '#intro_l > div.title > h1';
  return _doc(selectorPath).text();
}

/**
 * 获取章节列表资源
 * @param { string } _doc 
 * @param { string } _catalogUrl 
 */
function getComicChaptes(_doc, _catalogUrl) {
  const { URL } = url;
  const origin = (new URL(_catalogUrl)).origin;
  const selectorPath = '#play_0 ul > li > a';
  const chapterEles = _doc(selectorPath);
  const list = [];
  for (let i = 0, len = chapterEles.length; i < len; i+=1) {
    const ele = chapterEles.eq(i);
    list.push({
      title: ele.attr('title'),
      url: url.resolve(origin, ele.attr('href'))
    })
  }
  return list;
}

/**
 * 解析目录页，获取漫画章节资源
 * @param { string } _catalogUrl 
 */
function parseCatalog(_catalogUrl) {
  return getCatalogDom(_catalogUrl)
    .then((_doc) => {
      const comicName = getComicName(_doc);
      const catalogs = getComicChaptes(_doc, _catalogUrl);
      return {
        comicName,
        catalogs
      };
    });
}

/**
 * 获取图片origin
 * @param { number } viewId
 */
function getImgOrigin(viewId) {
  let origin;
  if (viewId >= viewidThreshold) {
      origin = imgOrigins[0];
  } else {
      origin = imgOrigins[1];
  }
  return origin;
}

/**
* 获取图片链接的后半部分
* @param { string } _doc html文本
*/
function getImgPaths(_doc) {
  const photosr = [];
  const packedMatcheds = _doc.match(/packed=\"(.*)\"\;/);
  const packed = packedMatcheds && packedMatcheds[1];
  if (packed) {
    const temp = Buffer.from(packed, 'base64').toString();
    eval(eval(temp.slice(4)));
    photosr.shift();
  } else {
    const photosrMatched = _doc.match(/photosr\[.+\] =\".*";/);
    if (photosrMatched) {
      eval(photosrMatched[0]);
      photosr.shift();
    }
  }

  return photosr;
}

  /**
   * 组合img的origin和 paths
   * @param { string } _origin
   * @param { string[] } _paths
   */
  function generateImgSrcs(_origin, _paths) {
    const srcs = _paths.map((imgPath) => {
      return url.resolve(_origin, imgPath);
    });
    return srcs;
  }

/**
 * 获取章节的图片资源链接
 * @param { string } _chapterUrl 
 */
function getImageSrcList(_chapterUrl) {
  const imgSrcList = [];
  const reqOptions = {
    method: 'GET',
    url: _chapterUrl
  };
  return axios.request(reqOptions).then((resp) => {
    const doc = resp.data || '';
    const viewId = doc.match(/var viewid = \"(.*)\"\;/)[1];
    const origin = getImgOrigin(viewId);
    const imgPaths = getImgPaths(doc);
    const imgSrcList = generateImgSrcs(origin, imgPaths);
    return imgSrcList;
  })
}

/**
 * 下载漫画图片并保存
 * @param {*} _url 
 * @param {*} _savePath 
 */
function downloadPic(_url, _savePath) {
  const options = {
    method: 'GET',
    responseType:'stream',
    url: _url
  };
  return axios.request(options).then((resp) => {
    const imgStream = resp.data;
    imgStream && imgStream.pipe(fs.createWriteStream(_savePath));
  }).catch((error) => {
    console.log(error.message);
  });
}

/**
 * 转码搜索关键字
 * @param { string } _text 
 */
function encodeText(_text) {
  const buf = iconv.encode(_text, 'GBK');
  const hex = buf.toString('hex');
  const chars = hex.split('');
  let text = '';
  for (let i = 0, len = chars.length; i < len; i += 2) {
    const char = chars.slice(i, i + 2).join('');
    text += `%${char.toUpperCase()}`;
  }
  return text;
}

module.exports = {
  /**
   * 下载漫画
   * @param { string } _catalogUrl 
   */
  download: function(_catalogUrl) {
    parseCatalog(_catalogUrl).then((_data) => {
      const lastedChapter = _data.catalogs.shift();
      getImageSrcList(lastedChapter.url).then((imgSrcList) => {
        (function _download(index) {
          const imgSrc = imgSrcList[index];
          if (imgSrc) {
            console.log('download:', imgSrc);
            const format = imgSrc.split('.').pop();
            const picIndex = index + 1;
            const fileName = picIndex + '.' + format;
            const saveDir = path.join(process.cwd(), './' + _data.comicName + '/');
            const savePath = path.join(saveDir,  fileName);
            if (!fs.existsSync(saveDir)) {
              fs.mkdirSync(saveDir);
            }
            downloadPic(imgSrc, savePath).then(() => {
              _download(++index);
            }).catch((error) => {
              console.log(error.message);
            });
          } else {
            console.log('finish chapter!');
          }
        })(0);
      });
    }).catch((error) => {
      console.log(error.message);
    });
  },

  /**
   * 站内搜索漫画
   * @param { string } keyword 
   */
  search(_keyword) {
    const selectorPath = '#dmList > ul > li > dl > dt > a';
    const keyword = encodeText(_keyword);
    const origin = 'http://www.chuixue.net/';
    const searchUrl = 'http://www.chuixue.net/e/search/?searchget=1&show=title,player,playadmin,pinyin&keyboard=' + keyword;
    const reqOptions = {
      method: 'GET',
      url: searchUrl,
      responseType: 'arraybuffer'
    };
    const promise = axios.request(reqOptions)
    .then((resp) => {
      const html = iconv.decode(resp.data, 'GBK');
      const doc = cheerio.load(html);
      const eles = doc(selectorPath);
      let searchList = [];
      for (let i = 0, len = eles.length; i < len; i+=1) {
        const ele = eles.eq(i);
        const name = ele.attr('title');
        const src = url.resolve(origin, ele.attr('href'));
        searchList.push({ name, src });
      }
      searchList = searchList.filter((item) => {
        return item.name;
      });
      const str = [];
      searchList.map((item) => {
        str.push(item.name + ': ' + item.src);
      });
      console.log(str.join('\r\n'));
      return searchList;
    })
    .catch((error) => {
      console.log(error);
    });

    return promise;
  }
};
