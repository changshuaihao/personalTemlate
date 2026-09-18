import { h, ref, createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { DatePicker, Select, Tag, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getColumnValue } from '@/utils';
// import { useDict } from '@/hooks/web/useDict';
// import { getOperationTypeListApi } from '@/api/systemSetting/systemManage/trackLog';

let resultList = [];
// const getLogResultList = async () => {
//   resultList = await useDict('log_result');
// };

let operationList = [];
// const getOperationList = async () => {
//   const { data } = await getOperationTypeListApi();
//   operationList = data.data.map((item) => ({
//     label: item,
//     value: item,
//   }));
// };

// await getLogResultList();
// await getOperationList();

export const columns = ref([
  {
    title: '开始时间',
    dataIndex: 'beginTime',
    search: true,
    searchType: DatePicker,
    searchPlaceHolder: '请选择开始时间',
    hideInTable: true,
    initValue: dayjs().subtract(7, 'day'),
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    search: true,
    searchType: DatePicker,
    searchPlaceHolder: '请选择结束时间',
    hideInTable: true,
    initValue: dayjs(),
  },
  {
    title: '日志标题',
    dataIndex: 'logTitle',
    align: 'center',
    searchPlaceHolder: '请输入日志标题',
  },
  {
    title: '结果',
    dataIndex: 'logResult',
    search: true,
    searchType: Select,
    align: 'center',
    valueEnum: resultList,
    searchPlaceHolder: '请选择',
    customRender: (record) => {
      const { value } = record;
      return h(Tag, {
        color: value === '操作成功' ? 'green' : 'red',
        innerText: value,
      });
    },
  },
  {
    title: '操作用户',
    dataIndex: 'userName',
    align: 'center',
  },
  {
    title: 'IP地址',
    dataIndex: 'ipAddr',
    align: 'center',
  },
  {
    title: '请求URL',
    dataIndex: 'requestUri',
    align: 'center',
  },
  {
    title: '请求方式',
    dataIndex: 'requestMode',
    align: 'center',
  },
  {
    title: '操作方法类型',
    dataIndex: 'methodType',
    align: 'center',
    search: true,
    searchType: Select,
    valueEnum: operationList,
    searchPlaceHolder: '请选择操作方法类型',
  },
  {
    title: '用户代理',
    dataIndex: 'userAgent',
    align: 'center',
    width: 300,
  },
  {
    title: '日志类型',
    dataIndex: 'logType',
    align: 'center',
  },
  {
    title: '时间',
    dataIndex: 'insertTime',
    align: 'center',
    width: 200,
  },
  {
    title: '日志详情',
    dataIndex: 'logInfo',
    align: 'center',
    width: 200,
    customRender: (record) => {
      const { value } = record;
      return getColumnValue(
        value,
        value && value.length >= 20
          ? h('div', {}, [
              h('span', {
                innerText: `${value.substring(0, 30)}...`,
              }),
              h('span', {
                style: { color: 'var(--custom-primary-color)' },
                class: ['hover:cursor-pointer'],
                innerText: ' 详情 >',
                onClick: () => {
                  Modal.info({
                    title: '日志详情',
                    icon: createVNode(ExclamationCircleOutlined),
                    content: value,
                    okText: '关闭',
                    centered: true,
                    maskClosable: true,
                    width: 650,
                  });
                },
              }),
            ])
          : value,
      );
    },
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
