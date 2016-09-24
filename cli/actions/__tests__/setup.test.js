jest.mock('../../logger');
jest.mock('../../../utils/paths');
jest.setMock('path', {
  resolve: p => p,
  join: p => ""
});

describe('setup', () => {
  const logger = require('../../logger');
  const program = {
    args: [""]
  };
  const obj = {};
  const setup = require('../setup');
  let tempPackageJSON = {
    name: "test-kyt",
    kyt: {
      version: "0.2.0",
    }
  };
  let kytPkg = {
    version: "0.2.0"
  };
  it('checks the starter-kyt version', () => {
    expect(setup.checkStarterKytVersion(tempPackageJSON, kytPkg)).toEqual(true);
  });
  kytPkg.version = "0.1.0";
  it('errors when starter-kyt versions dont match', () => {
    setup.checkStarterKytVersion(tempPackageJSON, kytPkg);
    expect(logger.warn).toBeCalledWith('test-kyt requires kyt version 0.2.0 but kyt 0.1.0 is installed.');
  });

});
