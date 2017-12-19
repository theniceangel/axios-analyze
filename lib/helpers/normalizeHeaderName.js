'use strict';

var utils = require('../utils');
// headers是一个对象，normalizedName是一个字符串
module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    // 如果headers的key，与normalizedName比对的时候满足下面条件
    /* 比如headers = {"contentType":1}  normalizedName = "Content-Type",最后headers会处理成{"Content-Type":1}*/
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};
