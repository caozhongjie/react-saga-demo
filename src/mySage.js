import {call, put, takeEvery} from 'redux-saga/effects'
// 模拟登陆接口
const UserService = {
    login(name) {
        return new Promise((resolve, reject) => {
            console.log('login', name)
            setTimeout(() => {
                if(name === '小明') {
                    console.log('suc')
                    resolve({name: '小明'})
                } else {
                    reject({name: '用户名或密码错误'})
                }
            }, 1000)
        })
    }
}
function* loginHandle(action) {
    console.log('loginHandle', action)
    try{
        const res = yield call(UserService.login, action.name) //call执行UserService.login，并且将action.name当参数传递过去
        console.log('res', res)
        yield put({type: 'requestSuccess', res}) // put和dispatch类似，执行reducer
    } catch (error) {
        console.log('error', error)
        yield put({type: 'requestFailure', error})
    }
}

function* mySaga() {
    yield takeEvery('login', loginHandle) // 类似于将函数重命名，调用login则会执行loginHandle，并且将login得参数传递过去
}
export  default mySaga