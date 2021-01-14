npx create-react-app my-app  
cd my-app  
npm start
###1、setState()只有在合成事件和钩子函数中是异步的，在原生事件、setTimeOut和setInterval中是同步的  
###2、事件回调函数注意绑定this的指向，常用的三种方法  
####&ensp;2-1.构造函数中绑定this并覆盖：this.change = this.change.bind(this)  
####&ensp;2-2.方法定义为箭头函数: change = () =>{}  
####&ensp;2-3.事件中定义为箭头函数： onChange = {() =>this.change()}  
###3、getDerivedStateFromProps(prop, state)会在render方法之前调用，并且在初始挂载及后续更新时都会被调用，它应返回一个对象来更新state,如果返回null则不更新任何内容（每次渲染前都会触发）  
###4、getSnapshotBeforeUpdate() 在最近⼀次渲染输出（提交到DOM 节点）之前调⽤。它使得组件能在发⽣更改之前从 DOM 中捕获⼀些信息（例如，滚动位置）。此⽣命周期的任何返回值将作为参数传递给componentDidUpdate()  
###5、context的基本使用方式(类似于vue中的provide/inject)
// 传递数据的组件
```js
export const {Provider,Consumer} = React.createContext("默认名称"); 
<Provider value="dark"> // 使用provider包裹，这样ContextProp组件或者他的下层（子/孙...）就可以使用该值
     <ContextProp />
</Provider>
// 传递多个值的方式
<Provider value={{name, store}}>
     <ContextProp />
</Provider>
```  
// 使用数据的组件  
```js
import {Consumer} from "./home"; // 引入传递数据组件中的Consumer,包裹要用的地方
<Consumer>
   {(value ) =>
        <div>
            <p>孙组件。获取传递下来的值:{value}</p>
         </div>
    }
</Consumer>
```
###6、react中的composition(类似于vue中的slot插槽)
#### &ensp;  6-1不具名插槽的使用
```js
// 父组件
 <Myslot> // 引入的子组件
     <div>要放在子组件中的内容</div>
</Myslot>
```
```js
// 子组件，有多个插槽时this.props.children.$$typeof有值则为不具名插槽
<div>
    组件本身的内容。。。
    {this.props.children} // 插槽的内容，这样就可以展示父组件放在插槽的东西了
</div>
```
####&ensp;  6-2具名插槽的使用
```js
// 父组件（传递一个对象）
 <div>
   <Myslot>
      {
         {
            btn: <div>具名插槽</div>
         }
      }
   </Myslot>
</div>
```
```js
// 子组件
 render() {
        console.log(this.props.children) // 将这个打印出来就知道接受到的是什么了,多个的时候这是一个数组
        return (
            <div>
                组件本身的内容
                {this.props.children[1].btn} // 插槽的内容，有多个插槽内容时候的写法
                 {this.props.children[1].btn} // 单个带名字的插槽的写法
            </div>
        );
    }
```
###7高阶组件HOC:  高阶组件是一个工厂函数，它接收一个组件并返回另一个组件
作用：为了提高组件复用率，可测试性，就要保证组件功能单一性，但是若要满足
复杂需求就要扩展单一的组件，因此就有了HOC
####&ensp;基础用法
```js
const foo = Cmp =>{
            return props => { // 这个props就是组件接受到传递过来的props
                console.log(props) 
                return (
                    <div style={{color: 'red'}}>
                        <Cmp {...props}></Cmp>
                    </div>
                )
            }
        }
// 以上代码等同于(将return取消没写)
const foo = Cmp => props =>
     <div style={{color: 'red'}}>
         <Cmp {...props}></Cmp>
     </div>
```
####&ensp;调用
```js
function Child() {
            return <div>12312312</div>
        }
        const foo = Cmp =>{
            return props => {
                console.log(props)
                return (
                    <div style={{color: 'red'}}>
                        <Cmp {...props}></Cmp>
                    </div>
                )
            }
        }

        const Foo = foo(Child) // 返回的就是一个组件
            return ( // render中调用
            <div>
                <Foo name={'zs'}></Foo>
            </div>
        );
```
HOC最终返回的是一个新的组件，可以把HOC的结果再当成参数传递给下一个HOC，形成链式调用

###8、hooks的基本使用(只能用于函数组件中)
1、使你再无需修改组件结构的情况下复用状态逻辑  
2、可将组件中相互关联的部分拆分成更小的函数，复杂组件将变得更容易理解  
3、更简洁，更易理解的代码
####8、1使用
```js
import React, { useState, useEffect } from 'react';
function Example() {
    // 声明一个叫 “count” 的 state 变量。将该值默认设置为1，只能通过setCount()来修改
    // 该方法里面传要修改的最终结果值
    const [count, setCount] = useState(1);
    useEffect(() => { // 类似于生命后期函数
        const number = setInterval(() => {
            setCount(count + 1)
        }, 1000)
        return () =>clearInterval(number) // 组件销毁时执行，清除定时器
    })
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}
```
以下代码实现了一个列表的增加和删除
```js
import React, {useState, useEffect} from 'react';

function Hooks(props) {
    const [fruits, setFruits] = useState(['apple', 'orange'])
    const [date, setDate] = useState(1);
    useEffect(() => {
        console.log('当date改变时候才会触发，因为useEffect第二个参数已经将其他的值改变过滤掉了')
        const time = setInterval(() => {
            setDate(date + 1)
        }, 1000)
        return () => clearInterval(time)
    }, [date]) // 当不想让其他值改变时触发useEffect,那么就将这个参数置为[]或者将想触发的值写在该数组中,如果没有这个参数，那么只要改变useState定义的值，都会触发useEffect
    return (
        <div>
            <FruiltsList fruits={fruits} onSetFruits={setFruits}></FruiltsList>
            <AddFruits fruits={fruits} onSetFruits={setFruits}></AddFruits>
            <p>{date}</p>
        </div>
    );
}

function FruiltsList({fruits, onSetFruits}) { // 函数组件此时就可以拿到props传递的值（包括传递的方法）
    function deleteFruit(index) {
        const temp = [...fruits]
        temp.splice(index, 1)
        onSetFruits(temp) // 修改fruits的值
    }
    return (
        <ul>
            {
                fruits.map((item, index) => {
                    return <li key={item+ index} onClick={() => deleteFruit(index)}>{item}</li>
                })
            }
        </ul>
    )
}

function AddFruits({fruits, onSetFruits}) {
    const [name, setName] = useState('')
    function addFruit() {
        onSetFruits([...fruits, name])
        setName('')
    }
    return (
        <div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
            <button onClick={() => addFruit()}>点击增加</button>
        </div>
    )
}

export default Hooks;
```
####8、2  useEffect 给函数组件增加了执⾏副作⽤操作的能⼒。
概念：副作⽤（Side Effect）是指⼀个 function 做了和本身运算返回值⽆
   关的事，⽐如：修改了全局变量、修改了传⼊的参数、甚⾄是
   console.log()，所以 ajax 操作，修改 dom 都是算作副作⽤  
解决方法：   1、设置依赖
```js
// 设置空数组意为没有依赖，则副作⽤操作仅执⾏⼀次
 useEffect(()=>{...}, [])

//如果副作⽤操作对某状态有依赖，务必添加依赖选项
useEffect(() => {
 ...
}, [count]);
```
2、清除工作：有一些副作用是需要清除的，清除工作可以防止内存泄漏
```js
// 组件卸载后会执行返回的清理函数
useEffect(() => {
 const timer = setInterval(() => {
 console.log('msg'); 
 }, 1000);
 
 return function(){
 clearInterval(timer);
 }
 }, [])
```
###9、useReducer的使用
作用：useReducer是useState的可选项，常用于组件有复杂状态逻辑时，类似于redux中reducer概念
```js
import React, {useReducer, useEffect} from 'react'; // 引入

function UseReducer(props) {

    return (
        <div>
            <FruiltsList></FruiltsList>
        </div>
    );
}

function reducer(state, action) { // 定义传入的reducer函数，用于修改数据
    switch (action.type) {
        case 'delete':
            console.log(state)
            return []
        case 'add':
            return ['apple']
    }
}

function FruiltsList() { // 函数组件此时就可以拿到props传递的值（包括传递的方法）
    const [fruits, dispatch] = useReducer(reducer, ['apple' , 'orange']) // 调用useReducer并为fruits设置初始值
    return (
        <ul>
            {
                fruits.map((item, index) => {
                    return <li key={item+ index} onClick={() => dispatch({type: 'delete', payload: index})}>{item}</li>
                })
            }
        </ul>
    )
}

export default UseReducer;

```
###10、useContext用于快速在函数组件中导入上下文
父组件
```js
import React from 'react';
import ContextChild from './contextChild'
export const Context = React.createContext(''); // 定义Context
function UseContextPage(props) {
    return (
        <div>
            <Context.Provider value={{name: '我是父组件传递过来的值'}}> // 传值 -》和context一样
                <ContextChild></ContextChild>
            </Context.Provider>
        </div>
    );
}

export default UseContextPage;
```
接收数据的组件
```js
import React, {useContext} from 'react';
import {Context} from './useContextPage' // 引入父组件中的context
function ContextChild(props) {
    const {name} = useContext(Context) // 此时即可拿到传递的值
    return (
       <div>
           <p>{name}</p>
       </div>
    );
}

export default ContextChild;

```
###11、实现表单组件
```js
import React, { Component } from "react";
import kFormCreate from "./kFormCreate";
const nameRules = { required: true, message: "please input your name!" };
const passwordRules = {
    required: true,
    message: "please input your password!",
};
class MyFormPage extends Component {
    handleSubmit = () => {
        const { getFieldValue } = this.props;
        const res = {
            name: getFieldValue("name"),
            password: getFieldValue("password"),
        };
        console.log("hah", res);
    };
    handleSubmit2 = () => {
        // 加⼊校验
        const { validateFields } = this.props;
        validateFields((err, values) => {
            if (err) {
                console.log("validateFields", err);
            } else {
                console.log("submit", values);
            }
        });
    };
    render() {
        const { getFieldDecorator } = this.props;
        return (
            <div>
                <h1>MyFormPage</h1>
                <div>
                    {getFieldDecorator("name", { rules: [nameRules] })(
                        <input type="text" />,
                    )}
                    {getFieldDecorator("password", [nameRules])(
                        <input type="password" />,
                    )}
                </div>
                <button onClick={this.handleSubmit2}>submit</button>
            </div>
        );
    }
}
export default kFormCreate(MyFormPage);
```
// 通过高阶组件形式完成数据的绑定和校验
```js
import React, {Component} from "react";

export default function kFormCreate(Cmp) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.options = {}; //各字段选项
            this.state = {}; //各字段值
        }
        handleChange = e => {
            let {name, value} = e.target;
            this.setState({[name]: value});
        };
        getFieldValue = field => {
            return this.state[field];
        };
        validateFields = callback => {
            const res = {...this.state};
            const err = [];
            for (let i in this.options) {
                if (res[i] === undefined) {
                    err.push({[i]: "error"});
                }
            }
            if (err.length > 0) {
                callback(err, res);
            } else {
                callback(undefined, res);
            }
        };
        getFieldDecorator = (field, option) => {
            this.options[field] = option;
            return InputCmp => (
                <div>
                    {// 由React.createElement⽣成的元素不能修改，需要克隆⼀份再扩展
                        React.cloneElement(InputCmp, {
                            name: field,
                            value: this.state[field] || "", //控件值
                            onChange: this.handleChange, //控件change事件处理
                        })}
                </div>
            );
        };

        render() {
            return (
                <div className="border">
                    <Cmp
                        {...this.props}
                        getFieldDecorator={this.getFieldDecorator}
                        getFieldValue={this.getFieldValue}
                        validateFields={this.validateFields}
                    />
                </div>
            );
        }
    };
}
```
###12、实现弹窗类组件
// 1、通过Portal(传送门)实现
// 调用Dialog组件
```js
import React, {Component} from 'react';
import {Button} from "antd";
import Dialog from "./dialog";
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }
    changeShow =()=>{
        this.setState({
            show: !this.state.show
        })
    }
    render() {
        const {show } = this.state
        return (
            <div>
                <Button onClick={this.changeShow}>弹框显示</Button>
                {
                    show && <Dialog></Dialog>
                }
            </div>
        );
    }
}

export default Index;
```
// 具体实现
```js
import React, {Component} from 'react';
import { createPortal } from "react-dom"; // 引入传送门
class Dialog extends Component {
    constructor(props) {
        super(props);
        const doc = window.document
        this.node = doc.createElement('div')
        this.node.setAttribute('class', 'name')
        doc.body.appendChild(this.node)
    }
    componentWillUnmount() { // 卸载时销毁
        const node = document.querySelectorAll('.name')
        console.log(node)
        for(const item of node) {
            window.document.body.removeChild(item);
        }
    }

    render() {
        return createPortal( // 在此处使用
            <div className={'dialog'} id={'dialog'}>
                1212312
            </div>,
            this.node,
        );
    }
}

export default Dialog;
```
###13、树形组件
```js
import React, {useState} from 'react';

function TreeNode(props) {
    const [expand, setExpand] = useState(false)
    const {title, children} = props.data
    function changeExpand() {
        setExpand(!expand)
    }
    return (
        <div>
            <div onClick={changeExpand}>
                <span>{children && children.length > 0 ? '+' : '-'}</span>
                <span>{title}</span>
            </div>
            {
                children && expand && children.length > 0 &&
                <div className="children">
                    {children.map(item => {
                        return <TreeNode key={item.key} data={item} />;
                    })}
                </div>
            }
        </div>
    );
}

export default TreeNode;

```


###14、组件常见优化技术 shouldComponent PureComponent memo  
shouldComponent 通过返回true/false来控制是否重新render
```js
import React, {Component} from 'react';

class ShouldCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1
        }
    }
    componentDidMount() {
        setInterval(() => {
            this.setState({ // 在传递给子组件的值setState之后，不管该值是否实际发生了变化，都会触发子组件的render
                count: 2
            })
        }, 1000)
    }

    render() {
        const {count} = this.state
        return (
            <div>
                <Demo count={count}></Demo>
            </div>
        );
    }
}
class Demo extends Component{
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.count !== nextProps.count // 如果返回的是false则不再触发render。true则重新渲染页面
    }

    render() {
        console.log(this.props.count) // 没有使用shouldComponentUpdate就会一直触发render
        return (
            <div>
                {this.props.count}
            </div>
        )
    }
}
export default ShouldCom;
```
PureComponent 用于类组件，只能用于浅比较
```js
import React, {Component, PureComponent} from 'react';

class PureCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1,
            obj: {
                a: 1
            }
        }
    }
    componentDidMount() {
        setInterval(() => {
            this.setState({ // 在传递给子组件的值setState之后，不管该值是否实际发生了变化，都会触发子组件的render
                count: 2,
                obj: {
                    a: 3
                }
            })
        }, 1000)
    }

    render() {
        const {count, obj} = this.state
        return (
            <div>
                <Demo count={count} obj={obj}></Demo>
            </div>
        );
    }
}
class Demo extends PureComponent{ // 使用PureComponent来创建组件则不会触发重复更新，但是只能用于浅比较,如果obj发生了变化，那么还是会触发render
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props.count)
        return (
            <div>
                {this.props.count}
                {this.props.obj.a}
            </div>
        )
    }
}


export default PureCom;
```
memo 用于函数组件，也只能进行浅比较
```js
import React, {Component, memo} from 'react';

class MomeCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1,
            obj: {
                a: 1
            }
        }
    }
    componentDidMount() {
        setInterval(() => {
            this.setState({ // 在传递给子组件的值setState之后，不管该值是否实际发生了变化，都会触发子组件的render
                count: 2
            })
        }, 1000)
    }

    render() {
        const {count} = this.state
        return (
            <div>
                <Demo count={count}></Demo>
            </div>
        );
    }
}

const Demo = memo((props) => { // 函数组件没有生命周期,props值改变就会一直触发更新,
    console.log(props)
    return (
        <div>{props.count}</div>
    )
})
export default MomeCom;

```
###15、redux基本使用  npm install redux --save
1、通过createStore创建store  
2、reducer初始化，修改状态函数  
3、getState获取状态值  
4、dispatch提交更新  
5、subscribe变更订阅  
store.js
```js
import { createStore } from "redux"; // 引入createStore
function counterRedcuer(state = 0, action) { // 创建reducer
    switch (action.type) {
        case "add":
            return state + 1;
        case "minus":
            return state - 1;
        default:
            return state;
    }
}
const store = createStore(counterRedcuer); // 通过createStore(counterRedcuer)创建store
export default store;
```
reduxPage
```js
import React, {Component} from 'react';
import store from "../../store/ReduxStore"; // 引入store
class ReduxPage extends Component {
    componentDidMount() {
        store.subscribe(() => { // 订阅
            this.forceUpdate() // 手动触发render
        })
    }

    render() {
        console.log('store', store)
        return (
            <div>
                <h1>reduxPage</h1>
                {store.getState()} // 获取定义的值
                // 调用reducer中定义的方法修改state
                <button onClick={() => store.dispatch({type: 'add'})}>+</button>
                <button onClick={() => store.dispatch({type: 'mines'})}>-</button>
            </div>
        );
    }
}

export default ReduxPage;
```
###16、react-redux的基本使用 npm install react-redux --save
异步修改数据需要安装这两个依赖npm install redux-thunk redux-logger --save  
index.js
```js
import App from './App';
import store from "./store/reactReduxStore";
import {Provider} from 'react-redux';
// 用provider包裹并传入store
      <Provider store={store}>
          <App />
      </Provider>
```
store
```js
import {createStore, applyMiddleware} from "redux"; // applyMiddleware为中间件，为了实现异步修改数据
import logger from 'redux-logger'
import thunk from 'redux-thunk'
const counterReducer = (state = 0, action) =>{
    switch (action.type) {
        case 'add':
            return state + 1
        case 'mines':
            return state - 1
        default:
            return state
    }
}
const store = createStore(counterReducer, applyMiddleware(logger, thunk))
export default store;
```
使用的地方reactReduxPage
```js
import React, {Component} from 'react';
import {connect} from 'react-redux'

class ReactReduxPage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props)
        const {num, add, mines, asyAdd} = this.props
        return (
            <div>
                <h1>reactReduxPage</h1>
                <span>{num}</span>
                <button onClick={() => add()}>+</button>
                <button onClick={() => mines()}>-</button>
                <button onClick={() => asyAdd()}>异步加</button>
            </div>
        );
    }
}
// 数据映射到props中
const mapStateToProps = state => {
    return {
        num: state
    }
}
// 方法映射到props中
const mapDispatchToProps = {
    add: () => {
        return {type: 'add'}
    },
    mines: () => {
        return {type: 'mines'}
    },
    asyAdd: () => dispatch => { // 异步修改数据
        setTimeout(() => {
            dispatch({type: 'add'})
        }, 1000)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ReactReduxPage);

```
#17、实现redux
```js
export function createStore(reducer) {
    let currentValue = undefined // 返回值
    let currentListen = [] // 存放回调事件
    const getState = function () {
        return currentValue
    }
    const subscribe = function (listen) {
        currentListen.push(listen) // 将回调函数存起来
    }
    const dispatch = function (action) {
        currentValue = reducer(currentValue, action)
        currentListen.forEach(v => v()) // 执行存放的回调函数
    }
    dispatch({type: '执行switch中的default'}) 
    return {
        getState,
        subscribe,
        dispatch
    }
}
```










