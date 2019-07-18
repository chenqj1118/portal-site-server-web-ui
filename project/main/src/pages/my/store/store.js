import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{
        blockState:localStorage.getItem('blockState') ? localStorage.getItem('blockState') : ''
    },
    mutations:{
        /* 修改状态 */
        changeState:(state,value)=> {
            state.blockState = value
            localStorage.setItem('blockState', value);
        }
    }
})