const nock = require('nock');
const chalk = require('chalk');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

chai.use(sinonChai);

const convertBTC = require('../src/ConvertBTC');

describe('ConvertBTC', () => {

  let consoleStub;

  const responseMock = {
    "success": true,
    "time": "2018-03-20 10:22:58",
    "price": 8465.93
  };

  beforeEach(() =>{
    consoleStub = sinon.stub(console, 'info');
  });

  afterEach( () => {
    consoleStub.restore();
  });

  it('should ruse currency USD and 1 amount default', async() => {
    //https://apiv2.bitcoinaverage.com/convert/global?from=BTC&to=USD&amount=1
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'USD', amount: 1 })
      .reply(200, responseMock);

    await convertBTC();
    expect(consoleStub).to.have.been.calledWith(`${chalk.red(1)} BTC to ${chalk.cyan('USD')} = ${chalk.yellow(8465.93)}`);

  });

  it('should ruse currency USD and 10 as amount', async() => {
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'USD', amount: 10 })
      .reply(200, responseMock);

    await convertBTC('USD', 10);
    expect(consoleStub).to.have.been.calledWith(`${chalk.red(10)} BTC to ${chalk.cyan('USD')} = ${chalk.yellow(8465.93)}`)
  });

  it('should ruse currency BRL and 1 as amount default', async() => {
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'BRL', amount: 1 })
      .reply(200, responseMock);

    await convertBTC('BRL');
    expect(consoleStub).to.have.been.calledWith(`${chalk.red(1)} BTC to ${chalk.cyan('BRL')} = ${chalk.yellow(8465.93)}`)
  });

  it('should message user when api reply with error', async() => {
    nock('https://apiv2.bitcoinaverage.com')
      .get('/convert/global')
      .query({ from: 'BTC', to: 'BRL', amount: 1 })
      .replyWithError('Error');

    await convertBTC('BRL');
    expect(consoleStub).to.have.been.calledWith(chalk.red('Something went wrong'))
  });
});
