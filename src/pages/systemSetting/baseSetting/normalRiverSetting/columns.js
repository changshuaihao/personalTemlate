import { ref } from 'vue';
import { Input } from 'ant-design-vue';
import { getColumnValue } from '@/utils';

export const tableHeaders = [
  {
    title: '河涌名称',
    dataIndex: 'riverName',
    align: 'center',
  },
  {
    title: '所属流域',
    dataIndex: 'basinId',
    align: 'center',
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
  },
];

export const columns = ref([
  {
    title: '河涌名称',
    dataIndex: 'riverName',
    align: 'center',
    search: true,
    searchType: Input,
    searchPlaceHolder: '请输入河涌名称',
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 320,
    align: 'center',
  },
]);

// 处理空数据
columns.value.forEach((item) => {
  if (!item.customRender) {
    item.customRender = (record) => {
      const { value } = record;
      return getColumnValue(value);
    };
  }
});

export const editHeaders = [
  {
    title: '河涌名称',
    dataIndex: 'riverName',
    required: true,
  },
  {
    title: '起点',
    dataIndex: 'originPoint',
  },
  {
    title: '终点',
    dataIndex: 'endPoint',
  },
  {
    title: '收纳水体',
    dataIndex: 'acceptanceRiver',
  },
  {
    title: '河涌长度',
    dataIndex: 'riverLength',
  },
  {
    title: '坐标集合',
    dataIndex: 'coordinateSet',
  },
  {
    title: '河涌面积',
    dataIndex: 'riverArea',
  },
  {
    title: '河涌位置',
    dataIndex: 'riverPlace',
  },
  {
    title: '备注',
    dataIndex: 'remarks',
  },
];
