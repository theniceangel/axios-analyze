'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  // 存储对象的数组
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  // 在数组里面push对应的具有fulfilled，rejected函数的对象，并且记录id，方便下次eject
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  // 移除this.handlers索引对应的具有fulfilled，rejected函数的对象
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
// 传入一个fn函数，并且将this.handlers的元素都传入fn函数并执行
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    // h即为this.handler数组的每一个元素
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;
