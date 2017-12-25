'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  // 生成Axios类的实例
  var context = new Axios(defaultConfig);
  // 生成一个实例，其实是一个wrap函数，并且这个wrap函数的上下文是context对象
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  // 将Axios原型对象上的属性和方法都挂在到wrap函数上，
  utils.extend(instance, Axios.prototype, context);
  //  context上的属性都挂在到实例上
  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
// wrap函数挂在create函数，相当于工厂函数，生成不同的axios实例
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
// axios实例上挂在Cancel构造函数
// 实例化Cancel类，主要是返回一个含有message信息的对象
axios.Cancel = require('./cancel/Cancel');
// 实例化一个具有cancellation操作的对象
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
// 接受callback函数，返回wrap函数，wrap函数接受一个数组array，并且会执行callback.apply(null,array)
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;
