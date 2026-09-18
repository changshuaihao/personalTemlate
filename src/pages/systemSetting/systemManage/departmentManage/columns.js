import { ref } from 'vue';
import { Input } from 'ant-design-vue';
import { getColumnValue, getValueByOptions } from '@/utils';
import { useDict } from '@/hooks/web/useDict';

let officeTypeList = [];
const getOfficeTypeList = async () => {
  officeTypeList = await useDict('office_type');
};

getOfficeTypeList();

export const columns = ref([
  {
    title: '部门名称',
    dataIndex: 'name',
    align: 'center',
    search: true,
    searchType: Input,
    searchPlaceHolder: '部门名称',
  },
  { title: '联系人', dataIndex: 'linkMan', align: 'center' },
  { title: '联系电话', dataIndex: 'linkPhone', align: 'center' },
  {
    title: '部门类型',
    dataIndex: 'officeType',
    align: 'center',
    customRender: (record) => {
      const { value } = record;
      return getColumnValue(value, getValueByOptions(value, officeTypeList));
    },
  },
  { title: '备注', dataIndex: 'remarks', align: 'center' },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 300,
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
