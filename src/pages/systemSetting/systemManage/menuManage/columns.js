import { ref, h } from 'vue';
import { Input } from 'ant-design-vue';
import { getColumnValue } from '@/utils';
import Icon from '@/components/Icon';

export const columns = ref([
  {
    title: '菜单名称',
    dataIndex: 'name',
    align: 'center',
    search: true,
    searchType: Input,
    searchPlaceHolder: '请输入菜单名称',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    align: 'center',
    customRender: (record) => {
      const { value } = record;
      return h(Icon, {
        icon: value,
      });
    },
  },
  {
    title: '路由',
    dataIndex: 'url',
    align: 'center',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    align: 'center',
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
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
    width: 390,
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
