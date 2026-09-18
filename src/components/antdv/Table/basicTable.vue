<template>
  <component :is="props.isWrap ? 'a-card' : 'div'" v-bind="getCardProps()">
    <a-form
      v-if="isShowForm"
      ref="formRef"
      name="advanced_search"
      class="ant-advanced-search-form mt-2 custom-table"
      :model="formState"
      @finish="onFinish"
    >
      <a-row :gutter="24">
        <template v-for="(data, index) in searchComps" :key="data.dataIndex">
          <a-col v-show="expand || index <= 2" :span="6">
            <a-form-item :name="data.dataIndex" :label="data.title">
              <component
                :is="data.searchType"
                v-bind="getProps(data)"
                style="width: 100%"
                v-model:value="formState[data.dataIndex]"
                allowClear
              ></component>
            </a-form-item>
          </a-col>
        </template>
        <a-col style="text-align: right" flex="auto">
          <CBtn :showType="BTN_TYPE.search" html-type="submit"></CBtn>
          <a-button style="margin: 0 8px" @click="reset">重置</a-button>
          <a
            style="font-size: 12px"
            @click="expand = !expand"
            v-if="searchComps && searchComps.length > 3"
          >
            <template v-if="expand">
              <UpOutlined />
            </template>
            <template v-else>
              <DownOutlined />
            </template>
            {{ !expand ? '展开' : '收起' }}
          </a>
        </a-col>
      </a-row>
    </a-form>
  </component>
  <component
    :is="props.isWrap ? 'a-card' : 'div'"
    v-bind="getCardProps()"
    :style="{ 'margin-top': isWrap ? '14px' : '' }"
  >
    <basicSkeleton :loading="loading" :data="dataSource" :noData="false">
      <div style="display: flex; justify-content: space-between">
        <div>
          <slot name="header-start"></slot>
        </div>
        <div>
          <slot name="header-end"></slot>
          <CBtn v-if="isAdd" :showType="BTN_TYPE.add" class="mx-2" @click="emits('addFunc')"></CBtn>
        </div>
        <!-- <a-dropdown :trigger="['click']">
        <a-tooltip placement="top">
          <template #title>
            <span>密度</span>
          </template>
          <a-button class="mx-2" :icon="h(ColumnHeightOutlined)" type="link" @click.prevent />
        </a-tooltip>
        <template #overlay>
          <a-menu>
            <a-menu-item key="large"> 默认 </a-menu-item>
            <a-menu-item key="middle"> 中等 </a-menu-item>
            <a-menu-item key="small">紧凑</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown> -->
      </div>
      <template v-if="isShowTable">
        <a-table
          class="mt-3"
          size="small"
          :dataSource="dataSource"
          :columns="props.columns?.filter((item) => !item.hideInTable)"
          :sticky="true"
          :pagination="!props.isCustomPage"
          v-bind="{ ...attrs }"
        >
          <template #bodyCell="{ column, record }">
            <slot name="tableBody" :column="column" :record="record"></slot>
          </template>
        </a-table>
        <div
          class="mt-3"
          style="display: flex; flex-direction: row; justify-content: end"
          v-if="props.isCustomPage"
        >
          <a-pagination
            style="margin-bottom: 10px"
            size="small"
            :total="props.pagination.total"
            :current="props.pagination.current"
            :pageSize="props.pagination.size"
            show-size-changer
            show-quick-jumper
            :show-total="(total) => `共 ${total} 条`"
            @change="changePagination"
          />
        </div>
        <div style="margin-top: -40px; margin-bottom: 10px" v-if="!props.isCustomPage">
          <a-tag color="rgb(47, 84, 235)">总条数</a-tag>{{ props.total || 0 }}条
        </div>
      </template>
    </basicSkeleton>
  </component>
</template>
<script setup name="CustomTable">
  import { ref, reactive, computed, useAttrs, onMounted, watch } from 'vue';
  import { DownOutlined, UpOutlined } from '@ant-design/icons-vue';
  import { BTN_TYPE } from '@/constants';
  import './index.scss';

  const emits = defineEmits(['onSubmit', 'setPagination', 'addFunc']);
  const attrs = useAttrs();

  const expand = ref(false); // 是否展开筛选条件
  const formRef = ref(); // 筛选条件实例
  const formState = reactive({}); // 筛选条件数据
  const isShowForm = ref(false); // 是否显示筛选条件
  const isShowTable = ref(true);

  // 查询抛出条件数据
  const onFinish = () => {
    emits('onSubmit', formState);
  };

  const props = defineProps({
    // 列数据
    columns: {
      type: Array,
    },
    // 表格数据
    dataSource: {
      type: Array,
    },
    // 骨架屏显示
    loading: {
      type: Boolean,
    },
    // 总条数（不使用外带分页组件时使用）
    total: {
      type: Number,
    },
    // 是否显示新增按钮
    isAdd: {
      type: Boolean,
    },
    // 是否自定义分页组件
    isCustomPage: {
      type: Boolean,
      default: false,
    },
    // 表格是否使用card包裹
    isWrap: {
      type: Boolean,
      default: true,
    },
    // 分页参数
    pagination: {
      type: Object,
      default: () => ({
        current: 1,
        size: 10,
        total: 0,
      }),
    },
  });

  // 遍历筛选条件
  const searchComps = computed(() => {
    return props.columns ? props.columns.filter((item) => item.search) : [];
  });

  // 获取筛选条件属性
  const getProps = (data) => {
    const targetProps = {};
    if (data.searchPlaceHolder) {
      targetProps.placeholder = data.searchPlaceHolder;
    }

    if (data.valueEnum) {
      targetProps.options = data.valueEnum;
    }
    return targetProps;
  };

  const changePagination = (page, pageSize) => {
    emits('setPagination', page, pageSize);
  };

  const getCardProps = () => {
    if (props.isWrap) {
      return {
        size: 'small',
        class: 'card-wrap',
      };
    }
    return {};
  };

  const reset = () => {
    formRef.value?.resetFields();
    // emits('onSubmit', formState);
  };

  // 隐藏表格内容
  const switchTableContent = (flag) => {
    isShowTable.value = flag;
  };

  watch(
    () => props.columns,
    () => {
      // 初始化筛选条件数值
      props.columns?.forEach((column) => {
        if (column.search && column.initValue) {
          formState[column.dataIndex] = column.initValue;
        }
      });

      // 初始化筛选显示
      isShowForm.value = props.columns
        ? props.columns.filter((column) => column.search).length > 0
        : false;
    },
  );

  onMounted(() => {
    // 初始化筛选条件数值
    props.columns?.forEach((column) => {
      if (column.search && column.initValue) {
        formState[column.dataIndex] = column.initValue;
      }
    });

    // 初始化筛选显示
    isShowForm.value = props.columns
      ? props.columns.filter((column) => column.search).length > 0
      : false;
  });

  defineExpose({
    formState,
    switchTableContent,
  });
</script>
