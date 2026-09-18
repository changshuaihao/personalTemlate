<template>
  <BasicTable
    :loading="loading"
    :columns="columns"
    @onSubmit="onSubmit"
    :dataSource="dataSource"
    :total="dataSource.length"
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
  >
    <template #tableBody="{ column, record }">
      <a-flex v-if="column.dataIndex === 'operation'" gap="left" justify="center">
        <CBtn :showType="BTN_TYPE.edit" @click="editData(record)"></CBtn>
        <CBtn :showType="BTN_TYPE.configure" @click="addMenu(record)"></CBtn>
        <CBtn :showType="BTN_TYPE.delete" @click="delData(record)"></CBtn>
      </a-flex>
    </template>
  </BasicTable>
  <a-modal
    v-model:open="showModel"
    :width="showMenu ? '650px' : '650px'"
    :title="showMenu ? '配置菜单' : showEdit ? '编辑角色' : '新增角色'"
  >
    <template #footer>
      <a-button key="back" @click="showModel = false">取消</a-button>
      <a-button type="primary" v-if="!showEdit && !showMenu" @click="saveUserData">新增</a-button>
      <a-button type="primary" v-else-if="showEdit && !showMenu" @click="clickSave">保存</a-button>
      <a-button type="primary" v-else-if="showMenu" @click="addMenuData">配置</a-button>
    </template>
    <div
      v-if="showAdd"
      style="margin: 0px 30px; dispaly: flex; justify-content: center; flex-direction: column"
    >
      <a-form :model="addForm" :labelCol="{ span: 4 }" ref="formRef">
        <a-form-item
          label="角色名"
          labelAlign="right"
          :rules="[{ required: true }]"
          name="roleName"
        >
          <a-input v-model:value="addForm.roleName" style="width: 400px" />
        </a-form-item>
        <a-form-item
          label="角色类型"
          labelAlign="right"
          :rules="[{ required: true }]"
          name="roleType"
        >
          <CSelect
            style="width: 400px; margin-left: 0"
            placeholder="角色类型选择"
            v-model:value="addForm.roleType"
            :options="typeList"
          ></CSelect>
          <!-- <a-select v-model:value="addForm.roleType" :options="typeList" style="width: 400px" /> -->
        </a-form-item>
        <a-form-item label="备注" labelAlign="right">
          <a-textarea v-model:value="addForm.remarks" style="width: 400px" />
        </a-form-item>
        <!-- <a-form-item label="是否启用*" labelAlign="right">
            <a-radio-group
              v-model:value="formState.isStart"
              :options="showOPt"
              style="width: 400px"
            />
          </a-form-item> -->
      </a-form>
    </div>
    <div
      v-else-if="showMenu"
      style="
        display: flex;
        padding: 10px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
        max-height: 90%;
        height: 550px;
        overflow-y: auto;
      "
    >
      <a-tree
        :tree-data="userTreeData"
        :show-line="true"
        checkable
        defaultExpandAll
        :field-names="userFieldNames"
        v-model:checkedKeys="userMenu"
        @check="onCheck"
      >
        <template #title="{ name }">
          <a-dropdown>
            <span> {{ name }} </span>
          </a-dropdown>
        </template>
      </a-tree>
    </div>
  </a-modal>
</template>
<script setup>
  import { reactive, ref, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { columns } from './columns';
  import {
    roleListApi,
    addRoleApi,
    editRoleApi,
    delRoleApi,
    roleMenuApi,
  } from '@/api/systemSetting/systemManage/role';
  import { menuTreeApi } from '@/api/systemSetting/systemManage/menu';
  import { useInitTable } from '@/hooks/web/useInitTable';

  const fieldValue = reactive({});
  const showModel = ref(false);
  const showEdit = ref(false);
  const showAdd = ref(true);
  const showMenu = ref(false);
  const addForm = ref({});
  const userMenu = ref([]);
  const typeList = ref([
    // {
    //   value: '1',
    //   label: '超级管理员',
    // },
    {
      value: '2',
      label: '租户管理员',
    },
    {
      value: '3',
      label: '普通用户',
    },
  ]);

  const formRef = ref();
  const selectRoleId = ref(null);
  const userTreeData = ref([]);
  const saveMenuIds = ref([]);

  const userFieldNames = ref({
    children: 'children',
    title: 'name',
    key: 'id',
  });

  const onSubmit = async (params) => {
    Object.keys(params).forEach((key) => {
      fieldValue[key] = params[key];
    });
    search();
  };

  const addFunc = () => {
    showModel.value = true;
    showAdd.value = true;
    showEdit.value = false;
    showMenu.value = false;
    addForm.value = {};
  };

  const editData = async (val) => {
    showModel.value = true;
    showEdit.value = true;
    showAdd.value = true;
    showMenu.value = false;
    addForm.value = Object.assign({}, val);
  };

  const addMenu = async (val) => {
    showModel.value = true;
    showAdd.value = false;
    showMenu.value = true;

    selectRoleId.value = val.roleId;
    const { data: menu } = await menuTreeApi({ roleId: val.roleId });
    let idList = [];
    if (menu.data) {
      // 遍历树状结构，获取所有的id
      const getIds = (data) => {
        data.forEach((item) => {
          if (item.children && item.children.length > 0) {
            getIds(item.children);
          } else {
            idList.push(item.id);
          }
        });
      };
      getIds(menu.data);
    }
    userMenu.value = idList;
  };

  const delData = async (val) => {
    const { data: res } = await delRoleApi(val.roleId);
    res.code === 200 ? (message.success('删除成功'), search()) : message.error('删除失败');
  };

  const saveUserData = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      const { data: res } = await addRoleApi(addForm.value);
      res.code === 200
        ? (message.success('新增成功'), search(), (showModel.value = false))
        : message.error('新增失败');
    }
  };

  const clickSave = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      const { data: res } = await editRoleApi(addForm.value);
      res.code === 200
        ? (message.success('修改成功'), search(), (showModel.value = false))
        : message.error('修改失败');
    }
  };

  const addMenuData = async () => {
    const { data: res } = await roleMenuApi({
      id: selectRoleId.value,
      relIds: saveMenuIds.value.length ? saveMenuIds.value : userMenu.value,
    });
    res.code === 200
      ? (message.success('配置成功'), search(), (showModel.value = false))
      : message.error('配置失败');
  };

  const getMenuList = async () => {
    const { data } = await menuTreeApi({});
    userTreeData.value = data.data ?? [];
  };

  const { current, size, total, dataSource, loading, search, setPagination } = useInitTable(
    fieldValue,
    roleListApi,
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

  onMounted(async () => {
    getMenuList();
  });
</script>
