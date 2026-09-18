<template>
  <div>
    <BasicTable
      :loading="loading"
      :columns="columns"
      @onSubmit="onSubmit"
      :dataSource="dataSource"
      :total="dataSource.length"
      :isWrap="true"
      :isCustomPage="true"
      :isAdd="true"
      :pagination="{
        current,
        size,
        total,
      }"
      @setPagination="setPagination"
      @addFunc="addData"
    >
      <template #tableBody="{ column, record }">
        <a-flex v-if="column.dataIndex === 'operation'" gap="middle" justify="center">
          <CBtn :showType="BTN_TYPE.edit" @click="editData(record)"></CBtn>
          <CBtn :showType="BTN_TYPE.addrole" @click="deployRole(record)">添加键值</CBtn>
          <CBtn :showType="BTN_TYPE.delete" @click="delData(record)"></CBtn>
        </a-flex>
      </template>
    </BasicTable>
    <a-modal v-model:open="showModel" width="650px" :title="showEdit ? '编辑字典' : '新增字典'">
      <template #footer>
        <a-button key="back" @click="showModel = false">取消</a-button>
        <a-button type="primary" @click="saveDictData">保存</a-button>
      </template>
      <div style="margin: 0px 30px; dispaly: flex; justify-content: center; flex-direction: column">
        <a-form
          :model="addForm"
          :label-col="{
            style: {
              width: '50px',
            },
          }"
        >
          <a-form-item
            label="键值"
            labelAlign="right"
            :rules="{ required: true, message: '请输入键值' }"
          >
            <a-input v-model:value="addForm.dictValue" style="width: 400px" />
          </a-form-item>
          <a-form-item
            label="标签"
            labelAlign="right"
            :rules="{ required: true, message: '请输入标签' }"
          >
            <a-input v-model:value="addForm.dictLabel" style="width: 400px" />
          </a-form-item>
          <a-form-item
            label="类型"
            labelAlign="right"
            :rules="{ required: true, message: '请输入类型' }"
          >
            <a-input v-model:value="addForm.dictType" style="width: 400px" />
          </a-form-item>
          <a-form-item label="描述" labelAlign="right">
            <a-input v-model:value="addForm.dictDesc" style="width: 400px" />
          </a-form-item>
          <a-form-item label="排序" labelAlign="right">
            <a-input v-model:value="addForm.dictSort" style="width: 400px" />
          </a-form-item>
          <a-form-item label="备注" labelAlign="right">
            <a-input v-model:value="addForm.remarks" style="width: 400px" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
  import { ref, reactive, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import { columns } from './columns';
  import { useInitTable } from '@/hooks/web/useInitTable';
  import {
    getDictListData,
    addDictData,
    editDictData,
    delDictData,
  } from '@/api/systemSetting/systemManage/dict';

  const fieldValue = reactive({});

  const onSubmit = async (params) => {
    Object.keys(params).forEach((key) => {
      fieldValue[key] = params[key];
    });
    search();
  };

  const { current, size, total, dataSource, loading, search, setPagination } = useInitTable(
    fieldValue,
    getDictListData,
    {
      // 初始化接口调用前回调
      onMountedBeforeCheckFunc: () => {
        loading.value = true;
      },
      // 初始化接口调用后回调
      onMountedAfterCheckFunc: () => {
        // 模拟接口延迟加载效果
        loading.value = false;
      },
    },
  );

  const showModel = ref(false);
  const addForm = ref({});

  const saveDictData = async () => {
    if (addForm.value.dictValue == '') {
      message.error('字典键值不能为空');
    } else if (addForm.value.dictLabel == '') {
      message.error('字典标签名不能为空');
    } else if (addForm.value.dictType == '') {
      message.error('字典类型不能为空');
    } else {
      if (!showEdit.value) {
        const { data } = await addDictData(addForm.value);
        if (data.code === 200) {
          showModel.value = false;
          message.success('保存成功');
          // getDictTypeAll();
          search();
        } else {
          message.error('保存失败，请检查');
        }
      } else {
        const { data } = await editDictData(addForm.value);
        if (data.code === 200) {
          showModel.value = false;
          message.success('保存成功');
          // getDictTypeAll();
          search();
        } else {
          message.error('保存失败，请检查');
        }
      }
    }
  };

  const addData = () => {
    showModel.value = true;
    showEdit.value = false;
    addForm.value = {};
    addForm.value.dictValue = '';
    addForm.value.dictLabel = '';
    addForm.value.dictType = '';
    addForm.value.dictDesc = '';
    addForm.value.dictSort = '';
    addForm.value.remarks = null;
  };

  const addValue = ref(false);
  const deployRole = (val) => {
    addForm.value = {};
    addForm.value.dictValue = '';
    addForm.value.dictValue = '';
    addForm.value.dictType = val.dictType;
    addForm.value.dictDesc = val.dictDesc;
    addForm.value.dictSort = val.dictSort + 10;
    addForm.value.remarks = null;
    addValue.value = true;
    showModel.value = true;
  };

  const showEdit = ref(false);
  const editData = (val) => {
    showModel.value = true;
    showEdit.value = true;
    addForm.value = val;
  };
  watch(showModel, () => {
    if (!showModel.value) {
      showEdit.value = false;
      addValue.value = true;
    }
  });
  const delData = async (val) => {
    const { data } = await delDictData(val.dictId);
    if (data.code === 200) {
      message.success('已经删除');
      search();
    }
  };
</script>
<style scoped>
  .dict_body {
    margin-top: 12px;
    width: 100%;
  }
</style>
