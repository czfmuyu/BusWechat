import Cookie from 'vue-cookie'

// 获取Token 设置Token 移除Token

const TOKEN_KEY = `BASE_PER_FIX_KEY`
function getToken () {
  return Cookie.get(TOKEN_KEY)
}

function setToken (token) {
  Cookie.set(TOKEN_KEY, token, 7)
}

function removeToken () {
  Cookie.delete(TOKEN_KEY)
}

export { getToken, setToken, removeToken }
