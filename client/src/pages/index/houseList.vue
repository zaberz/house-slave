<template>
  <view class="page">
    <view class="header">
      <view style="display: flex;align-items: center">
        <view style="margin-right: 20rpx">只看可售</view>
        <switch v-model="filterStatus.state"></switch>
      </view>
      <view style="display: flex;align-items: center">
        <view style="margin-right: 20rpx">只看住宅</view>
        <switch v-model="filterStatus.type"></switch>
      </view>
    </view>
    <view>
      <view v-for="(floor) in filteredList" class="floor">
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
      houseList: [],
      statusMap,
      filterStatus: {
        state: '',
        type: ''
      }
    }
  },
  computed: {
    filteredList() {
      let floorList = []
      let filtedList = this.houseList.filter(item=> {
        if (this.filterStatus.state && item.state !== 3) {
          return false
        }
        if (this.filterStatus.type && item.type !== '住宅') {
          return false
        }
      })
      filtedList.forEach(item=> {
        let floor = floorList.find(floorDetail => floorDetail.floor === item.floor)
        if (!floor) {
          floor = {
            floor: item.floor,
            list: [item]
          }
          floorList.push(floor)
        }else{
          floor.list.push(item)
        }
      })
      floorList = floorList.sort((a,b)=> b.floor - a.floor)
      console.log(floorList)
      return floorList
    }
  },
  methods: {
    async getHouseList(bid) {
      let a = await building(bid)
      this.buildingInfo = a.buildingInfo
      this.houseList = a.houseList
    },
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
  display: flex;
  padding: 20rpx;
  justify-content: space-between;
  align-items: center;
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