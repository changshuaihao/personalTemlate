import axiosInstance from '@/plugins/axios';
import { getSortParam } from '@/utils';

/**
 * 分页查询流域信息
 * @param {*} basinName 流域名称
 */
export const getBasinByPageApi = (params) =>
  axiosInstance.get(
    `/basin/page?${getSortParam([
      {
        field: 'insertTime',
        asc: false,
      },
    ])}`,
    {
      params,
      headers: {
        common: {
          Authorization:
            'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3ZHAzIiwidXNlcklkIjoiNGYzOTE3NWU3NGYzMDQ4Njg2YzdlMjc4MGZkNjc1YzYiLCJ0ZW5hbnRJZCI6IjRmMmMzOTNmNzk2MWI3YmNkMDU2YTgyMzhiN2MxYzE4Iiwicm9sZUlkcyI6WyJmM2E1MGM4NWIyY2U5ODU0YzBhOTk2NjNhMzBlZmNiZCJdLCJvZmZpY2VJZCI6ImViMmJkOGM2NTAyMGJmYzYwNzE5MDM5MmQ3ZDQyZjJhIiwib2ZmaWNlVHlwZSI6IjIiLCJpYXQiOjE3MDkzNDY2MzMsImV4cCI6MTcwOTk1MTQzM30.Z-JxlvoO8LxjkHaUDRUvqlo-wai1adbtBjPuR5Y2e4A',
        },
      },
    },
  );

/**
 * 根据id查询流域信息
 * @param {*} basinId 流域id
 * @returns
 */
export const getBasinByIdApi = (basinId) =>
  axiosInstance.get('/basin/getById', {
    params: {
      basinId,
    },
  });

/**
 * 新增流域
 * @param {*} param 流域对象
 */
export const saveBasinApi = (params) => axiosInstance.post('/basin/add', params);

/**
 * 修改流域
 * @param {*} param 流域对象
 */
export const updateBasinApi = (params) => axiosInstance.post('/basin/edit', params);

/**
 * 删除流域
 * @param {*} basinId
 */
export const deleteBasinApi = (basinId) => axiosInstance.post(`/basin/del?basinId=${basinId}`);
