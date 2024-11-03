import useDictStore from '@/store/modules/dict'
import { getDicts } from '@/api/system/dict/data'

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach((dictType, index) => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else {
        getDicts(dictType).then(resp => {
          res.value[dictType] = resp.data.map(p => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass, elTagClass: p.cssClass }))
          useDictStore().setDict(dictType, res.value[dictType]);
        })
      }
    })
    return toRefs(res.value);
  })()
}

export const convertArea = (data) => {
  const columns = [];
  const areaObj = {};
  data.forEach((item) => {
    let province = areaObj[item.provinceCode];
    if (!province) {
      province = {
        label: item.provinceName,
        value: item.provinceCode,
        children: {}
      }
    }
    let city = province.children[item.cityCode];
    if (!city) {
      city = {
        label: item.cityName,
        value: item.cityCode,
        children: {}
      }
    }
    let county = city.children[item.countyCode];
    if (item.countyCode && !county) {
      county = {
        label: item.countyName,
        value: item.countyCode
      }
      city.children[item.countyCode] = county;
    }

    province.children[item.cityCode] = city;
    areaObj[item.provinceCode] = province;
  });

  Object.keys(areaObj).forEach((provinceCode) => {
    const column = areaObj[provinceCode];
    column.children = Object.keys(column.children).map((cityCode) => column.children[cityCode]);
    column.children.forEach((city) => {
      city.children = Object.keys(city.children).map((countyCode) => city.children[countyCode]);
    });
    columns.push(column);
  })
  return columns;
}