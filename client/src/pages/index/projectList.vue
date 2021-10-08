<template>
  <view class="page">
    <view class="header">
      <view style="display: flex;align-items: center">
        <picker @change="pickerChangeHandler" :value="selectDistrictIndex" :range="districts" range-key="name" style="flex: 1">
            <view class="picker-view" style="flex: 1;">{{districts[selectDistrictIndex] ? districts[selectDistrictIndex].name: ''}}</view>
        </picker>
        <view class="picker-view" style="width: 160rpx;margin-left: 20rpx">搜索</view>
      </view>

      <view class="filter-label">
        价格
        <input type="number" class="filter-input">元至
        <input type="number" class="filter-input">元
      </view>
      <view class="filter-label">
        面积
        <input type="number" class="filter-input">m²至
        <input type="number" class="filter-input">m²
      </view>

    </view>
    <view class="list">
      <projectItem v-for="item in list" :key="item.id" :project-item="item"></projectItem>
    </view>
  </view>
</template>

<script>
import {searchproject} from '../../api'
import {mapState} from 'vuex'
import projectItem from '../../component/projectItem'
export default {
  name: 'projectList',
  components: {projectItem},
  onLoad(query) {
    let d = query.d
    if (d) {
      this.selectDistrictIndex = this.districts.findIndex(item => item && item.name === d)
      if(this.selectDistrictIndex> -1){  this.queryData.district = this.districts[this.selectDistrictIndex].name || ''}
    }
    this.search()
  },
  onReachBottom() {
    this.queryData.page += 1
    this.search()
  },
  computed: {
    ...mapState(['districts'])
  },
  data() {
    return {
      selectDistrictIndex:0,
      queryData: {
        district: '鼓楼区',
        page: 1,
      },
      list: [],
      total: -1

    }
  },
  methods: {
    showLoading() {
      uni.showLoading()
    },
    hideLoading() {
      uni.hideLoading()
    },
    async search(){
      if (this.total === -1 || this.total > this.list.length) {
        this.showLoading()
        let res = await searchproject(this.queryData)
        if (this.queryData.page === 1) {
          this.list = res.rows
        }else{
          this.list = this.list.concat(res.rows)
        }
        this.total = res.count
        this.hideLoading()
      }
    },
    pickerChangeHandler(e) {
      let i = e.detail.value
      this.selectDistrictIndex = i
      this.queryData.district = this.districts[this.selectDistrictIndex].name
      this.queryData.page = 1
      this.search()
    },
  }
}
</script>

<style scoped lang="scss">
@import '../../style/helper';
.page{
  min-height: 100vh;
  background-color: $uni-bg-color-grey;
}
.header{
  @include border-radius;
  @include shadow;
  background-color: $uni-color-primary;
  padding: 20rpx;
  margin: 20rpx;

  .picker-view{
    @include border-radius;
    background-color: #ffffff;
    line-height: 2;
    color: $uni-color-primary;
    text-align: center;
  }
}

.list{
  padding-bottom: 20rpx;
}
.filter-label{
  display: flex;
  align-items: center;
  font-size: 36rpx;
  color: #FFFFFF;
  white-space: nowrap;
  margin-top: 20rpx;
  .filter-input{
    background-color: #FFFFFF;
    flex-shrink: 1;
    margin: 0 10rpx;
    padding: 10rpx 10rpx;
    color: #333333;
    @include border-radius;

  }
}
</style>