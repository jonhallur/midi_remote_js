/**
 * Created by jonh on 29.6.2016.
 */
import chai from 'chai';
import { SysExHeaderField, SysExHeaderChannelModifiedField } from './SysExHeaderField.js'

describe('SysExHeaderField', function () {
  it('Will fail on wrong name argument', function () {
    // This code will be executed by the test driver when the app is started
    // in the correct mode
    var obj = { name: 10, value: 10};

    chai.assert.throws(() => {
      new SysExHeaderField(obj);
    }, Error);
  });
  it('Will fail on wrong value argument', () => {
    var obj = { name: "sting", value: "number"};
    chai.assert.throws(() => {
      new SysExHeaderField(obj);
    }, Error);
  });
  it('Argument position does not matter', () => {
    let val = 10;
    let str = "string";
    var obj = {value: val, name: str};
    var field = new SysExHeaderField(obj);
    chai.assert.instanceOf(field, SysExHeaderField, "field is instance if SysExHeaderField");
    chai.assert.strictEqual(field.value, val);
    chai.assert.strictEqual(field.name, str);
  });
  it('Ignores extra fields in object', () => {
    var str = "sting";
    var val = 10;
    var obj = {_id: "some_really_long_key", name: str, value: val};
    var field = new SysExHeaderField(obj);
    chai.assert.instanceOf(field, SysExHeaderField, "field is instance if SysExHeaderField");
    chai.assert.strictEqual(field.value, val);
    chai.assert.strictEqual(field.name, str);
    chai.assert.strictEqual(field._id, undefined);
  });
  it('Can create midi field', () => {
    var name = "name";
    var modifier = 1 << 8;
    var obj = {name: name, constant: modifier};
    var channel_field;
    chai.assert.doesNotThrow(() => {
      channel_field = new SysExHeaderChannelModifiedField(obj);
    }, TypeError, 'Does not throw TypeError');
    chai.assert.strictEqual(channel_field.value, modifier );
  });
  it('Applies modifier correctly to midi channel', () => {
    var name = name;
    var constant = 1 << 4;
    var channel_modifier = 1;
    var obj = {name: name, constant: constant};
    var channel_field = new SysExHeaderChannelModifiedField(obj);
    chai.assert.strictEqual(channel_field.get_value(channel_modifier), (constant+channel_modifier-1));
  });
});