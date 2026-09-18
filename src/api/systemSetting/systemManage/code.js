import axiosInstance from '@/plugins/axios';
import { fieldIsNull } from '@/utils/index.js';

export const getCodeListData = ({ current, size, paraName, paraCode }) => {
  return axiosInstance.get(
    `/monitorParameterCode/page?current=${current}&size=${size}${fieldIsNull(
      paraName,
      'paraName',
    )}${fieldIsNull(paraCode, 'paraCode')}`,
  );
};

export const getAllCodeListData = (params) => {
  return axiosInstance.get('/monitorParameterCode/page', {
    params,
  });
};

export const addCodeData = (body) => {
  return axiosInstance.post('/monitorParameterCode/add', body);
};

export const editCodeData = (body) => {
  return axiosInstance.post('/monitorParameterCode/edit', body);
};

export const delCodeData = (id) => {
  return axiosInstance.post(`/monitorParameterCode/del?paraId=${id}`);
};

export const getDictData = (dictType) => {
  return axiosInstance.get(`/dict/page?current=1&size=100${fieldIsNull(dictType, 'dictType')}`);
};
