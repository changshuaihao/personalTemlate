<template>
  <div>
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
      @addFunc="addData"
      rowKey="id"
    >
      <template #tableBody="{ column, record }">
        <a-flex v-if="column.dataIndex === 'operation'" gap="left" justify="center">
          <CBtn :showType="BTN_TYPE.edit" @click="editData(record)"></CBtn>
          <CBtn :showType="BTN_TYPE.addmenu" @click="addMenu(record)">新增子项</CBtn>
          <CBtn :showType="BTN_TYPE.bindingUrl" @click="bindingUrl(record)"></CBtn>
          <CBtn :showType="BTN_TYPE.delete" @click="delData(record)"></CBtn>
        </a-flex>
      </template>
    </BasicTable>
    <a-modal
      v-model:open="showModel"
      width="650px"
      :title="showMenu ? '新增子项' : showEdit ? '编辑菜单' : '新增菜单'"
    >
      <template #footer>
        <a-button key="back" @click="showModel = false">取消</a-button>
        <a-button type="primary" v-if="showEdit && !showMenu" @click="clickSave">保存</a-button>
        <a-button type="primary" v-else-if="!showEdit && !showMenu" @click="saveUserData"
          >新增</a-button
        >
        <a-button type="primary" v-else-if="showMenu" @click="addMenuData">配置</a-button>
      </template>
      <div style="margin: 0px 30px; dispaly: flex; justify-content: center; flex-direction: column">
        <a-form :model="addForm" :labelCol="{ span: 4 }" ref="formRef">
          <a-form-item
            label="上级菜单"
            labelAlign="right"
            name="pMenuId"
            :rules="[{ required: true }]"
          >
            <a-cascader
              v-model:value="addForm.pMenuId"
              :options="menuList"
              :disabled="disabled"
              change-on-select
              style="width: 400px"
              placeholder="请选择上级菜单"
              :field-names="{ label: 'name', value: 'id', children: 'children' }"
            >
              <template #tagRender="data">
                <a-tag :key="data.id" color="blue">{{ data.name }}</a-tag>
              </template>
            </a-cascader>
          </a-form-item>
          <a-form-item
            label="菜单名"
            labelAlign="right"
            name="menuName"
            :rules="[{ required: true }]"
          >
            <a-input v-model:value="addForm.menuName" style="width: 400px" />
          </a-form-item>
          <a-form-item
            label="链接"
            labelAlign="right"
            name="menuPath"
            :rules="[{ required: true }]"
          >
            <a-input v-model:value="addForm.menuPath" style="width: 400px" />
          </a-form-item>
          <a-form-item label="图标" labelAlign="right" style="display: flex; flex-direction: row">
            <a-input v-model:value="addForm.menuIcon" style="width: 400px; margin-right: 5px" />
            <Icon v-if="addForm.menuIcon" :icon="addForm.menuIcon"></Icon>
            <!-- <a-button @click="$refs.files.click()">选择</a-button>
            <input
              type="file"
              @change="inputfile()"
              id="fileItem"
              ref="files"
              style="display: none"
            /> -->
          </a-form-item>
          <a-form-item label="排序" labelAlign="right">
            <a-input v-model:value="addForm.menuSort" style="width: 400px" />
          </a-form-item>
          <a-form-item label="权限标识" labelAlign="right">
            <a-input v-model:value="addForm.permission" style="width: 400px" />
          </a-form-item>
          <a-form-item label="备注" labelAlign="right">
            <a-textarea v-model:value="addForm.remarks" style="width: 400px" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
  import { reactive, ref } from 'vue';
  import { columns } from './columns';
  import { useInitTable } from '@/hooks/web/useInitTable';
  import { message } from 'ant-design-vue';
  import {
    menuTreeApi,
    menuSaveApi,
    menuDeleteApi,
    menuIdApi,
    menuEditApi,
    menuListApi,
  } from '@/api/systemSetting/systemManage/menu';

  const showModel = ref(false);
  const showAdd = ref(true);
  const showEdit = ref(false);
  const showMenu = ref(false);
  const disabled = ref(false);
  const spinning = ref(true);
  const title = ref('新增菜单');

  const searchData = ref([
    {
      name: '菜单名称',
      value: '',
      placeholder: '请输入菜单名',
      type: 'input',
    },
  ]);

  const menuList = ref([
    {
      name: '菜单列表',
      id: '0',
    },
  ]);
  const fieldValue = reactive({});

  const onSubmit = async (params) => {
    Object.keys(params).forEach((key) => {
      fieldValue[key] = params[key];
    });
    afterOperation();
  };

  const afterOperation = async () => {
    await search();
    changeTree(dataSource.value);
  };

  const addForm = ref({});

  const addData = () => {
    title.value = '新增菜单';
    showModel.value = true;
    showMenu.value = false;
    showEdit.value = false;
    showAdd.value = false;
    disabled.value = false;
    addForm.value = {};
  };

  const editData = async (data) => {
    showAdd.value = true;
    showMenu.value = false;
    showEdit.value = true;
    const { data: res } = await menuIdApi(data.id);
    res.code === 200
      ? ((addForm.value = res.data),
        (showModel.value = true),
        (disabled.value = false),
        (addForm.value.pMenuId = get_level_all(menuList.value, addForm.value.pMenuId).reverse()))
      : '';
  };

  const addMenuData = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      addForm.value.pMenuId = addForm.value.pMenuId[addForm.value.pMenuId.length - 1];

      const { data: res } = await menuSaveApi(addForm.value);
      res.code === 200
        ? (message.success('新增成功'), afterOperation(), (showModel.value = false))
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

  const delData = async (val) => {
    const { data: res } = await menuDeleteApi(val.id);
    res.code === 200 ? (message.success('删除成功'), afterOperation()) : message.error('删除失败');
  };

  const addMenu = async (val) => {
    spinning.value = true;
    showAdd.value = false;
    showMenu.value = true;
    addForm.value = {};
    const { data: res } = await menuIdApi(val.id);
    res.code === 200
      ? ((showModel.value = true),
        (disabled.value = true),
        (spinning.value = false),
        (addForm.value.pMenuId = get_level_all(menuList.value, val.id).reverse()))
      : '';
    console.log(addForm.value.pMenuId);
  };
  const formRef = ref();
  const saveUserData = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      addForm.value.pMenuId = addForm.value.pMenuId[addForm.value.pMenuId.length - 1];
      const { data: res } = await menuSaveApi(addForm.value);
      res.code === 200
        ? (message.success('新增成功'), afterOperation(), (showModel.value = false))
        : message.error('新增失败');
    }
  };
  const clickSave = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      addForm.value.pMenuId = addForm.value.pMenuId[addForm.value.pMenuId.length - 1];

      const { data: res } = await menuEditApi(addForm.value);
      res.code === 200
        ? (message.success('修改成功'),
          (addForm.value.pMenuId = get_level_all(menuList.value, addForm.value.pMenuId).reverse()),
          seekData(),
          (showModel.value = false))
        : message.error('修改失败');
    }
  };
  const seekData = () => {
    searchData.value[0].value
      ? ((current.value = '1'), getListById(searchData.value[0].value))
      : ((current.value = '1'), afterOperation());
  };

  const getListById = async (value) => {
    const { data } = await menuListApi(current.value, size.value, { menuName: value });
    if (data && data.code === 200) {
      tableData.value = data.data.records.map((item) => ({
        ...item,
        id: item.menuId,
        name: item.menuName,
        icon: item.menuIcon,
        url: item.menuPath,
        sort: item.menuSort,
        remarks: item.remarks,
      }));
      total.value = data.data.total;
    }
  };

  const tableData = ref([]);

  // 把树状结构childen为[]的修改为null
  const changeTree = (data) => {
    if (data) {
      data.forEach((item) => {
        if (item.children && item.children.length === 0) {
          delete item.children;
        } else {
          changeTree(item.children);
        }
      });
    }
  };

  const { current, size, total, dataSource, loading, search, setPagination } = useInitTable(
    fieldValue,
    menuTreeApi,
    {
      onMountedBeforeCheckFunc: () => {
        loading.value = true;
      },
      onMountedAfterCheckFunc: () => {
        loading.value = false;
        changeTree(dataSource.value);
        menuList.value[0].children = dataSource.value ?? [];
      },
    },
  );
</script>

<style scoped>
  .menu_body {
    margin-top: 12px;
    width: 100%;
  }
</style>
