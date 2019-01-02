import {assert} from 'chai'
import {createNRPNPairFromNumber} from './bitutils'

describe('BitManipulate', function () {
  it('Will give negative numbers get 1 as MSB and correct lsb values', () => {
    var value = -12;
    var expected_msb = 1;
    let [result_msb, result_lsb] = createNRPNPairFromNumber(value);
    assert.equal(result_msb, expected_msb)
  });
  it('Will make a number above 7 bits get 1 as MSB', () => {
    var value=128;
    var expected_msb = 1;
    let [result_msb, result_lsb] = createNRPNPairFromNumber(value);
    assert.equal(result_msb, expected_msb)
  });
  it('Will make small values have same values', ()=> {
    var value = 12;
    var expected_msb = 0;
    var expected_lsb = value;
    let [result_msb, result_lsb] = createNRPNPairFromNumber(value);
    assert.equal(result_msb, expected_msb);
    assert.equal(result_lsb, expected_lsb);
  });
  it('Will make negative values have correct msb and lsb', () => {
    var value = -12;
    var expected_msb = 1;
    var expected_lsb = 116;
    let [result_msb, result_lsb] = createNRPNPairFromNumber(value);
    assert.equal(result_msb, expected_msb);
    assert.equal(result_lsb, expected_lsb);
  })
});

