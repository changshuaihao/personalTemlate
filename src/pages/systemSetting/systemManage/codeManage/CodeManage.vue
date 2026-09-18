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
          <CBtn :showType="BTN_TYPE.delete" @click="delData(record)"></CBtn>
        </a-flex>
      </template>
    </BasicTable>
    <a-modal v-model:open="showModel" width="1050px" :title="showEdit ? '编辑编码' : '新增编码'">
      <template #footer>
        <a-button key="back" @click="showModel = false">取消</a-button>
        <a-button type="primary" @click="saveDictData">保存</a-button>
      </template>
      <div style="margin: 0px 30px">
        <a-form :model="addForm">
          <div class="a_flex">
            <div class="form_box">
              <a-form-item label="参数类型编码*" labelAlign="right">
                <a-input v-model:value="addForm.paraCode" class="form_item_box" />
              </a-form-item>
              <a-form-item label="参数类型名称*" labelAlign="right">
                <a-input v-model:value="addForm.paraName" class="form_item_box" />
              </a-form-item>

              <a-form-item label="告警上限值" labelAlign="right">
                <a-input v-model:value="addForm.upperLimit" class="form_item_box" />
              </a-form-item>
              <a-form-item label="告警下限值" labelAlign="right">
                <a-input v-model:value="addForm.lowerLimit" class="form_item_box" />
              </a-form-item>
              <a-form-item label="量程上限值" labelAlign="right">
                <a-input v-model:value="addForm.upperRange" class="form_item_box" />
              </a-form-item>
              <a-form-item label="量程下限值" labelAlign="right">
                <a-input v-model:value="addForm.lowerRange" class="form_item_box" />
              </a-form-item>
            </div>
            <div class="form_box ml-2">
              <a-form-item label="所属规范" labelAlign="right">
                <!-- <a-input v-model:value="addForm.paraStandard" class="form_item_box" /> -->
                <a-select
                  v-model:value="addForm.paraStandard"
                  placeholder="所属规范"
                  allowClear
                  show-search
                  class="search_input form_item_box"
                >
                  <template #prefix>
                    <SearchOutlined />
                  </template>
                  <a-select-option
                    v-for="(item, i) in paraStandardOption"
                    :key="i"
                    :value="item.dictValue"
                  >
                    {{ item.dictLabel }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="参数单位" labelAlign="right">
                <a-input v-model:value="addForm.paraUnit" class="form_item_box" />
              </a-form-item>
              <a-form-item label="统计单位" labelAlign="right">
                <a-input v-model:value="addForm.statsUnit" class="form_item_box" />
              </a-form-item>
              <a-form-item label="流程分类" labelAlign="right">
                <a-select
                  v-model:value="addForm.processType"
                  placeholder="流程分类"
                  allowClear
                  show-search
                  class="search_input form_item_box"
                >
                  <template #prefix>
                    <SearchOutlined />
                  </template>
                  <a-select-option
                    v-for="(item, i) in processTypeOption"
                    :key="i"
                    :value="item.dictValue"
                  >
                    {{ item.dictLabel }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="传感器编码生成策略" labelAlign="right">
                <a-select
                  v-model:value="addForm.genStrategy"
                  placeholder="传感器编码生成策略"
                  allowClear
                  show-search
                  class="search_input form_item_box"
                >
                  <template #prefix>
                    <SearchOutlined />
                  </template>
                  <a-select-option
                    v-for="(item, i) in genStrategyOption"
                    :key="i"
                    :value="parseInt(item.dictValue)"
                  >
                    {{ item.dictLabel }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="备注" labelAlign="right" style="padding-left: 128px">
                <a-input v-model:value="addForm.remarks" class="form_item_box" />
              </a-form-item>
            </div>
          </div>
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
    getCodeListData,
    addCodeData,
    editCodeData,
    delCodeData,
    getDictData,
  } from '@/api/systemSetting/systemManage/code.js';

  const fieldValue = reactive({});
  const genStrategyOption = ref([]);
  const processTypeOption = ref([]);
  const paraStandardOption = ref([]);
  const tableDictData = ref({});

  const showModel = ref(false);
  const addForm = ref({});

  const saveDictData = async () => {
    if (addForm.value.paraCode == '') {
      message.error('参数类型名称不能为空');
    } else if (addForm.value.paraName == '') {
      message.error('参数类型编码不能为空');
    } else {
      let param = { ...addForm.value };
      param.upperLimit = addForm.value.upperLimit === '' ? 9999 : addForm.value.upperLimit;
      param.lowerLimit = addForm.value.lowerLimit === '' ? -9999 : addForm.value.lowerLimit;
      param.upperRange = addForm.value.upperRange === '' ? 9999 : addForm.value.upperRange;
      param.lowerRange = addForm.value.lowerRange === '' ? -9999 : addForm.value.lowerRange;
      if (!showEdit.value) {
        const { data } = await addCodeData(param);
        if (data.code === 200) {
          showModel.value = false;
          message.success('保存成功');
          search();
        } else {
          message.error('保存失败，请检查');
        }
      } else {
        const { data } = await editCodeData(param);
        if (data.code === 200) {
          showModel.value = false;
          message.success('保存成功');
          search();
        } else {
          message.error('保存失败，请检查');
        }
      }
    }
  };

  const addData = () => {
    showModel.value = true;
    addForm.value = {
      paraUnit: '',
      paraStandard: '',
      isAccumulate: '',
      lowerLimit: '',
      genStrategy: '',
      paraName: '',
      paraCode: '',
      statsUnit: '',
      isSwitch: '',
      upperLimit: '',
      processType: '',
      upperRange: '',
      lowerRange: '',
      remarks: '',
    };
  };

  const addValue = ref(false);

  const showEdit = ref(false);
  const editData = (val) => {
    showModel.value = true;
    showEdit.value = true;
    addForm.value = val;
    // addForm.value.upperLimit = val.upperLimit == 9999 ? '' : val.upperLimit;
    // addForm.value.lowerLimit = val.lowerLimit == -9999 ? '' : val.lowerLimit;
    // addForm.value.upperRange = val.upperRange == 9999 ? '' : val.upperRange;
    // addForm.value.lowerRange = val.lowerRange == -9999 ? '' : val.lowerRange;
  };
  watch(showModel, () => {
    if (!showModel.value) {
      showEdit.value = false;
      addValue.value = true;
    }
  });
  const delData = async (val) => {
    const { data } = await delCodeData(val.paraId);
    if (data.code === 200) {
      message.success('删除成功');
      search();
    }
  };

  const getDict = async () => {
    const { data: genStrategy } = await getDictData('gen_strategy');
    genStrategyOption.value = genStrategy.data.records;
    tableDictData.value.genStrategy = genStrategy.data.records;
    const { data: processType } = await getDictData('process_type');
    processTypeOption.value = processType.data.records;
    tableDictData.value.processType = processType.data.records;
    const { data: paraStandard } = await getDictData('param_standard');
    paraStandardOption.value = paraStandard.data.records;
  };

  const onSubmit = async (params) => {
    Object.keys(params).forEach((key) => {
      fieldValue[key] = params[key];
    });
    search();
  };

  const { current, size, total, dataSource, loading, search, setPagination } = useInitTable(
    fieldValue,
    getCodeListData,
    {
      // 初始化接口调用前回调
      onMountedBeforeCheckFunc: () => {
        loading.value = true;
      },
      // 初始化接口调用后回调
      onMountedAfterCheckFunc: () => {
        // 模拟接口延迟加载效果
        loading.value = false;
        getDict();
      },
    },
  );
</script>
<style scoped>
  .dict_body {
    margin-top: 12px;
    width: 100%;
  }
  .form_item_box {
    width: 250px;
  }
  .form_box {
    width: 420px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
</style>
