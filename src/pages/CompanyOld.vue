<script>
import {
  mapState, mapGetters, mapMutations, mapActions,
} from 'vuex';
import {
  UiButton,
  UiPageHeader,
  UiHeader,
  UiModal,
} from '@protocol-one/ui-kit';
import Notifications from '@/mixins/Notifications';
import MerchantForm from '@/components/MerchantForm.vue';

export default {
  components: {
    UiButton,
    UiPageHeader,
    UiHeader,
    UiModal,
    MerchantForm,
  },
  mixins: [Notifications],

  asyncData({ store }) {
    return Promise.all([
      store.dispatch('User/Merchant/fetchMerchantPaymentMethods'),
      store.dispatch('User/Merchant/fetchAgreement'),
    ]);
  },

  data() {
    return {
      isSaveBlockerDialogOpen: false,
      defaultStep: 'basicInfo',
      currentStep: '',
    };
  },

  computed: {
    ...mapState('User/Merchant', [
      'merchant', 'paymentMethods', 'agreementDocument', 'paymentMethodsSort',
    ]),
    ...mapGetters('User/Merchant', ['isMerchantChanged']),

    isSavingLocked() {
      return this.merchant.status !== 0;
    },
  },

  beforeRouteUpdate(to, from, next) {
    this.applyQueryParams(to);
    next();
  },

  created() {
    this.applyQueryParams(this.$route);
  },

  methods: {
    ...mapActions(['setIsLoading']),
    ...mapActions('User/Merchant', [
      'updateMerchant',
      'changeMerchantAgreement',
      'fetchMerchantPaymentMethods',
    ]),
    ...mapMutations('User/Merchant', {
      setPaymentMethodsSort: 'paymentMethodsSort',
    }),

    applyQueryParams(route) {
      this.currentStep = route.query.step || this.defaultStep;
    },

    handleSectionChange(step) {
      this.$router.push({ query: { step } });
    },

    async saveMerchant() {
      this.setIsLoading(true);
      try {
        await this.updateMerchant();
        this.$_Notifications_showSuccessMessage('Merchant updated successfully');
      } catch (error) {
        console.warn(error);
        this.$_Notifications_showErrorMessage('Failed to update merchant');
      }
      this.setIsLoading(false);
    },

    async validateAndSaveMerchant() {
      if (this.isSavingLocked) {
        this.isSaveBlockerDialogOpen = true;
        return;
      }
      const isMerchantValid = this.$refs.merchantForm.chekIfFormValid();

      if (isMerchantValid) {
        await this.saveMerchant();
      } else {
        this.$_Notifications_showErrorMessage('The form is not filled right');
      }
    },

    async handleStatusChangeRequest(payload) {
      this.setIsLoading(true);
      try {
        await this.changeMerchantAgreement(payload);

        this.$_Notifications_showSuccessMessage('Merchant status updated successfully');
      } catch (error) {
        console.warn(error);
        this.$_Notifications_showErrorMessage('Failed to update merchant status');
      }
      this.setIsLoading(false);
    },

    async handlePaymentMethodsSort(sort) {
      this.setIsLoading(true);
      try {
        this.setPaymentMethodsSort(sort);
        await this.fetchMerchantPaymentMethods();
      } catch (error) {
        console.warn(error);
      }
      this.setIsLoading(false);
    },

    saveMerchantIfChanged() {
      if (!this.isSavingLocked && this.isMerchantChanged) {
        this.saveMerchant();
      }
    },
  },
};
</script>

<template>
  <div>
    <UiPageHeader
      title="Company"
    >
      <UiButton
        slot="right"
        text="Save"
        @click="validateAndSaveMerchant"
      />
    </UiPageHeader>
    <MerchantForm
      ref="merchantForm"
      :merchant="merchant"
      :paymentMethods="paymentMethods"
      :currentStep="currentStep"
      :agreementDocument="agreementDocument"
      :paymentMethodsSort="paymentMethodsSort"
      @stepChanged="handleSectionChange"
      @requestAgreementChange="handleStatusChangeRequest"
      @sortPaymentMethods="handlePaymentMethodsSort"
      @requestMerchantSave="saveMerchantIfChanged"
    />

    <UiModal v-if="isSaveBlockerDialogOpen" @close="isSaveBlockerDialogOpen = false">
      <div class="dialog" slot="main">
        <UiHeader level="2" :hasMargin="true">Saving is locked</UiHeader>
        <p v-if="merchant.status === 4">
          Licence agreement is signed with current data.<br />
          Only administrators are able to change it now.
        </p>
        <p v-else>
          You need to
          <router-link to="/company?step=licenseAgreement">revoke your application</router-link>
          for agreement first.
        </p>
        <div class="dialog__controls">
          <UiButton @click="isSaveBlockerDialogOpen = false">OK</UiButton>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<style lang="scss" scoped>
.dialog {
  width: 450px;
  color: #b1b1b1;

  &__controls {
    margin-top: 5px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
