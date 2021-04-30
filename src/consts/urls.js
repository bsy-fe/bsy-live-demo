/**
 * @author 杨欣
 * @date 2021-04-02 18:42
 */
console.log('=============process.env::', process.env)
const {REACT_APP_BSY_LIVE_URL} = process.env

export const BSY_LIVE_URL = REACT_APP_BSY_LIVE_URL
