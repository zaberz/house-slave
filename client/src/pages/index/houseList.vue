<template>
  <view class="page">
    <view class="header">
      <view></view>
    </view>
    <view>
      <view v-for="(floor) in floorList" class="floor">
        <view class="floor-num">{{floor.floor}}</view>
        <view class="house-list">
          <view class="house-list-item" v-for="house in floor.list" :disabled="house.state !== 3">
            <view class="title">{{house.houseName}}</view>
            <view>面积{{house.pBuildingSquare}}</view>
            <view>单价：{{house.unitPrice}}</view>
            <view>总价：{{house.totalPrice}}</view>
            <view :class="{primary: house.state === 3}">状态：{{statusMap[house.state]}}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {building} from '../../api/index'
import {statusMap} from '../../constants'

export default {
  name: 'houseList',
  onLoad(opt) {
    let buildingId = opt.bid
    this.getHouseList(buildingId)
  },
  data() {
    return {
      buildingInfo: {},
      floorList: [],
      statusMap
    }
  },
  methods: {
    async getHouseList(bid) {
      let a = await building(bid)
      this.buildingInfo = a.buildingInfo
      a.houseList.forEach(item=> {
        let floor = this.floorList.find(floorDetail => floorDetail.floor === item.floor)
        if (!floor) {
          floor = {
            floor: item.floor,
            list: [item]
          }
          this.floorList.push(floor)
        }else{
          floor.list.push(item)
        }
      })
      this.floorList = this.floorList.sort((a,b)=> b.floor - a.floor)
    }
  }
}

</script>

<style scoped lang="scss">
@import "../../style/helper";

.page{
  min-height: 100vh;
  background-color: $uni-bg-color-grey;
  padding: 20rpx;
}
.header{
  @include card;
  margin: 20rpx;
}
.floor{
  display: flex;
  align-items: center;
  //margin-bottom: 20rpx;
  font-size: 24rpx;
  .floor-num{
    width: 80rpx;
    height: 80rpx;
    text-align: center;
    @include card;
    flex-shrink: 0;
    margin-right: 20rpx;
    line-height: 80rpx;
    background-color: $uni-color-primary;
    color: #ffffff;
  }

  .house-list{
    //display: flex;
    //flex-wrap: nowrap;
    overflow-x: auto;
    white-space: nowrap;
    padding: 20rpx 0;
    .house-list-item{
      @include card;
      margin-right: 20rpx;
      width: 240rpx;
      display: inline-block;
      padding: 10rpx;
      .title{
        font-size: 28rpx;
        @include ellipsis
      }
      .primary{
        color: $uni-color-primary;
      }
    }
    .house-list-item[disabled] {
      color: $uni-text-color-disable;
    }
  }
}

</style>