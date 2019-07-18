<template>
  <div id="login">
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="登录" name="first">
          <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" class="loginForm">
            <el-form-item prop="username">
              <el-input type="text" v-model="loginForm.username"
                        prefix-icon="el-icon-user-solid"
                        autocomplete="off" placeholder="用户名/手机号" class="el-input"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="loginForm.password"
                        prefix-icon="el-icon-lock"
                        autocomplete="off" placeholder="输入密码" class="el-input"></el-input>
            </el-form-item>
            <el-form-item v-if="logintimes > 2" prop="verifycode">
              <el-input type="text" v-model="loginForm.verifycode" autocomplete="off" placeholder="输入验证码" class="el-input verifycode"></el-input>
              <slot>
                <div class="vcimgbox">
                  <img :src="vcodeimg" class="vcimg">
                  <span class="vctips">看不清<br><a href="javascript:void(0)" @click="changevcimg">换一张</a></span>
                </div>
              </slot>
            </el-form-item>
            <el-form-item>
              <a href="./service.html"><el-button type="primary" class="loginbtn">登录</el-button></a>
            </el-form-item>
            <el-form-item class="loginElse">
              <p class="title">其他方式登录</p>
              <el-row :gutter="20">
                <el-col :span="8">
                  <i class="fa fa-weixin fa-lg" aria-hidden="true"></i>
                  <p>微信</p>
                </el-col>
                <el-col :span="8">
                  <i class="fa fa-weibo fa-lg" aria-hidden="true"></i>
                  <p>微博</p>
                </el-col>
                <el-col :span="8">
                  <i class="fa fa-qq fa-lg" aria-hidden="true"></i>
                  <p>QQ</p>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="second">
          <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" class="loginForm">
            <el-form-item prop="username">
              <el-input type="text" v-model="loginForm.username"
                        prefix-icon="el-icon-user-solid"
                        autocomplete="off" placeholder="用户名/手机号" class="el-input"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="loginForm.password"
                        prefix-icon="el-icon-lock"
                        autocomplete="off" placeholder="输入密码" class="el-input"></el-input>
            </el-form-item>
            <el-form-item v-if="logintimes > 2" prop="verifycode">
              <el-input type="text" v-model="loginForm.verifycode" autocomplete="off" placeholder="输入验证码" class="el-input verifycode"></el-input>
              <slot>
                <div class="vcimgbox">
                  <img :src="vcodeimg" class="vcimg">
                  <span class="vctips">看不清<br><a href="javascript:void(0)" @click="changevcimg">换一张</a></span>
                </div>
              </slot>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('loginForm')" class="loginbtn">登录</el-button>
            </el-form-item>
            <el-form-item class="loginElse">
              <p class="title">其他方式登录</p>
              <el-row :gutter="20">
                <el-col :span="8">
                  <i class="fa fa-weixin fa-lg" aria-hidden="true"></i>
                  <p>微信</p>
                </el-col>
                <el-col :span="8">
                  <i class="fa fa-weibo fa-lg" aria-hidden="true"></i>
                  <p>微博</p>
                </el-col>
                <el-col :span="8">
                  <i class="fa fa-qq fa-lg" aria-hidden="true"></i>
                  <p>QQ</p>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <div class="login-bottom">
      <p><span>Copyright 2019-2020</span> <span>版权所有：宁夏银川市冷链行业管理协会</span></p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import { Message } from 'element-ui';
  export default {
    name:'login',
    template:'#login',
    data() {
          var validateVCode = (rule, value, callback) => {
            if(logintimes > 2){
				if (value === '') {
				  callback(new Error('请输入用户名'));
				} else {
				  callback();
				}
			}else{
				callback();
			}
          };
          return {
            activeName: 'first',
            loginForm: {
              username: '',
              password: '',
			  verifycode: ''
            },//需要有登陆次数进行惰性v-if判断显示
			vcodeimg: "./static/assets/vcode.jpg",
			logintimes: 3,
            rules: {
              username: [
                 { required: true, message: '请输入用户名', trigger: 'blur' }
              ],
              password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                 { min: 6, max: 16, message: '长度在6 到16 个字符', trigger: 'blur' }
              ],
              verifycode:[
                { required: true, message: '请输入验证码', trigger: 'blur' },
				{ min: 4, max: 4, message: '长度须为4个字符', trigger: 'blur' }
              ]
            }
          };
    },
    methods: {
	  changevcimg(){
		this.vcodeimg = "/estore/member_login_pic_captcha.action?random="+Math.random();
	  },
      submitForm(formName) {
		var vm = this,
			validateArr = ["username","password"];
		if(this.logintimes > 2){
			validateArr = ["username","password","verifycode"];
		}
        this.$refs[formName].validate((valid) => {
          if(valid){
			/*axios.post('/estore/member_login.action',
			{
				MEMBER_ACCOUNT: vm.loginForm.username,
				MEMBER_PASSWORD: vm.loginForm.password,
				MEMBER_PIC_CAPTCHA: vm.loginForm.verifycode,
				MEMBER_PIC_CAPTCHA_SCENE: "MEMBER_LOGIN",
				MEMBER_LOGIN_NEED_CAPTCHA: "TRUE"
			}).then(function (response) {
				if(response.data.success == true){
					Message.success({
						message: "登录成功！欢迎您!",
					});
					console.log(response);
					//sessionStorage.setItem("username", response.data.username);
					//console.log(sessionStorage.getItem("username"));//可用于前台显示登录状态；
				}else{
					Message.info({
						message: response.data.message,
					});
				}
			}).catch(function (error) {
				Message.info({
					message: error.response.data.message,
				});
			});*/
          }else{
            console.log('验证未通过！');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>