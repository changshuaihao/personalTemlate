import { ref } from 'vue';
import { Input } from 'ant-design-vue';
import { getColumnValue } from '@/utils';

export const columns = ref([
  {
    title: '参数类型名称',
    dataIndex: 'paraName',
    align: 'center',
    search: true,
    searchType: Input,
    searchPlaceHolder: '请输入参数类型名称',
  },
  {
    title: '参数类型编码',
    dataIndex: 'paraCode',
    align: 'center',
    search: true,
    searchType: Input,
    searchPlaceHolder: '请输入参数类型编码',
  },
  {
    title: '参数单位',
    dataIndex: 'paraUnit',
    align: 'center',
  },
  {
    title: '统计单位',
    dataIndex: 'statsUnit',
    align: 'center',
  },
  {
    title: '传感器编码生成策略',
    dataIndex: 'genStrategy',
    align: 'center',
  },
  {
    title: '流程分类',
    dataIndex: 'processType',
    align: 'center',
  },
  {
    title: '告警上限值',
    dataIndex: 'upperLimit',
    align: 'center',
    customRender: (record) => {
      const { value } = record;
      return getColumnValue(
        value,
        Number(value) === 9999 || Number(value) === -9999 ? '无' : value,
      );
    },
  },
  {
    title: '告警下限值',
    dataIndex: 'lowerLimit',
    align: 'center',
    customRender: (record) => {
      const { value } = record;
      return getColumnValue(
        value,
        Number(value) === 9999 || Number(value) === -9999 ? '无' : value,
      );
    },
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
