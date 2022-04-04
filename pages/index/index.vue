<template>
	<view style="display: flex;flex-direction: column;">
		<view style="margin-top: 20rpx;">
			<LuckyWheel ref="myLucky" width="600rpx" height="600rpx" :blocks="blocks" :prizes="prizes"
				:buttons="buttons" :defaultStyle="{defaultStyle:[{gutter: 2}]}" @start="startCallBack" @end="endCallBack" />
		</view>
		<text style="align-self: center;margin-top: 20rpx;" :results="results">{{results}}</text>
		<!-- #ifdef MP-ALIPAY -->
		<button type="primary" size="default" open-type="getAuthorize" scope="userInfo" @getAuthorize="onGetAuthorize"
			@error="onAuthError">一键加入</button>
		<!-- #endif -->
	</view>

</template>

<script>
	import LuckyWheel from '@lucky-canvas/uni/lucky-wheel'
	export default {
		components: {
			LuckyWheel
		},
		data() {
			return {
				results: '咖啡乞丐，在线乞讨ing',
				blocks: [{
					padding: '13px',
					background: '#869cfa'
				}],
				prizes: [{
						background: '#e9e8fe',
						fonts: [{
							text: "徐汇许广汉",
							fontSize: 1
						}],
						imgs: [{
							src: 'https://s4.ax1x.com/2022/02/20/Hqo4Zn.jpg',
							width: '40%',
							top: '10%'
						}]
					},
					{
						background: '#b8c5f2',
						fonts: [{
							text: "Android女爷爷",
							fontSize: 1
						}],
						imgs: [{
							src: 'https://s4.ax1x.com/2022/02/20/Hqofqs.jpg',
							width: '40%',
							top: '10%'
						}]
					},
					{
						background: '#e9e8fe',
						fonts: [{
							text: "yuanxi",
							fontSize: 1
						}],
						imgs: [{
							src: 'https://s4.ax1x.com/2022/02/20/HqoWrj.jpg',
							width: '40%',
							top: '10%'
						}]
					},
					{
						background: '#b8c5f2',
						fonts: [{
							text: "老鹤",
							fontSize: 1
						}],
						imgs: [{
							src: 'https://s4.ax1x.com/2022/02/20/HqoRMQ.jpg',
							width: '40%',
							top: '10%'
						}]
					},
					{
						background: '#e9e8fe',
						fonts: [{
							text: "老法",
							fontSize: 1
						}],
						imgs: [{
							src: 'https://s4.ax1x.com/2022/02/20/Hqogxg.jpg',
							width: '40%',
							top: '10%'
						}]
					},
					{
						background: '#b8c5f2',
						fonts: [{
							text: "地表最强高专",
							fontSize: 1
						}],
						imgs: [{
							src: 'https://s4.ax1x.com/2022/02/20/HqocRS.jpg',
							width: '40%',
							top: '10%'
						}]
					},
				],
				buttons: [{
					radius: '30%',
					imgs: [{
						src: 'https://cdn.jsdelivr.net/gh/buuing/cdn/demo/wheel-btn.png',
						width: '100%',
						top: '-130%'
					}]
				}],
			}
		},
		methods: {
			// 点击抽奖按钮触发回调
			startCallBack() {
				// 先开始旋转
				this.$refs.myLucky.play()
				// 使用定时器来模拟请求接口, 后端服务还没写好
				// uni.request({
				//     url: 'https://www.example.com/request', //仅为示例，并非真实接口地址。
				//     data: {
				//         text: 'uni.request'
				//     },
				//     header: {
				//         'custom-header': 'hello' //自定义请求头信息
				//     },
				//     success: (res) => {
				//         console.log(res.data);
				//         this.text = 'request success';
				//     }
				// });
				setTimeout(() => {
					// 假设后端返回的中奖索引是0
					const index = 0
					// 调用stop停止旋转并传递中奖索引
					this.$refs.myLucky.stop(index)
				}, 3000)
			},
			// 抽奖结束触发回调
			endCallBack(prize) {
				// 奖品详情
				this.results = prize.fonts[0].text
			},
			onGetAuthorize() {
				my.getOpenUserInfo({
					fail: res => {
						console.log(res);
					},
					success: res => {
						const userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
						var lens = this.prizes.length;
						var newUser = {
							background: Math.round(lens/2)==0 ? '#b8c5f2':'#e9e8fe',
							fonts: [{
								text: userInfo.nickName,
								fontSize: 1
							}],
							imgs: [{
								src: userInfo.avatar,
								width: '40%',
								top: '10%'
							}]
						};
						var users = []
						this.prizes.map(item => users.push(item.fonts[0].text))
						if (users.indexOf(newUser.fonts[0].text) === -1) {
							this.prizes = this.prizes.concat(newUser);
						}
					},
				});
			},
			// 授权失败回调
			onAuthError() {
				uni.showToast({
					title: "授权失败回调"
				});
			}
		}
	}
</script>
