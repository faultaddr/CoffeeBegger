<template>
	<view class="u-demo-block">
		<view style="margin-top: 20rpx;">
			<!-- 			<swiper :indicator-dots="true" class="swiper">
				<swiper-item> -->
			<u-search placeholder="输入要搜索的小程序" v-model="keyword" :clearabled="true" inputAlign="center" height="30" :animation="true" @search="searchStore"></u-search>
			<view style="margin-top: 40rpx;">
				<u-grid :border="false">
					<u-grid-item v-for="(item, index) in srcList" :index="index" :key="index" @click="itemOnClick(index)">
						<u-avatar :src="srcList[index]"></u-avatar>
						<text class="grid-text">{{ textList[index] }}</text>
					</u-grid-item>
				</u-grid>
			</view>
			<u-empty :mode="mode" :icon="imgList[mode]" :show="showSearchEmptyResult">
				<u-button size="small" type="primary" :style="{ marginTop: 10 + 'px' }" v-if="mode == 'car'" text="查看更多小程序"></u-button>
			</u-empty>
			<!-- 				</swiper-item> -->
			<!-- 				<swiper-item>
					<u-grid :border="true">
						<u-grid-item v-for="(item, index) in swiperList" :index="index + 9" :key="index">
							<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="item" :size="22"></u-icon>
							<text class="grid-text">{{ '宫格' + (index + 1) }}</text>
						</u-grid-item>
					</u-grid>
				</swiper-item>
				<swiper-item>
					<u-grid :border="true">
						<u-grid-item v-for="(item, index) in swiperList" :index="index + 18" :key="index">
							<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="item" :size="22"></u-icon>
							<text class="grid-text">{{ "宫格" + (index + 1) }}</text>
						</u-grid-item>
					</u-grid>
				</swiper-item> -->
			<!-- 			</swiper> -->
		</view>
	</view>
</template>

<script>
export default {
	data() {
		const baseUrl = 'http://cdn.uviewui.com/uview/empty/';
		return {
			mode: 'search',
			showSearchEmptyResult: false,
			srcList: [
				'https://s1.ax1x.com/2022/04/16/LYOiPP.jpg',
				'https://s1.ax1x.com/2022/04/16/LYOC5t.png',
				'https://s1.ax1x.com/2022/04/16/LYO9UI.png',
				'https://s1.ax1x.com/2022/04/16/LYOpVA.png',
				'https://s1.ax1x.com/2022/04/16/LYLzbd.png'
			],
			textList: ['Luckin', 'Starbucks', 'Tims', 'Manner', 'Peets'],
			imgList: {
				car: baseUrl + 'car.png',
				address: baseUrl + 'address.png',
				comment: baseUrl + 'comment.png',
				coupon: baseUrl + 'coupon.png',
				data: baseUrl + 'data.png',
				history: baseUrl + 'history.png',
				list: baseUrl + 'list.png',
				message: baseUrl + 'message.png',
				news: baseUrl + 'news.png',
				order: baseUrl + 'order.png',
				page: baseUrl + 'page.png',
				permission: baseUrl + 'permission.png',
				search: baseUrl + 'search.png',
				wifi: baseUrl + 'wifi.png'
			}
		};
	},
	methods: {
		itemOnClick(index) {
			console.log(this.textList[index]);
			switch (index) {
				case 0:
					uni.navigateToMiniProgram({
						appId: '2019072966003221',
						success(res) {
							// 打开成功
							console.log('跳转成功');
						},
						fail(res) {
							console.log('跳转失败' + res.data);
						}
					});
					break;
				case 1:
					uni.navigateToMiniProgram({
						appId: '2021001151658126',
						success(res) {
							// 打开成功
							console.log('跳转成功');
						},
						fail(res) {
							console.log('跳转失败' + res.data);
						}
					});
					break;
				case 2:
					uni.navigateToMiniProgram({
						appId: '2019102868696469',
						success(res) {
							// 打开成功
							console.log('跳转成功');
						},
						fail(res) {
							console.log('跳转失败' + res.data);
						}
					});
					break;
				case 3:
					uni.navigateToMiniProgram({
						appId: '2019102868696469',
						success(res) {
							// 打开成功
							console.log('跳转成功');
						},
						fail(res) {
							console.log('跳转失败' + res.data);
						}
					});
					break;
			}
		},
		searchStore(value) {
			this.showSearchEmptyResult = false;
			console.log(value);
			if (this.textList.indexOf(value) === -1) {
				this.showSearchEmptyResult = true;
			}
		}
	}
};
</script>

<style lang="scss">
.swiper {
	height: 220px;
}

.grid-text {
	font-size: 14px;
	color: #909399;
	padding: 10rpx 0 20rpx 0rpx;
	/* #ifndef APP-PLUS */
	box-sizing: border-box;
	/* #endif */
}
</style>
