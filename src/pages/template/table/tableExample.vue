<template>
  <BasicTable
    :loading="loading"
    :columns="columns"
    @onSubmit="onSubmit"
    :dataSource="dataSource"
    :total="dataSource.length"
    :isWrap="false"
  >
  </BasicTable>
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import { mockDataSource } from './mock';
  import { columns } from './columns';
  import dayjs from 'dayjs';
  import { message as Message } from 'ant-design-vue';

  let startTime = '';

  const dataSource = ref([]);
  let totalDataList = [];
  const loading = ref(false);

  const onSubmit = async (formValue) => {
    if (startTime !== formValue.start_time) {
      await getDataList(dayjs(formValue.start_time).format('YYYY-MM-DD'));
      startTime = formValue.start_time;
    }
    dataSource.value = totalDataList.filter((item) => {
      return (
        item.mn_name.trim().indexOf(formValue.mn_name || '') > -1 &&
        item.mn_code.trim().indexOf(formValue.mn_code || '') > -1
      );
    });
  };

  const getDataList = async (start_time) => {
    if (!start_time) {
      Message.warning('请选择时间');
      return;
    }
    try {
      loading.value = true;
      const { data } = mockDataSource;
      if (Array.isArray(data)) {
        // 模拟异步请求
        new Promise((resolve) => {
          setTimeout(() => {
            dataSource.value = data;
            totalDataList = data;
            resolve((loading.value = false));
          }, 2000);
        });
      } else {
        dataSource.value = [];
        totalDataList = [];
      }
    } catch (error) {
      console.log(error);
      dataSource.value = [];
      totalDataList = [];
    }
  };

  onMounted(() => {
    getDataList(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  });
</script>
