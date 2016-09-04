/**
 * Created by jonhallur on 31.8.2016.
 */
export function eventValueHandler(func, event) {
    func(event.target.value);
}

export function eventCheckedHandler(func, event) {
    func(event.target.checked);
}