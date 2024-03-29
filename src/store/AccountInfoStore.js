import axios from 'axios';
import { camelCase, reduce, snakeCase } from 'lodash-es';
// TODO: it will be service, and must be located in DictionariesStore
import citiesByCountry from '@/citiesByCountry';

export default function createAccountInfoStore() {
  return {
    namespaced: true,
    state: {
      accountInfo: {
        address: '',
        address_additional: '',
        alternative_name: '',
        city: '',
        country: '',
        name: '',
        state: '',
        website: '',
        zip: '',
      },
    },
    getters: {
      accountInfo(state) {
        const { accountInfo } = state;

        return reduce(accountInfo, (res, item, key) => ({
          ...res,
          [camelCase(key)]: item,
        }), {});
      },
      cities(state) {
        const currentCountry = state.accountInfo.country || 'US';

        return citiesByCountry[currentCountry] || [];
      },
    },
    mutations: {
      accountInfo(state, data) {
        state.accountInfo = data;
      },
    },
    actions: {
      async initState({ commit, rootState }) {
        const { company } = rootState.User.Merchant.merchant;

        if (company) {
          commit('accountInfo', company);
        }
      },
      async submitAccountInfo({ dispatch, state, rootState }) {
        const { accessToken } = rootState.User;

        const response = await axios.put(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/company`,
          { ...state.accountInfo },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        if (response.data) {
          dispatch('Company/completeStep', 'company', { root: true });
        }
      },
      updateAccountInfo({ commit }, accountInfo) {
        commit('accountInfo', reduce(accountInfo, (res, item, key) => ({
          ...res,
          [snakeCase(key)]: item,
        }), {}));
      },
    },
  };
}
