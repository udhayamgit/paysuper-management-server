
import axios from 'axios';
import { get } from 'lodash-es';
import Centrifuge from 'centrifuge';
import mergeApiValuesWithDefaults from '@/helpers/mergeApiValuesWithDefaults';
import router from '@/router';

function getDefaultProfileData() {
  return {
    personal: {
      first_name: '',
      last_name: '',
      position: '',
    },
    help: {
      product_promotion_and_development: false,
      released_game_promotion: false,
      international_sales: false,
      other: false,
    },
    company: {
      company_name: '',
      website: '',
      annual_income: null,
      number_of_employees: null,
      kind_of_activity: '',
      monetization: {
        paid_subscription: false,
        in_game_advertising: false,
        in_game_purchases: false,
        premium_access: false,
        other: false,
      },
      platforms: {
        pc_mac: false,
        game_console: false,
        mobile_device: false,
        web_browser: false,
        other: false,
      },
    },
    last_step: '',
    created_at: null,
    updated_at: null,
  };
}

export default function createUserStore() {
  return {
    state: {
      profile: null,
      currentStepCode: 'personal',
    },

    mutations: {
      profile(state, value) {
        const defaultProfile = getDefaultProfileData();
        const profile = mergeApiValuesWithDefaults(defaultProfile, value);
        state.profile = profile;
      },
      currentStepCode(state, value) {
        state.currentStepCode = value;
      },
    },

    actions: {
      async initState({ dispatch }) {
        return dispatch('fetchProfile');
      },

      async fetchProfile({ dispatch, commit, rootState }) {
        try {
          const { data } = await axios.get(`${rootState.config.apiUrl}/admin/api/v1/user/profile`, {
            headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
          });
          if (data.email.confirmed) {
            dispatch('redirectToDashboard');
            return;
          }
          commit('profile', data);
          if (data.last_step) {
            commit('currentStepCode', data.last_step);
          }
        } catch (error) {
          if (get(error, 'response.status') !== 404) {
            console.error(error);
          }
          commit('profile', {});
        }
      },

      async updateProfile({ rootState, commit }, props) {
        try {
          const { data } = await axios.patch(
            `${rootState.config.apiUrl}/admin/api/v1/user/profile`,
            props,
            {
              headers: { Authorization: `Bearer ${rootState.User.accessToken}` },
            },
          );
          commit('profile', data);
        } catch (error) {
          console.error(error);
          throw new Error(
            get(error, 'response.data.message', 'Unknown error'),
          );
        }
      },

      setCurrentStepCode({ commit }, value) {
        commit('currentStepCode', value);
      },

      initWaitingForEmailConfirm({ state, dispatch, rootState }) {
        const centrifuge = new Centrifuge(rootState.config.websocketUrl);
        centrifuge.setToken(state.profile.centrifugo_token);
        centrifuge.subscribe(`paysuper:user#${state.profile.id}`, ({ data }) => {
          if (data.code === 'op000005') {
            dispatch('redirectToDashboard');
          }
        });
        centrifuge.connect();
      },

      redirectToDashboard() {
        router.push({ path: '/dashboard' });
      },
    },

    namespaced: true,
  };
}
