<template>
  <view class="page">
    <view class="header">
      <picker @change="pickerChangeHandler" :value="selectDistrictIndex" :range="districts" range-key="name">
        <view class="picker-view">{{districts[selectDistrictIndex] ? districts[selectDistrictIndex].name: ''}}</view>
      </picker>
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
  computed: {
    ...mapState(['districts'])
  },
  data() {
    return {
      selectDistrictIndex:0,
      queryData: {
        district: '鼓楼区'
      },
      list: []

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
      this.showLoading()
      let res = await searchproject(this.queryData)
      this.list = res.rows
      this.hideLoading()
    },
    pickerChangeHandler(e) {
      let i = e.detail.value
      this.selectDistrictIndex = i
      this.queryData.district = this.districts[this.selectDistrictIndex].name
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
</style>