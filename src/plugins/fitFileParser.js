import * as fitFileParser from 'fit-file-parser';

const FitFileParser = {};

FitFileParser.install = function (Vue, options) {
  Vue.prototype.$parseFitFile = async function (file) {
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

    let fitData = {};

    await file.arrayBuffer()
      .then(content => fitParser.parse(content, (error, data) => {
        if (!error) {
          fitData = data;
        }
      }));

    return fitData;
  };
};

export default FitFileParser;
