<template>
  <BasicTable
    :loading="loading"
    :columns="serverColumns"
    @onSubmit="onSubmit"
    :dataSource="dataSource"
    :total="dataSource.length"
    :isWrap="false"
    :isCustomPage="true"
    :pagination="{
      current,
      size,
      total,
    }"
    @setPagination="setPagination"
  >
    <template #tableBody="{ column }">
      <a-flex v-if="column.dataIndex === 'operation'" gap="middle" justify="center">
        <CBtn :showType="BTN_TYPE.edit" class="mx-1">编辑</CBtn>
        <CBtn :showType="BTN_TYPE.delete" class="mx-1">删除</CBtn>
      </a-flex>
    </template>
  </BasicTable>
</template>
<script setup>
  import { reactive } from 'vue';
  import { serverColumns } from './columns';
  import { useInitTable } from '@/hooks/web/useInitTable';
  import { getBasinByPageApi } from '@/api/systemSetting/baseSetting/basinRiverSetting';

  const fieldValue = reactive({});

  const onSubmit = async (params) => {
    Object.keys(params).forEach((key) => {
      fieldValue[key] = params[key];
    });
    search();
  };

  const { current, size, total, dataSource, loading, search, setPagination } = useInitTable(
    fieldValue,
    getBasinByPageApi,
    {
      // 初始化接口调用前回调
      onMountedBeforeCheckFunc: () => {
        loading.value = true;
      },
      // 初始化接口调用后回调
      onMountedAfterCheckFunc: () => {
        // 模拟接口延迟加载效果
        setTimeout(() => {
          loading.value = false;
        }, 2000);
      },
    },
  );
</script>
