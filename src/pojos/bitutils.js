export function createNRPNPairFromNumber(value) {
  let msb = 0;
  let lsb = 0;
  if(value < 0) {
    msb = 1;
    lsb = value & 0x7F
  } else {
    msb = (value >> 7) & 0x7F;
    lsb = value & 0x7F;
  }
  return [msb, lsb]
}

export function createSignedValue(bitSize, oldValue) {
  let valueIsArray = oldValue.constructor === Array;
  let messageSize = 1 << Number(bitSize);
  let halfSize = messageSize / 2;
  let signedValue, newValue;
  if (valueIsArray) {
    signedValue = oldValue[2];
  }
  else {
    signedValue = oldValue;
  }
  signedValue = signedValue - halfSize;
  if (signedValue < 0) {
    signedValue = signedValue + messageSize
  }
  if (valueIsArray) {
    newValue = [oldValue[0], oldValue[1], signedValue]
  }
  else {
    newValue = signedValue;
  }
  console.log("old val", oldValue, "of size", bitSize, "becomes", newValue);
  return newValue;
}