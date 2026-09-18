import { ref } from 'vue';
import { Input } from 'ant-design-vue';
import { getColumnValue } from '@/utils';

export const columns = ref([
  {
    title: '键值',
    dataIndex: 'dictValue',
    align: 'center',
  },
  {
    title: '标签名',
    dataIndex: 'dictLabel',
    align: 'center',
    search: true,
    searchType: Input,
    searchPlaceHolder: '请输入标签名',
  },
  {
    title: '类型',
    dataIndex: 'dictType',
    align: 'center',
    search: true,
    searchType: Input,
    searchPlaceHolder: '请输入字典类型',
  },
  {
    title: '描述',
    dataIndex: 'dictDesc',
    align: 'center',
  },
  {
    title: '排序',
    dataIndex: 'dictSort',
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
