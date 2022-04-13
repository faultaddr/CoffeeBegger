<template>
	<view>
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
		<view>
			<u-popup :mode="popupData.mode" :show="show" :round="popupData.round" :overlay="popupData.overlay"
				:borderRadius="popupData.borderRadius" :closeable="popupData.closeable"
				:closeOnClickOverlay="popupData.closeOnClickOverlay" @close="close" @open="open">
				<view style="display: flex;flex-direction: column">
					<u-alert customStyle="align-self: flex-start;" :title="alertTitle" type="warning"
						:closable="alertClosable" :description="description"></u-alert>
					<view style="margin-top: 10px;">
						<u-code-input v-model="value" :maxlength="6" :focus="true" @change="change" @finish="finish">
						</u-code-input>
					</view>
					<u-button customStyle="margin-top: 10px; width: 100px;align-self:center" type="primary" text="加入"
						@click="getCodeAndJoinGame"></u-button>
				</view>
			</u-popup>
		</view>
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
				invitationCode: "",
				alertTitle: "请输入邀请码",
				description: "如果您是发起人请直接关闭此窗口",
				popupData: {
					overlay: true,
					mode: 'center',
					round: 10,
					closeOnClickOverlay: true,
					safeAreaInsetBottom: false,
					safeAreaInsetTop: false,
					closeable: true,
				},
				title: '居中弹出',
				iconUrl: 'https://cdn.uviewui.com/uview/demo/popup/modeCenter.png',
				show: true,
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
			change(e) {
				this.alertTitle = "请输入邀请码",
					this.invitationCode = e;
			},
			finish(e) {
				this.invitationCode = e;
			},
			close() {
				this.show = false;
			},
			getCodeAndJoinGame() {
				if (this.invitationCode.length === 6) {
					this.joinGame();
				} else {
					this.alertTitle = "邀请码不合法，请重新输入";
				}
			},
			//-----------后端交互-----------
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
			joinGame() {
				uni.request({
					method: 'POST',
					url: 'https://www.faultaddr.com/POST/game/joinGame', //仅为示例，并非真实接口地址。
					data: {
						invitationCode: this.invitationCode,
						avatar: this.userInfo.avatar,
						city: this.userInfo.city,
						countryCode: this.userInfo.countryCode,
						gender: this.userInfo.gender,
						nickName: this.userInfo.nickName,
						province: this.userInfo.province
					},
					dataType: 'json',
					success: (res) => {
						// TODO: get the participant and add
					}
				});
			},
			// -----------抽奖相关-----------
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
								if (this.prizes[i].imgs === undefined) {
									continue;
								}
								if (res.data.message.startsWith("http") && this.prizes[i]
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
					this.results = "恭喜你，" + prize.fonts[0].text + ", 今天轮到你当值，快去召唤乞丐们吧！"
				}
			},

			// -----------支付宝授权相关-----------
			onGetAuthorize() {
				my.getOpenUserInfo({
					fail: res => {
						console.log(res);
					},
					success: res => {
						const userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
						var lens = this.prizes.length;
						this.userInfo.avatar = userInfo.avatar;
						this.userInfo.city = userInfo.city;
						this.userInfo.countryCode = userInfo.countryCode;
						this.userInfo.gender = userInfo.gender;
						this.userInfo.nickName = userInfo.nickName;
						this.userInfo.province = userInfo.province;
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
