<template>
  <view class="project-item" @click="toProjectDetail">
    <view class="item-left">
      <view class="title">{{projectItem.name}}</view>
      <view class="info">{{projectItem.address}}</view>
    </view>
    <view class="item-right">
      <view class="num">{{ projectItem.availCountSuite }}</view>
      <view class="text">可售总套数</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'projectItem',
  props: {
    projectItem: {
      type: Object,
      default: {}
    }
  },
  methods: {
    toProjectDetail() {
      console.log(this.projectItem)
      let id = this.projectItem.projectId
      if (id) {
        uni.navigateTo({
          url: `/pages/index/buildingList?pid=${id}`
        })
      }
    }
  },
}
</script>

<style scoped lang="scss">
@import "../style/helper";
.project-item{
  @include card;
  display: flex;
  justify-content: space-between;
  margin: 30rpx 20rpx;
  padding: 20rpx;
  .item-left{
    flex: 1;
    overflow: hidden;
    .title{
      @include ellipsis;
      font-size: 40rpx;
    }
    .info{
      @include ellipsis;
      font-size: 28rpx;
      color: $uni-text-color-grey;
    }
  }
  .item-right{
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

</style>