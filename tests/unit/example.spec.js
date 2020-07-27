import fs from 'fs';
import path from 'path';
import { createLocalVue } from '@vue/test-utils';
import FitFileParser from '@/plugins/fitFileParser.js';

describe.skip('parser', () => {
  it('parse', () => {
    const localVue = createLocalVue();
    localVue.use(FitFileParser);

    const buffer = fs.readFileSync(path.resolve(__dirname, './run.fit'));

    console.log(localVue.prototype.$readFitFile(buffer));
  });
});
