import axios from 'axios';
import { camelCase, reduce, snakeCase } from 'lodash-es';

export default function createBankingStore() {
  return {
    namespaced: true,
    state: {
      bankingInfo: {
        account_number: '',
        address: '',
        correspondent_account: '',
        currency: '',
        name: '',
        swift: '',
      },
    },
    getters: {
      bankingInfo(state) {
        const { bankingInfo } = state;

        return reduce(bankingInfo, (res, item, key) => ({
          ...res,
          [camelCase(key)]: item,
        }), {});
      },
    },
    mutations: {
      bankingInfo(state, data) {
        state.bankingInfo = data;
      },
    },
    actions: {
      async initState({ commit, rootState }) {
        const { banking } = rootState.User.Merchant.merchant;

        if (banking) {
          commit('bankingInfo', banking);
        }
      },
      async submitBankingInfo({ dispatch, state, rootState }) {
        const { accessToken } = rootState.User;

        const response = await axios.put(
          `${rootState.config.apiUrl}/admin/api/v1/merchants/banking`,
          { ...state.bankingInfo },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        if (response.data) {
          dispatch('Company/completeStep', 'banking', { root: true });
        }
      },
      updateBankingInfo({ commit }, bankingInfo) {
        commit('bankingInfo', reduce(bankingInfo, (res, item, key) => ({
          ...res,
          [snakeCase(key)]: item,
        }), {}));
      },
    },
  };
}
