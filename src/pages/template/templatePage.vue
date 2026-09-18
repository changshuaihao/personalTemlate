<template>
  <div>
    <a-card title="主要版本" size="small" class="my-3 card-wrap">
      <div>
        <a-tag class="ml-2">vue：^3.2.45</a-tag> <a-tag class="ml-2">ant-design-vue：^4.1.0</a-tag>
        <a-tag class="ml-2">vite：^3.2.4</a-tag>
      </div>
    </a-card>
    <div class="my-3">
      <a-badge-ribbon text="常规按钮">
        <a-card title="常规按钮" size="small" class="card-wrap">
          <CBtn :showType="BTN_TYPE.search" class="mx-1"></CBtn>
          <CBtn :showType="BTN_TYPE.reset" class="mx-1"></CBtn>
          <CBtn :showType="BTN_TYPE.add" class="mx-1">新增</CBtn>
          <CBtn :showType="BTN_TYPE.upload" class="mx-1">导入</CBtn>
          <CBtn :showType="BTN_TYPE.download" class="mx-1">导出</CBtn>
          <CBtn :showType="BTN_TYPE.close" class="mx-1">关闭</CBtn>
          <CBtn :showType="BTN_TYPE.edit" class="mx-1">编辑</CBtn>
          <CBtn :showType="BTN_TYPE.delete" class="mx-1" @click="del">删除</CBtn>
        </a-card>
      </a-badge-ribbon>
    </div>
    <div class="my-3">
      <a-badge-ribbon text="选择输入框">
        <a-card title="选择输入框" size="small" class="card-wrap">
          选择：<CSelect :options="options" v-model:value="select" class="mx-1"></CSelect>
          输入：<CInput v-model:value="value" class="mx-1"></CInput>
        </a-card>
      </a-badge-ribbon>
    </div>
    <div class="my-3">
      <a-badge-ribbon text="日历控件(含有农历和节假日)">
        <a-card title="日历控件(含有农历和节假日)" size="small" class="card-wrap">
          <CCalendar v-model:value="beginTime"></CCalendar>
        </a-card>
      </a-badge-ribbon>
    </div>
    <div class="my-3">
      <a-badge-ribbon text="常规表格">
        <a-card title="表格示例（服务端分页）" size="small" class="card-wrap">
          <tableServer></tableServer>
        </a-card>
      </a-badge-ribbon>
    </div>
    <div class="my-3">
      <a-badge-ribbon text="常规表格">
        <a-card title="表格示例（非服务端分页）" size="small" class="card-wrap">
          <tableExample></tableExample>
        </a-card>
      </a-badge-ribbon>
    </div>
  </div>
</template>
<script setup>
  import CSelect from '@/components/antdv/Select/src/BasicSelect.vue';
  import CInput from '@/components/antdv/Input/BasicInput.vue';
  import CBtn from '@/components/antdv/Button/BasicBtn.vue';
  import CCalendar from '@/components/antdv/calendar/calendarPage.vue';
  import { BTN_TYPE } from '@/constants';
  import { ref, watch, createVNode } from 'vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { Modal } from 'ant-design-vue';
  import { message } from 'ant-design-vue';
  import tableExample from './table/tableExample.vue';
  import tableServer from './table/tablePageByServer.vue';

  const options = ref([
    {
      label: 'test',
      value: 'test',
    },
  ]);
  const select = ref(null);
  const value = ref('');
  const beginTime = ref(null);

  watch(select, (val) => {
    console.log(val);
  });
  const del = () => {
    Modal.confirm({
      title: () => '提示',
      icon: () => createVNode(ExclamationCircleOutlined),
      content: () => createVNode('div', { style: 'color:block;' }, `确定删除该条数据?`),
      onOk: async () => {
        message.success('删除成功!');
      },
    });
  };
</script>
