export function getData(el, name, val?, prefix = '') {
    name = prefix + name
    if (val) {
        return el.setAttribute(name, val)
    } else {
        return el.getAttribute(name)
    }
}
