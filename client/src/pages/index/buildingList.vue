<template>
  <view class="page">
    <view class="header">
      <view class="title">{{projectInfo.name}}</view>
      <view class="info">地址：{{projectInfo.address}}</view>
      <view class="info">开发商：{{projectInfo.companyName}}</view>
      <view class="count-info">
        <view class="total">
          <view>总套数	{{projectInfo.countSuite}}</view>
          <view>总面积	{{projectInfo.countArea}}</view>
          <view>住宅套数	{{projectInfo.countHouse}}</view>
          <view>住宅面积	{{projectInfo.countHouseArea}}</view>
        </view>
        <view class="sold">
          <view>已售套数	{{projectInfo.soldCountSuite}}</view>
          <view>已售面积	{{projectInfo.soldCountArea}}</view>
          <view>已售住宅套数	{{projectInfo.soldCountHouse}}</view>
          <view>已售住宅面积	{{projectInfo.soldCountHouseArea}}</view>
        </view>
      </view>
    </view>
    <view class="list">
      <view class="item" v-for="item in buildings" @click="toBuilding(item)">{{item.buildingName}}</view>
    </view>
  </view>
</template>

<script>
import {project} from '../../api'

export default {
  name: 'buildingList',
  onLoad(query) {
    this.projectId = query.pid
    this.init()
  },
  data() {
    return {
      projectId: '',
      projectInfo: {},
      buildings: []
    }
  },
  methods: {
    async init() {
      uni.showLoading()
      let a = await project(this.projectId)
      this.projectInfo = a.projectInfo
      this.buildings = a.buildings
      console.log(a)
      uni.hideLoading()
    },
    toBuilding(item) {
      let buildingId = item.buildingId
      uni.navigateTo({
        url: `/pages/index/houseList?bid=${buildingId}`
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../style/helper";
.page{
  min-height: 100vh;
  background-color: $uni-bg-color-grey;
  overflow: auto;
  .header{
    @include card;
    margin: 20rpx;
    padding: 20rpx;
    .title{
      line-height: 1.5;
    }
    .info{
      font-size: 24rpx;
      color: $uni-text-color-grey;
    }
    .count-info{
      display: flex;
      font-size: 24rpx;
      color: $uni-text-color-grey;

      .total, .sold{
        width: 50%;
      }
    }
  }
  .list{
    font-size: 32rpx;
    .item{
      @include card;
      display: inline-block;
      margin: 20rpx;
      padding: 20rpx;
    }
  }
}

</style>