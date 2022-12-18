"use strict";

function usedSize() {
  // 获取堆内存使用情况
  var used = process.memoryUsage().heapUsed;
  return Math.round(used / 1024 / 1024 * 100) / 100 + "M";
}