<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import Notifications from '@/mixins/Notifications';
import MerchantAdminForm from '@/components/MerchantAdminForm.vue';

export default {
  components: {
    MerchantAdminForm,
  },
  mixins: [Notifications],

  asyncData({ store, route }) {
    return store.dispatch('Merchant/fetchMerchantPaymentMethods', route.params.id);
  },

  data() {
    return {
      defaultStep: 'basicInfo',
      currentStep: '',
    };
  },

  computed: {
    ...mapState('Merchant', [
      'merchant', 'paymentMethods', 'agreementDocument', 'paymentMethodsSort',
    ]),
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
    ...mapActions('Merchant', [
      'updateMerchant',
      'changeMerchantAgreement',
      'sendNotification',
      'fetchMerchantPaymentMethods',
    ]),
    ...mapMutations('Merchant', {
      setPaymentMethodsSort: 'paymentMethodsSort',
    }),

    applyQueryParams(route) {
      this.currentStep = route.query.step || this.defaultStep;
    },

    handleSectionChange(step) {
      this.$router.push({ query: { step } });
    },

    async validateAndSaveMerchant() {
      const isMerchantValid = this.$refs.merchantForm.chekIfFormValid();

      if (isMerchantValid) {
        this.setIsLoading(true);
        try {
          await this.updateMerchant();
          this.$_Notifications_showSuccessMessage('Merchant updated successfully');
        } catch (error) {
          console.warn(error);
          this.$_Notifications_showErrorMessage('Failed to update merchant');
        }
        this.setIsLoading(false);
      } else {
        this.$_Notifications_showErrorMessage('The form is not filled right');
      }
    },

    async handleAgreementChangeRequest(payload) {
      this.setIsLoading(true);
      try {
        await this.changeMerchantAgreement(payload);

        this.$_Notifications_showSuccessMessage('Merchant\'s agreement updated successfully');
      } catch (error) {
        console.warn(error);
        this.$_Notifications_showErrorMessage('Failed to update merchant\'s agreement');
      }
      this.setIsLoading(false);
    },

    async handleSendNotification(notification) {
      this.setIsLoading(true);
      try {
        await this.sendNotification(notification);
        this.$_Notifications_showSuccessMessage('Notification sent successfully');
      } catch (error) {
        console.warn(error);
        this.$_Notifications_showErrorMessage('Failed to send notification');
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
  },
};
</script>

<template>
<div>
  <MerchantAdminForm
    ref="merchantForm"
    v-bind="{
      merchant,
      paymentMethods,
      currentStep,
      agreementDocument,
      paymentMethodsSort,
    }"
    @stepChanged="handleSectionChange"
    @requestAgreementChange="handleAgreementChangeRequest"
    @sendNotification="handleSendNotification"
    @sortPaymentMethods="handlePaymentMethodsSort"
    @submitForms="validateAndSaveMerchant"
  />
</div>
</template>
