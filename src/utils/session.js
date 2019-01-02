
// Session Storage
export function setSession (key, data) {
  if (window.sessionStorage) {
    sessionStorage.setItem(key, JSON.stringify(data))
  }
}

export function getSession (key) {
  if (window.sessionStorage) {
    return JSON.parse(sessionStorage.getItem(key))
  }
}

export function removeSession (key) {
  if (window.sessionStorage) {
    sessionStorage.removeItem(key)
  }
}

// Local Storage
export function setLocalStorage (key, data) {
  if (window.localStorage) {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export function getLocalStorage (key) {
  if (window.localStorage) {
    return JSON.parse(localStorage.getItem(key))
  }
}

export function removeLocalStorage (key) {
  if (window.localStorage) {
    localStorage.removeItem(key)
  }
}
