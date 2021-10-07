<template>
  <view class="page">
    <view>11</view>
    <view>
      <view v-for="(floor,key) in floorList">
        <view>{{key}}</view>
        <view v-for="house in floor"></view>
      </view>
    </view>
  </view>
</template>

<script>
import {building} from '../../api/index'
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
        }else{
          floor.list.push(item)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page{
  min-height: 100vh;
  background-color: $uni-bg-color-grey;
}
</style>