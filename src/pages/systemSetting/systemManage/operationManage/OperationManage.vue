<template>
  <BasicTable
    ref="basicTable"
    :loading="loading"
    :columns="columns"
    @onSubmit="onSubmit"
    :dataSource="dataSource"
    :total="dataSource.length"
    :isWrap="true"
    :isCustomPage="true"
    :pagination="{
      current,
      size,
      total,
    }"
    @setPagination="setPagination"
  >
    <template #tableBody="{ column, record }">
      <a-flex v-if="column.dataIndex === 'operation'" gap="middle" justify="center">
        <CBtn :showType="BTN_TYPE.edit" @click="editData(record)"></CBtn>
        <CBtn :showType="BTN_TYPE.addrole" @click="addMenu(record)"></CBtn>
        <CBtn :showType="BTN_TYPE.delete" @click="delData(record)"></CBtn>
      </a-flex>
    </template>
  </BasicTable>
  <a-modal v-model:open="visible" title="日志详情" style="width: 600px">
    <span>{{ currentInfoText }}</span>
  </a-modal>
</template>
<script setup>
  import { reactive, ref } from 'vue';
  import { getOperationLogListApi } from '@/api/systemSetting/systemManage/trackLog';
  import { columns } from './columns';
  import { useInitTable } from '@/hooks/web/useInitTable';

  const fieldValue = reactive({});
  const basicTable = ref();
  const visible = ref(false);
  const currentInfoText = ref(false);

  const onSubmit = async (params) => {
    Object.keys(params).forEach((key) => {
      fieldValue[key] = params[key];
    });
    search();
  };

  const { current, size, total, dataSource, loading, search, setPagination } = useInitTable(
    fieldValue,
    getOperationLogListApi,
    {
      onMountedBeforeCheckFunc: () => {
        Object.keys(basicTable.value.formState).forEach((key) => {
          fieldValue[key] = basicTable.value.formState[key];
        });
        loading.value = true;
      },
      onMountedAfterCheckFunc: () => {
        loading.value = false;
      },
    },
  );
</script>
