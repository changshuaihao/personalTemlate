import { ref } from 'vue';
import { Input } from 'ant-design-vue';
import { getColumnValue } from '@/utils';

export const columns = ref([
  {
    title: '角色名称',
    dataIndex: 'roleName',
    align: 'center',
    search: true,
    searchType: Input,
    searchPlaceHolder: '角色名称',
  },
  {
    title: '角色类型',
    dataIndex: 'roleType',
    align: 'center',
    customRender: (record) => {
      const { value } = record;
      const mapper = new Map().set('1', '超级管理员').set('2', '租户管理员').set('3', '普通用户');
      return getColumnValue(value, mapper.get(value));
    },
  },
  { title: '备注', dataIndex: 'remarks', align: 'center' },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 280,
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
