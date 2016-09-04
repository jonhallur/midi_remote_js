/**
 * Created by jonh on 29.6.2016.
 */

export class SysExHeaderField {
  constructor({ name = '', value = 0 } = {}) {
    if(!(typeof name === 'string')) {
      throw TypeError('Name not of type String');
    }
    else {
      this.name = name
    }
    if(!(typeof value === 'number')) {
      throw TypeError('Value not of type Number');
    }
    else {
      this.value = value;
    }
  }
  get_value() {
    return this.value;
  }
  dump() {
    return { name: this.name, value: this.value };
  }
}

export class SysExHeaderChannelModifiedField extends SysExHeaderField {
  constructor({ name = '', constant = 0 } = {}) {
    super({name: name, value: constant});
  }

  get_value(channel) {
    if (!(typeof channel === 'number')) {
      throw TypeError('channel not of type Number');
    }
    if (channel < 1 || channel > 16) {
      throw RangeError('channel number out of range');
    }
    return this.value + channel - 1;
  }
}
