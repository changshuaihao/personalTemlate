<template>
  <a-skeleton :loading="props.loading" active>
    <slot v-if="slotDefault && !props.isChart"></slot>
  </a-skeleton>
  <slot v-if="slotDefault && props.isChart"></slot>
  <NoData v-if="!props.loading && isNoData && props.noData"></NoData>
</template>
<script setup name="BasicSkeleton">
  import { useSlots, computed } from 'vue';
  import { isEmpty, isNullOrUnDef } from '@/utils/is';

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
    isChart: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
    noData: {
      type: Boolean,
      default: true,
    },
  });

  const slotDefault = !!useSlots().default;

  const isNoData = computed(() => {
    return isEmpty(props.data) || isNullOrUnDef(props.data);
  });
</script>
