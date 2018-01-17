<template>
    <el-row>
      <el-col :span="4">
        <right-nav></right-nav>
      </el-col>
      <el-col :span="19">
        <el-row style="line-height: 60px;margin-bottom:20px;background-color: #E4E7Ed">
          <el-col :span="2" style="font-size: 15px;line-height:60px">时间:</el-col>
          <el-col :span="5">
            <el-date-picker
                v-model="value1"
                type="date"
                size="small"
                placeholder="选择开始日期">
            </el-date-picker>
          </el-col>
          <el-col :span="5" style="margin-left: 3%">
            <el-date-picker
                v-model="value2"
                type="date"
                size="small"
                placeholder="选择结束日期">
            </el-date-picker>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" size="mini">查询</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" size="mini">重置</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" style="border: 1px solid #e4e7ed;height: 250px;margin-right:20px;">
            <el-tree :data="data" :props="defaultProps" :default-expanded-keys="[0,1]" @node-click="handleNodeClick"></el-tree>
          </el-col>
          <el-col :span="19">
            <el-table
              :data="tableData"
              stripe
              border
              style="background-color: #e4e7ed">
              <el-table-column
              prop="id"
              label="单位"
              width="80"
              />
              <el-table-column
              prop="type"
              label="装备名称"
              />
              <el-table-column
              prop="unit"
              label="离队原因"
              />
              <el-table-column
              prop="date"
              label="责任人"
              />
              <el-table-column
              prop="sponsor"
              label="拟归队时间"
              />
              <el-table-column
              prop="details"
              label="上报时间"/>
              <el-table-column
              prop="options"
              label="备注"/>
            </el-table>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
</template>

<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import RightNav from '@/components/CentralManager/RightNav'
@Component({
  components: {
    RightNav
  }
})
export default class CentralGearStatus extends Vue {
  value2 = ''
  value1 = ''
  tableData = []
  data () {
    return {
      data: [
        {
          label: '单位1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: '单位2',
          children: [
            {
              label: '单位2-1',
              children: [
                {
                  label: '三级 2-1-1'
                }
              ]
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  }
  handleNodeClick (data) {
  }
}
</script>
