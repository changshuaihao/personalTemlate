import { h, ref } from 'vue';
import { DatePicker, Input, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';
import { sorter, getColumnValue } from '@/utils';

/**
 *  title: string; // 标题
 *  dataIndex: string; // 键值
 *  tooltip?: string; // 说明
 *  valueEnum?: valueEnum[]; // 字典枚举
 *  search?: boolean; // 是否显示在搜索栏，默认为false
 *  searchType?: any; // 搜索组件类型
 *  searchPlaceHolder?: string; // 搜索框占位符
 *  hideInTable?: boolean; // 是否显示在表格
 *  width?: string | number; // 宽度
 *  filter?: boolean; // 是否开启筛选
 *  其他遵循antdv的column配置
 */
export const columns = ref([
  {
    title: 'mn编码',
    dataIndex: 'mn_code',
    align: 'center',
    search: true,
    searchType: Input,
    searchPlaceHolder: '请输入MN号',
    width: 120,
    fixed: 'left',
    customRender: (record) => {
      const { value } = record;
      return getColumnValue(value);
    },
  },
  {
    title: '企业名称',
    dataIndex: 'mn_name',
    align: 'center',
    search: true,
    searchType: Input,
    searchPlaceHolder: '请输入名称',
    width: 120,
    fixed: 'left',
    customRender: (record) => {
      const { value } = record;
      return getColumnValue(value);
    },
  },
  {
    title: '统计时间',
    dataIndex: 'day_dt',
    align: 'center',
    width: 80,
    customRender: (record) => {
      const { value } = record;
      return `${dayjs(value).format('YYYY-MM-DD')}`;
    },
  },
  {
    title: '日采集有效记录数',
    dataIndex: 'valid_rec_count',
    align: 'center',
    width: 100,
    sorter: sorter('valid_rec_count'),
    customRender: (record) => {
      const { value } = record;
      return getColumnValue(value);
    },
  },
  {
    title: '数据正点到达的记录数占比',
    dataIndex: 'rec_on_time_day_arvl_rate',
    align: 'center',
    width: 100,
    sorter: sorter('rec_on_time_day_arvl_rate'),
    customRender: (record) => {
      const { value } = record;
      return `${value !== null ? `${Math.round(value * 10000) / 100}%` : '--'}`;
    },
  },
  {
    title: '时间',
    dataIndex: 'start_time',
    align: 'center',
    search: true,
    searchType: DatePicker,
    searchPlaceHolder: '请输入时间',
    hideInTable: true,
    width: 100,
    initValue: dayjs().subtract(1, 'day'),
  },
]);

export const serverColumns = ref([
  {
    title: '流域名称',
    dataIndex: 'basinName',
    align: 'center',
    search: true,
    searchType: Input,
    searchPlaceHolder: '请输入流域名称',
  },
  {
    title: '自定义标签',
    dataIndex: 'remarks',
    align: 'center',
    customRender: () => {
      return h(Tag, {
        color: 'blue',
        innerText: '标签',
      });
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width: 300,
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

serverColumns.value.forEach((item) => {
  if (!item.customRender) {
    item.customRender = (record) => {
      const { value } = record;
      return getColumnValue(value);
    };
  }
});
