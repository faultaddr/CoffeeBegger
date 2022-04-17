<template>
	<view>
		<view style="display: flex;flex-direction: column;">
			<u-notify ref="uNotify" message="当前轮盘人数少于三人,无法进行"></u-notify>
			<view style="margin-top: 20rpx;">
				<LuckyWheel ref="myLucky" width="600rpx" height="600rpx" :blocks="blocks" :prizes="prizes"
					:buttons="buttons" @start="startCallBack" @end="endCallBack" />
			</view>
			<text style="align-self: center;margin-top: 20rpx;" :results="results">{{results}}</text>
			<!-- #ifdef MP-ALIPAY -->
			<button ref="createBtn" style="margin-top: 10px; width: 100px;align-self:center" type="primary"
				@click="createGame">一键开团</button>
			<!-- #endif -->

		</view>
		<view>
			<u-popup :mode="popupData.mode" :show="authShow" :round="popupData.round" :overlay="popupData.overlay"
				:borderRadius="popupData.borderRadius" :closeable="popupData.closeable"
				:closeOnClickOverlay="popupData.closeOnClickOverlay" @close="authClose" @open="authOpen">
				<view style="display: flex;flex-direction: column;padding: 20rpx;">
					<u-alert customStyle="align-self: flex-start;" :title="authTitle" type="warning"
						:closable="alertClosable" :description="description"></u-alert>
					<view style="align-self:center;display: flex;flex-direction: row;align-items: center;">
						<button style="margin-top: 20px; width: 100px;align-self: center" type="warn"
							open-type="getAuthorize" @getAuthorize="onGetAuthorize" @error="onAuthError"
							scope='userInfo'>点击授权</button>
					</view>
				</view>
			</u-popup>
		</view>

		<view>
			<u-popup :mode="popupData.mode" :show="show" :round="popupData.round" :overlay="popupData.overlay"
				:borderRadius="popupData.borderRadius" :closeable="popupData.closeable"
				:closeOnClickOverlay="popupData.closeOnClickOverlay" @close="close" @open="open">
				<view style="display: flex;flex-direction: column;padding: 20rpx;">
					<u-alert customStyle="align-self: flex-start;" :title="alertTitle" type="warning"
						:closable="alertClosable" :description="description"></u-alert>
					<view style="margin-top: 10px;">
						<u-code-input v-model="value" :maxlength="6" :focus="true" @change="change" @finish="finish">
						</u-code-input>
					</view>
					<view style="align-self:center;display: flex;flex-direction: row;align-items: center;">
						<button style="margin-top: 20px; width: 100px;align-self: center" type="primary"
							@click="getCodeAndJoinGame">加入</button>
						<u-loading-icon customStyle="align-self: center;margin-top:20px;" text="加入中"
							:show="displayLoading"></u-loading-icon>
					</view>
				</view>
			</u-popup>
		</view>
		<view style="margin: 20rpx;">
			<u-text type="success" text="玩法介绍"></u-text>
			<u-text style="margin-left: 10rpx;" size="12" type="info" lines="5"
				text="如果你想要发起咖啡轮盘请客，请首先点击一键开团，然后点击右上角三个点分享给伙伴，让伙伴们通过链接或者邀请码进入。随后由开团者点击Go，其他人可以各自在手机上同步围观，最终抽中的人会跳转到咖啡页面，请乞丐们喝咖啡！">
			</u-text>
		</view>
		<view>
			<u-modal style="align-self: center;"title="快去分享给朋友吧" :show="showShareWindow" closeOnClickOverlay
				showCancelButton>
				<button slot="confirmButton" type="primary" shape="circle" open-type="share" @click="confirmShare">
					确定
				</button>
			</u-modal>
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
				// showing
				displayLoading: false,
				showShareWindow: false,
				invitationCode: "",
				invitationMessage: "",
				authShow: true,
				authTitle: "获取当前用户信息",
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
				buttons: [{
					radius: '30%',
					imgs: [{
						src: 'https://cdn.jsdelivr.net/gh/buuing/cdn/demo/wheel-btn.png',
						width: '100%',
						top: '-130%'
					}]
				}],
				blocks: [{
					padding: '13px',
					background: '#869cfa'
				}],
				// logic
				show: false,
				results: '咖啡乞丐，在线乞讨ing',
				isCreater: true,
				gameId: '',
				userInfo: {},
				socketTask: {},
				prizes: [],
				timeoutObj: null,
				timeout: 30000
			}

		},
		mounted() {
			uni.$u.mpShare.title = '咖啡乞丐，在线乞讨';
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			console.log(this.invitationCode);
			return {
				title: '邀请码为 ' + this.invitationCode + " 咖啡乞丐，在线乞讨",
				path: '/pages/index/index'
			}
		},
		methods: {
			change(e) {
				this.alertTitle = "请输入邀请码",
					this.invitationCode = e;
			},
			finish(e) {
				this.invitationCode = e;
			},
			open() {
				console.log("弹窗open")
			},
			authOpen() {
				console.log("授权弹窗open");
			},
			close() {
				this.show = false;
			},
			authClose() {
				this.authShow = false;
				this.show = true;
			},
			getCodeAndJoinGame() {
				if (this.invitationCode.length === 6) {
					this.joinGame();
					this.isCreater = false;
				} else {
					this.alertTitle = "邀请码不合法，请重新输入";
				}
			},
			confirmShare() {
				// 目前只有企业支付宝账户能用
				// uni.setClipboardData({
				// 	data: this.invitationMessage,
				// 	success: function() {
				// 		console.log('success');
				// 	},
				// 	showToast: true
				// });
				this.showShareWindow = false;
			},
			//-----------websocket------------
			// 判断是否已连接
			checkOpenSocket() {
				uni.sendSocketMessage({
					data: 'ping',
					success: res => {
						return;
					},
					fail: err => {
						// 未连接打开websocket连接
						this.openConnection();
					}
				});
			},
			openConnection() {
				// 打开连接
				// uni.closeSocket(); // 确保已经关闭后再重新打开
				uni.connectSocket({
					url: "ws://47.116.14.84:8080/message_websocket?userId=" + this.userInfo.avatar,
					success(res) {
						console.log('连接成功 connectSocket=', res);
					},
					fail(err) {
						console.log('连接失败 connectSocket=', err);
					}
				});
				uni.onSocketOpen(res => {
					console.log('连接成功');
				});
				this.onSocketMessage(); // 打开成功监听服务器返回的消息
			},
			//	打开成功监听服务器返回的消息
			onSocketMessage() {
				// 消息
				this.timeout = 30000;
				this.timeoutObj = null;
				uni.onSocketMessage(res => {
					console.log(res)
					this.getSocketMsg(res.data); // 监听到有新服务器消息
				});
			},
			// 监听到有新服务器消息
			getSocketMsg(reData) {
				// 监听到服务器消息
				console.log('收到服务器消息', reData);
				var data = JSON.parse(reData.data);
				stopAtIndex(data.message);
				this.reset(); // 检测心跳reset,防止长时间连接导致连接关闭
			},
			// 检测心跳reset
			reset() {
				clearInterval(this.timeoutObj);
				this.start(); // 启动心跳
			},
			// 启动心跳 start
			start() {
				this.timeoutObj = setInterval(function() {
					uni.sendSocketMessage({
						data: 'ping',
						success: res => {
							console.log('连接中....');
						},
						fail: err => {
							console.log('连接失败重新连接....');
							this.openConnection();
						}
					});
				}, this.timeout);
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
						this.invitationCode = res.data.data.invitationCode;
						this.invitationMessage = "本次邀请码为:" + this.invitationCode + " ,快去召集乞丐吧";
						this.gameId = res.data.data.gameId;
						this.showShareWindow = true;
						this.text = 'request success';
					}
				});
			},
			joinGame() {
				this.checkOpenSocket();
				var requestData = {
					id: this.invitationCode,
					avatar: this.userInfo.avatar,
					city: this.userInfo.city,
					countryCode: this.userInfo.countryCode,
					gender: this.userInfo.gender,
					nickName: this.userInfo.nickName,
					province: this.userInfo.province
				};
				console.log(requestData);
				uni.request({
					method: 'POST',
					url: 'https://www.faultaddr.com/POST/game/joinGame',
					data: requestData,
					dataType: 'json',
					success: (res) => {
						// TODO: get the participant and add
						this.show = false;
						this.displayLoading = false;
						var data = JSON.parse(res.data.message);
						this.gameId = data.gameId;
						console.log(res.data);
					}
				});
			},
			// -----------抽奖相关-----------
			// 点击抽奖按钮触发回调
			startCallBack() {
				// 先判断目前的开团人数，如果不超过3人不开团
				var realPeople = this.prizes.filter(item => {
					Object.keys(item).length !== 0
				});
				// if (realPeople.length < 3) {
				// 	this.$refs.uNotify.show({
				// 		top: 0,
				// 		type: 'error',
				// 		color: '#000',
				// 		bgColor: '#9acafc',
				// 		message: '当前人数少于三人，无法进行，快去召集伙伴吧',
				// 		duration: 1000 * 3,
				// 		fontSize: 10,
				// 		safeAreaInsetTop: false
				// 	});
				// 	return;
				// }
				console.log("当前轮盘中：" + realPeople.length);
				// 先开始旋转
				this.$refs.myLucky.play()
				// 使用定时器来模拟请求接口, 后端服务还没写好
				console.log(this.gameId);
				if (this.gameId !== '' && this.isCreater === true) {
					uni.request({
						url: 'https://www.faultaddr.com/GET/game/startGame', //仅为示例，并非真实接口地址。
						data: {
							gameId: this.gameId
						},
						success: (res) => {
							console.log(res.data);
							this.stopAtIndex(res.data.message);

						}
					});
				}
			},
			stopAtIndex(avatar) {
				for (var i = 0; i < this.prizes.length; i++) {
					if (this.prizes[i].imgs === undefined) {
						continue;
					}
					if (avatar.startsWith("http") && this.prizes[i]
						.imgs[0].src === avatar) {
						this.selectedAvatar = avatar;
						this.$refs.myLucky.stop(i);
						setTimeout(() => {
							// 假设后端返回的中奖索引是0
							uni.navigateTo({
								url: "coffeestore/coffeestore"
							})
						}, 8000)
					}
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
			getAuthCode() {
				my.getAuthCode({
					scopes: 'auth_user',
					success: (res) => {
						this.userInfo.userId = res.authCode;
					},
				});
			},
			onGetAuthorize() {
				this.authShow = false;
				my.getOpenUserInfo({
					fail: res => {
						console.log("getOpenUserInfo failed")
						console.log(res);
					},
					success: res => {
						const userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
						console.log("success" + JSON.stringify(userInfo));
						var lens = this.prizes.length;
						if (userInfo.avatar === undefined) {
							userInfo.avatar = "https://s1.ax1x.com/2022/04/17/LUuAQf.jpg";
						}
						if (userInfo.nickName === undefined) {
							userInfo.nickName = "未知朋友，可能来自外太空，请FBI double check";
						}
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
								width: '30%',
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
			onAuthError(e) {
				uni.showToast({
					title: "授权失败回调"
				});
				console.log(e);
			}
		}
	}
</script>
