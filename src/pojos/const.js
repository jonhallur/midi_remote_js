import * as R from "ramda";

export const FORM_TYPE = {};
FORM_TYPE[FORM_TYPE[0] = "STRING"] = 0;
FORM_TYPE[FORM_TYPE[1] = "NUMBER"] = 1;
FORM_TYPE[FORM_TYPE[2] = "STRING_LIST"] = 2;
FORM_TYPE[FORM_TYPE[3] = "NUMBER_LIST"] = 3;
FORM_TYPE[FORM_TYPE[4] = "DATA_KEY"] = 4;
FORM_TYPE[FORM_TYPE[5] = "CONTROL_TYPE"] = 5;
FORM_TYPE[FORM_TYPE[6] = "CONTROL_METHOD"] = 6;

export const CONTROL_METHOD = {};
CONTROL_METHOD[CONTROL_METHOD[0] = "SYS_EX"] = 0;
CONTROL_METHOD[CONTROL_METHOD[1] = "CC"] = 1;
CONTROL_METHOD[CONTROL_METHOD[2] = "OSC"] = 2;
CONTROL_METHOD[CONTROL_METHOD[3] = "NRPN"] = 3;

export const CONTROL_TYPE = {};
CONTROL_TYPE[CONTROL_TYPE[0] = "RANGE"] = 0;
CONTROL_TYPE[CONTROL_TYPE[1] = "TOGGLE"] = 1;
CONTROL_TYPE[CONTROL_TYPE[2] = "LIST"] = 2;
CONTROL_TYPE[CONTROL_TYPE[3] = "BIT_MASK"] = 3;
CONTROL_TYPE[CONTROL_TYPE[4] = "SRC_DST_MOD"] = 4;
CONTROL_TYPE[CONTROL_TYPE[5] = "ASCII"] = 5;

export const control_methods = R.filter(isNaN, R.keys(CONTROL_METHOD));
export const control_types = R.filter(isNaN, R.keys(CONTROL_TYPE));
let RangeModel = {
  name: {type: FORM_TYPE.STRING, help: "Type control full name here"},
  short_name: {type: FORM_TYPE.STRING, help: "Type control short name here"},
  minimum_value: {type: FORM_TYPE.NUMBER, help: "Type minimum value here"},
  maximium_value: {type: FORM_TYPE.NUMBER, help: "Type maximum value here"},
  default_value: {type: FORM_TYPE.NUMBER, help: "Type default value"},
  visual_offset: {type: FORM_TYPE.NUMBER, help: "Type visual offset from actual value"},
  actual_offset: {type: FORM_TYPE.NUMBER, help: "Type actual offset from value"}
};
let CCModel = {
  control_number: {type: FORM_TYPE.NUMBER, help: "Type MIDI controller number"}
};
const methodToModel = {
  "": {},
  [CONTROL_METHOD.CC]: CCModel
};
const typeToModel = {
  "": {},
  [CONTROL_TYPE.RANGE]: RangeModel
};
export let getModelType = function (type, method) {
  let typeModel = typeToModel[type || ""];
  let methodModel = methodToModel[method || ""];
  let addition = {
    control_type: {type: FORM_TYPE.CONTROL_TYPE, help: "Select control type"},
    control_method: {type: FORM_TYPE.CONTROL_METHOD, help: "Select control method"},
  };
  return {...typeModel, ...methodModel, ...addition}
};