<template>
	<view style="display: flex;flex-direction: column;">
		<view style="margin-top: 20rpx;">
			<LuckyWheel ref="myLucky" width="600rpx" height="600rpx" :blocks="blocks" :prizes="prizes"
				:buttons="buttons" :defaultStyle="{defaultStyle:[{gutter: 2}]}" @start="startCallBack"
				@end="endCallBack" />
		</view>
		<text style="align-self: center;margin-top: 20rpx;" :results="results">{{results}}</text>
		<!-- #ifdef MP-ALIPAY -->
		<button style="align-self: center;margin-top: 20rpx;" type="primary" size="default"
			@click="createGame">一键开团</button>
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
				gameId: '',
				userInfo: {},
				blocks: [{
					padding: '13px',
					background: '#869cfa'
				}],
				prizes: [],
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
		mounted() {
			this.onGetAuthorize();
		},
		methods: {
			createGame() {
				uni.request({
					method: 'POST',
					url: 'https://www.faultaddr.com/POST/game/createGame', //仅为示例，并非真实接口地址。
					data: {
						avatar: this.userInfo.avatar,
						city: this.userInfo.city,
						countryCode: this.userInfo.countryCode,
						gender: this.userInfo.gender,
						nickName: this.userInfo.nickName,
						province: this.userInfo.province
					},
					dataType: 'json',
					success: (res) => {
						// 创建成功后建立websocket 通道，时刻sync 转盘的result 到服务端，其他用户通过服务端下发的result来进行转动
						console.log(res.data);
						this.gameId = res.data.message;
						this.text = 'request success';
					}
				});

			},
			// 点击抽奖按钮触发回调
			startCallBack() {
				// 先开始旋转
				this.$refs.myLucky.play()
				// 使用定时器来模拟请求接口, 后端服务还没写好
				console.log(this.gameId);
				if (this.gameId !== '') {
					uni.request({
						url: 'https://www.faultaddr.com/GET/game/startGame', //仅为示例，并非真实接口地址。
						data: {
							gameId: this.gameId
						},
						success: (res) => {
							console.log(res.data);
							for (var i = 0; i < this.prizes.length; i++) {
								if(this.prizes[i].imgs===undefined){
									continue;
								}
								if (res.data.message.startsWith("http")  && this.prizes[i]
									.imgs[0].src === res
									.data.message) {
									this.$refs.myLucky.stop(i);
								}
							}
							this.text = 'request success';
						}
					});
				}
			},
			// 抽奖结束触发回调
			endCallBack(prize) {
				// 奖品详情
				if (prize.fonts !== undefined) {
					this.results = prize.fonts[0].text
				}
			},
			onGetAuthorize() {
				my.getOpenUserInfo({
					fail: res => {
						console.log(res);
					},
					success: res => {
						const userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
						var lens = this.prizes.length;
						my.alert({
							content: userInfo
						})
						this.userInfo.avatar = userInfo.avatar;
						this.userInfo.city = userInfo.city;
						this.userInfo.countryCode = userInfo.countryCode;
						this.userInfo.gender = userInfo.gender;
						this.userInfo.nickName = userInfo.nickName;
						this.userInfo.province = userInfo.province;
						my.alert({
							content: this.userInfo
						})
						var newUser = {
							background: Math.round(lens / 2) == 0 ? '#b8c5f2' : '#e9e8fe',
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
						var realParticipant = []
						this.prizes.map(item => {
							if (item.fonts !== undefined) {
								users.push(item.fonts[0].text)
								realParticipant.push(item);
								realParticipant.push({});
							}
						})
						if (users.indexOf(newUser.fonts[0].text) === -1) {
							this.prizes = [...realParticipant, newUser, {}, {}]
							this.$refs.myLucky.init();
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
