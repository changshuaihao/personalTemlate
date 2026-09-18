<template>
  <BasicTable
    :loading="loading"
    :columns="columns"
    @onSubmit="onSubmit"
    :dataSource="dataSource"
    :isWrap="true"
    :isAdd="true"
    :isCustomPage="true"
    :pagination="{
      current,
      size,
      total,
    }"
    @setPagination="setPagination"
    @addFunc="addFunc"
    rowKey="id"
  >
    <template #tableBody="{ column, record }">
      <a-flex v-if="column.dataIndex === 'operation'" gap="left" justify="center">
        <CBtn :showType="BTN_TYPE.edit" @click="editData(record)"></CBtn>
        <CBtn :showType="BTN_TYPE.addmenu" @click="addOffice(record)"></CBtn>
        <CBtn :showType="BTN_TYPE.delete" @click="delData(record)"></CBtn>
      </a-flex>
    </template>
  </BasicTable>
  <a-modal
    v-model:open="showModel"
    width="650px"
    :title="showMenu ? '新增子项' : showEdit ? '编辑部门' : '新增部门'"
  >
    <template #footer>
      <a-button key="back" @click="showModel = false">取消</a-button>
      <a-button type="primary" v-if="showEdit && !showMenu" @click="clickSave">保存</a-button>
      <a-button type="primary" v-else-if="!showEdit && !showMenu" @click="saveUserData"
        >新增</a-button
      >
      <a-button type="primary" v-else-if="showMenu" @click="addOfficeData">配置</a-button>
    </template>
    <div style="margin: 0px 30px; dispaly: flex; justify-content: center; flex-direction: column">
      <a-form :model="addForm" :labelCol="{ span: 4 }" ref="formRef">
        <a-form-item
          label="上级部门"
          labelAlign="right"
          name="pOfficeId"
          :rules="[{ required: true }]"
        >
          <a-cascader
            v-model:value="addForm.pOfficeId"
            :options="officeList"
            :disabled="disabled"
            change-on-select
            style="width: 400px"
            placeholder="请选择上级部门"
            :field-names="{ label: 'name', value: 'id', children: 'children' }"
          >
            <template #tagRender="data">
              <a-tag :key="data.id" color="blue">{{ data.name }}</a-tag>
            </template>
          </a-cascader>
        </a-form-item>
        <a-form-item
          label="部门名"
          labelAlign="right"
          name="officeName"
          :rules="[{ required: true }]"
        >
          <a-input v-model:value="addForm.officeName" style="width: 400px" />
        </a-form-item>
        <a-form-item
          label="部门类型"
          labelAlign="right"
          name="officeType"
          :rules="[{ required: true }]"
        >
          <CSelect
            style="width: 400px; margin-left: 0"
            placeholder="部门类型选择"
            v-model:value="addForm.officeType"
            :options="officeTypeOptions"
          ></CSelect>
        </a-form-item>
        <a-form-item label="联系电话" labelAlign="right">
          <a-input v-model:value="addForm.linkPhone" style="width: 400px" />
        </a-form-item>
        <a-form-item label="联系人" labelAlign="right">
          <a-input v-model:value="addForm.linkMan" style="width: 400px" />
        </a-form-item>
        <a-form-item label="备注" labelAlign="right">
          <a-input v-model:value="addForm.remarks" style="width: 400px" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
<script setup>
  import { reactive, ref, onMounted } from 'vue';
  import { columns } from './columns';
  import { useInitTable } from '@/hooks/web/useInitTable';
  import {
    officeByIdApi,
    addOfficeApi,
    editOfficeApi,
    delOfficeApi,
    officeTreeApi,
  } from '@/api/systemSetting/systemManage/department';
  import { message } from 'ant-design-vue';
  import { useDict } from '@/hooks/web/useDict';

  const fieldValue = reactive({});
  const showModel = ref(false);
  const showEdit = ref(false);
  const showMenu = ref(false);
  const disabled = ref(false);
  const addForm = ref({});
  const officeList = ref([
    {
      name: '部门列表',
      id: '0',
    },
  ]);
  const officeTypeOptions = ref([]);
  const formRef = ref();

  const onSubmit = async (params) => {
    Object.keys(params).forEach((key) => {
      fieldValue[key] = params[key];
    });
    search();
  };

  const addFunc = () => {
    showModel.value = true;
    showMenu.value = false;
    showEdit.value = false;
    disabled.value = false;
    addForm.value = {
      pOfficeId: '0',
    };
  };

  const editData = async (val) => {
    showMenu.value = false;
    showEdit.value = true;
    const { data: res } = await officeByIdApi(val.id);
    res.code === 200
      ? ((addForm.value = res.data),
        (showModel.value = true),
        (disabled.value = false),
        (addForm.value.pOfficeId = get_level_all(
          officeList.value,
          addForm.value.pOfficeId,
        ).reverse()))
      : '';
  };

  const addOffice = async (val) => {
    showMenu.value = true;
    addForm.value = {};
    const { data: res } = await officeByIdApi(val.id);
    res.code === 200
      ? ((showModel.value = true),
        (disabled.value = true),
        (addForm.value.pOfficeId = get_level_all(officeList.value, res.data.officeId).reverse()))
      : '';
  };

  const delData = async (val) => {
    const { data: res } = await delOfficeApi(val.id);
    res.code === 200
      ? (message.success('删除成功'), search(), (showModel.value = false), (addForm.value = {}))
      : message.error('删除失败');
  };

  const saveUserData = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      addForm.value.pOfficeId = addForm.value.pOfficeId[addForm.value.pOfficeId.length - 1];
      const { data: res } = await addOfficeApi(addForm.value);
      res.code === 200
        ? (message.success('新增成功'), search(), (showModel.value = false))
        : message.error('新增失败');
    }
  };

  const clickSave = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      addForm.value.pOfficeId = addForm.value.pOfficeId[addForm.value.pOfficeId.length - 1];
      const { data: res } = await editOfficeApi(addForm.value);
      res.code === 200
        ? (message.success('修改成功'),
          search(),
          (showModel.value = false),
          (addForm.value.pOfficeId = get_level_all(
            officeList.value,
            addForm.value.pOfficeId,
          ).reverse()))
        : message.error('修改失败');
    }
  };

  const addOfficeData = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      addForm.value.pOfficeId = addForm.value.pOfficeId[addForm.value.pOfficeId.length - 1];

      const { data: res } = await addOfficeApi(addForm.value);
      res.code === 200
        ? (message.success('新增成功'), search(), (showModel.value = false))
        : message.error('新增失败');
    }
  };

  const get_level_all = (data, id, arr = []) => {
    data.find((item) => {
      if (item.id === id) {
        arr.push(item.id);
        return true;
      } else if (item.children && item.children.length > 0) {
        arr = get_level_all(item.children, id, arr);
        if (arr.length) {
          arr.push(item.id);
          return true;
        } else {
          return false;
        }
      }
      return false;
    });
    return arr;
  };

  const resolveChildren = (dataSource) => {
    // 遍历dataSource树形结构，把children为空的字段删除
    dataSource.forEach((item) => {
      if (item.children && item.children.length === 0) {
        delete item.children;
      } else if (item.children && item.children.length > 0) {
        resolveChildren(item.children);
      }
    });
  };

  const { current, size, total, dataSource, loading, search, setPagination } = useInitTable(
    fieldValue,
    officeTreeApi,
    {
      onMountedBeforeCheckFunc: () => {
        loading.value = true;
      },
      onMountedAfterCheckFunc: () => {
        loading.value = false;
        resolveChildren(dataSource.value);
      },
    },
  );

  onMounted(async () => {
    // await getAllTree();
    officeTypeOptions.value = await useDict('office_type');
  });
</script>
