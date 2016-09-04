import { chai } from 'meteor/practicalmeteor:chai';
import {SysExHeader, SysExHeaderChannel} from './SysExHeader.js'
import {SysExHeaderField, SysExHeaderChannelModifiedField} from './SysExHeaderField.js'

const SYSEX_STATUS = 0xF0;

function assert_throws(name, fields) {
  obj = {name: name, fields: fields};
  chai.assert.throws(() => {
    new SysExHeader(obj);
  });
}
function assert_does_not_throw(name, fields) {
  obj = {name: name, fields: fields};
  chai.assert.doesNotThrow(() => {
    new SysExHeader(obj);
  });
}
describe('SysExHeader', function () {
  it('Will throw Error if name is a number and not a string', () => {
    var name = 10;
    var fields = [];
    assert_throws(name, fields);
  });
  it('Will throw error if fields is not an array', () => {
    var name = 'name';
    var invalid_type = 'name';
    assert_throws(name, invalid_type);
  });
  it('Will throw error if fields are not of the right type', () => {
    var name = 'name';
    var invalid_fields = ['string', new SysExHeaderField({name: 'name', value: 10})];
    assert_throws(name, invalid_fields);
  });
  it('Will not throw on correctly assembled object', () => {
    var name = 'name';
    var fields = [new SysExHeaderField({name: 'name', value: 10})];
    assert_does_not_throw(name, fields);
  });
  it('Will not throw on extended fields', () => {
    var name = 'name';
    var fields = [
      new SysExHeaderField({name: 'name', value: 10}),
      new SysExHeaderChannelModifiedField({name: 'name', constant: 16})
    ];
    assert_does_not_throw(name, fields);
  });
  it('Will construct a correct header', () => {
    var manufacturer_id = 0x10;
    var device_id = 0x06;
    var op_code = 0x06;
    var field1 = new SysExHeaderField({name: 'Manufacturer ID', value: manufacturer_id});
    var field2 = new SysExHeaderField({name: 'Device ID', value: device_id});
    var field3 = new SysExHeaderField({name: 'Opcode', value: op_code});
    var fields = [field1, field2, field3];
    var obj = {name: 'Matrix 1000 Parameter Edit', fields: fields};
    var header = new SysExHeader(obj);
    var actual = header.generate_header();
    var expected = [ SYSEX_STATUS, manufacturer_id, device_id, op_code];
    chai.assert.deepEqual(actual, expected);

  });
});

describe('SysExHeaderModifiedField', function () {
  it('Can generate a channel modified field', () => {
    var manufacturer_id = 0b01000011;
    var channel_mod     = 0b00010000;
    var channel_used = 10;
    var parameter_group = 0b00010010;
    var field1 = new SysExHeaderField({name: 'Manufacturerer ID', value: manufacturer_id});
    var field2 = new SysExHeaderChannelModifiedField({name: 'Channel', constant: channel_mod});
    var field3 = new SysExHeaderField({name: 'Parameter Group', value: parameter_group});
    var fields = [field1, field2, field3];
    var obj = {name: 'DX21 Parameter Edit', fields: fields};
    var header = new SysExHeaderChannel(obj);
    var actual = header.generate_header(channel_used);
    var expected = [SYSEX_STATUS, manufacturer_id, channel_mod + channel_used - 1, parameter_group ];
    chai.assert.deepEqual(actual, expected);
  })
});