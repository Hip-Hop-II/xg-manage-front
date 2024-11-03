import { getDicts , getAreaList, getBankList } from '@/api/login'
import { convertArea } from '@/utils/dict'

const useDictStore = defineStore(
  'dict',
  {
    state: () => ({
      dict: new Array(),
      bsDicts: {},
      bsDictsMap: {},
      areaList: [],
      bankList: []
    }),
    actions: {
      // 获取字典
      getDict(_key) {
        if (_key == null && _key == "") {
          return null;
        }
        try {
          for (let i = 0; i < this.dict.length; i++) {
            if (this.dict[i].key == _key) {
              return this.dict[i].value;
            }
          }
        } catch (e) {
          return null;
        }
      },
      getBsDict(type, value) {
        return this.bsDicts[type]?.find(d => d.value === value);
      },
      fetchDicts() {
        getDicts().then(res => {
          for (const key in res.data) {
            this.bsDicts[key] = res.data[key].map(v => {
              this.bsDictsMap[key] = Object.assign(this.bsDictsMap[key] || {}, v)
              //
              const _value = Object.entries(v)[0];
              return {
                value: _value[0],
                label: _value[1]
              }
            });
          }
        })
      },
      // 设置字典
      setDict(_key, value) {
        if (_key !== null && _key !== "") {
          this.dict.push({
            key: _key,
            value: value
          });
        }
      },
      // 删除字典
      removeDict(_key) {
        var bln = false;
        try {
          for (let i = 0; i < this.dict.length; i++) {
            if (this.dict[i].key == _key) {
              this.dict.splice(i, 1);
              return true;
            }
          }
        } catch (e) {
          bln = false;
        }
        return bln;
      },
      // 清空字典
      cleanDict() {
        this.dict = new Array();
      },
      // 初始字典
      initDict() {
      },
      getAreaCode() {
        getAreaList().then((res)=> {
          const data = convertArea(res.data)
          this.areaList = data
          localStorage.setItem('areaList', JSON.stringify(data));
        })
      },
      getBankCode() {
        getBankList().then((res)=> {
          this.bankList = res.data
          localStorage.setItem('bankList', JSON.stringify(res.data));
        })
      }
    }
  })

export default useDictStore
