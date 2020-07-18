import recordLabels from '@/mappings/recordLabels.js';

const Utils = {};

Utils.install = function (Vue, options) {
  Vue.prototype.$getRecordLabel = function (record) {
    return recordLabels[record] || 'Unkown Record';
  };
};

export default Utils;
