import * as fitFileParser from 'fit-file-parser';

const FitFileParser = {};

FitFileParser.install = function (Vue) {
  Vue.prototype.$parseFitFile = async function (file) {
    return await file.arrayBuffer()
      .then(content => this.$readFitFile(content))
      // eslint-disable-next-line no-return-assign
      .then(data => data)
      .catch(error => console.error(error));
  };

  Vue.prototype.$readFitFile = function(buffer) {
    // TODO: handle this import correctly
    // eslint-disable-next-line new-cap
    const fitParser = new fitFileParser.default({
      force: true,
      speedUnit: 'km/h',
      lengthUnit: 'km',
      temperatureUnit: 'kelvin',
      elapsedRecordField: true,
      mode: 'cascade'
    });

    let content = {};
    fitParser.parse(buffer, (error, data) => {
      if (!error) content = data;
    });

    return content;
  };
};

export default FitFileParser;
