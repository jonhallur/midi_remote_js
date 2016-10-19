/**
 * Created by jonh on 16.7.2016.
 */
import {SysExHeaderField, SysExHeaderChannelModifiedField} from './SysExHeaderField.js'
import _ from 'lodash'

export class SysExHeader {
  constructor({ name = '', fields = [] } = {}) {
    if(!(typeof name === 'string')) {
      throw TypeError('Name not of type String');
    }
    else {
      this.name = name
    }
    if(!(fields.constructor === Array)) {
      throw TypeError('Fields is not of type array');
    }
    else {
      var should_throw = false;
      fields.forEach((item) => {
        if(!(item instanceof SysExHeaderField)) {
          should_throw = true;
        }
      });
      if(should_throw) {
        throw TypeError('At least one item in fields is not of type SysExHeaderField');
      }
      else {
        this.fields = fields;
      }
    }
  }
  generate_header() {
    let header = [0xF0];
    this.fields.forEach((item) => {
      header.push(item.get_value());
    });
    return header;
  }
}

export class SysExHeaderChannel extends SysExHeader {
  constructor({ name = '', fields = []} = {}) {
    super({name: name, fields: fields});
  }
  generate_header(hex_channel, status_byte=[0xF0]) {
    if (hex_channel === undefined) {
      throw TypeError('channel is undefined');
    }
    if (!_.isArray(status_byte)) {
      throw TypeError('status_byte is not a list');
    }
    let header = status_byte;
    this.fields.forEach((item)=> {
      if (item instanceof SysExHeaderChannelModifiedField) {
        header.push(item.get_value(hex_channel));
      }
      else {
        header.push(item.get_value());
      }
    });
    return header;
  }
}