import { ref } from 'vue';
import { Input } from 'ant-design-vue';
import { getColumnValue } from '@/utils';
import { officeListApi } from '@/api/systemSetting/systemManage/department';

const status = ['有效', '冻结', '禁用'];

const officeList = [];
const getOfficeList = async () => {
  const { data: res } = await officeListApi({ current: 1, size: 100 });
  res.data.records.forEach((item) => {
    officeList.push({
      id: item.officeId,
      name: item.officeName,
    });
  });
};

getOfficeList();

export const columns = ref([
  {
    title: '用户名称',
    dataIndex: 'userName',
    align: 'center',
    search: true,
    searchType: Input,
    searchPlaceHolder: '用户名称',
  },
  {
    title: '登录账号',
    dataIndex: 'loginName',
    align: 'center',
    search: true,
    searchType: Input,
    searchPlaceHolder: '登录账号',
  },
  {
    title: '所属部门',
    dataIndex: 'officeId',
    align: 'center',
    customRender: (record) => {
      const { value } = record;
      return getColumnValue(
        value,
        officeList.find((item) => item.id === value)
          ? officeList.find((item) => item.id === value).name
          : '--',
      );
    },
  },
  {
    title: '所属角色',
    dataIndex: 'roles',
    align: 'center',
    customRender: (record) => {
      if (!record.record.roles.length) {
        return '--';
      }
      return getColumnValue(record.record.roles.map((item) => item.roleName).join('、'));
    },
  },
  {
    title: '用户状态',
    dataIndex: 'userStatus',
    align: 'center',
    type: 'isConvert',
    customRender: (record) => {
      const { value } = record;
      return getColumnValue(value, status[value]);
    },
  },
  { title: '手机号', dataIndex: 'userPhone', align: 'center' },
  { title: '邮箱', dataIndex: 'email', align: 'center' },
  { title: '备注', dataIndex: 'remarks', align: 'center' },
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
