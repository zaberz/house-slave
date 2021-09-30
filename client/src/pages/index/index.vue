<template>
	<view class="page">
    <view class="header">
      <view>搜索楼盘</view>
      <view>
        <picker @change="pickerChangeHandler" :value="selectDistrictIndex" :range="districts" range-key="name">
          <view class="picker-view">{{districts[selectDistrictIndex].name}}</view>
        </picker>
      </view>
      <view class="search-btn" @click="search">搜索</view>
    </view>

    <view class="label">
      <view>今日成交</view>
      <view class="info">
        <view class="item">
          <view class="num">{{todaySale.suite}}</view>
          <view class="text">成交套数</view>
        </view>

        <view class="item">
          <view class="num">{{todaySale.square}}m²</view>
          <view class="text">成交面积</view>
        </view>
        <view class="item">
          <view class="num">{{todaySale.square}}</view>
          <view class="text">成交面积</view>
        </view>
      </view>

    </view>
    <view class="label">
      <view>今日可售</view>
      <view class="info">
        <view class="item">
          <view class="num">{{todayAvail.project}}</view>
          <view class="text">楼盘个数</view>
        </view>
        <view class="item">
          <view class="num">{{todayAvail.suite}}</view>
          <view class="text">总套数</view>
        </view>

        <view class="item">
          <view class="num">{{todayAvail.square}}m²</view>
          <view class="text">总面积</view>
        </view>
      </view>
    </view>
	</view>
</template>

<script>
import {todaysale, todayavail} from '../../api'
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState(['districts'])
  },
  data() {
    return {
      selectDistrictIndex:0,
      todaySale: {},
      todayAvail: {}
    }
  },
  onLoad() {
    this.initTodaySale()
    this.initTodayAvail()
  },
  methods: {
    async initTodaySale() {
      let a = await todaysale()
      this.todaySale = a.detail.find(item => item.area === '合计')
      console.log(a)
    },
    async initTodayAvail() {
      let a = await todayavail()
      this.todayAvail = a.detail.find(item => item.area === '合计')
    },
    pickerChangeHandler(e) {
      let i = e.detail.value
      this.selectDistrictIndex = i
    },
    search() {
      let district = this.districts[this.selectDistrictIndex].name
      uni.navigateTo({
        url: `/pages/index/projectList?d=${encodeURIComponent(district)}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/helper";
.page{
  min-height: 100vh;
  background-color: $uni-bg-color-grey;
}
.header{
  @include border-radius;
  @include shadow;
  background-color: $uni-color-primary;
  margin: 20rpx;
  padding: 20rpx;
  color: #ffffff;
  font-size: 36rpx;
  .picker-view{
    @include border-radius;
    background-color: #ffffff;
    line-height: 2;
    color: $uni-color-primary;
    text-align: center;
  }
  .search-btn{
    @include border-radius;
    background-color: #ffffff;
    color: $uni-color-primary;
    text-align: center;
    line-height: 2;
    margin-top: 20rpx;
  }
}
.label{
  @include card;
  margin: 40rpx 20rpx 20rpx;
  padding: 20rpx;
  .info{
    display: flex;
    justify-content: space-between;
    .item{
      text-align: center;
      .num{
        color: $uni-color-primary;
        font-size: 40rpx;
      }
      .text{
        color: $uni-text-color-grey;
        font-size: 30rpx;
      }
    }
  }
}
</style>
