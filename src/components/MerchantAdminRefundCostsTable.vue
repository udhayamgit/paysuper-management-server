<script>
import { find, cloneDeep } from 'lodash-es';
import ClickOutside from 'vue-click-outside';
import PaymentMethodsTable from '@/mixins/PaymentMethodsTable';
import ExpandableCellText from '@/components/ExpandableCellText.vue';
import ComplexTable from '@/components/ComplexTable.vue';
import ComplexTableRow from '@/components/ComplexTableRow.vue';
import ComplexTableCell from '@/components/ComplexTableCell.vue';
import OpenerCorner from '@/components/OpenerCorner.vue';
import SimpleMenuItem from '@/components/SimpleMenuItem.vue';

export default {
  name: 'MerchantAdminRefundCostsTable',
  mixins: [PaymentMethodsTable],

  components: {
    ComplexTable,
    ComplexTableRow,
    ComplexTableCell,
    ExpandableCellText,
    OpenerCorner,
    SimpleMenuItem,
  },

  directives: {
    ClickOutside,
  },

  props: {
  },

  data() {
    const refundCostsItem = {
      fee: {
        value: '1',
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
      fixedFee: {
        value: '1',
        hasChanges: false,
        hasError: false,
        hasFocus: false,
      },
      payoutParty: 'paysuper',
      isPayoutPartyMenuOpened: false,
    };
    return {
      activeFieldNames: ['fee', 'fixedFee'],
      refundCosts: [
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'Visa',
          icon: 'IconVisa',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'Mastercard',
          icon: 'IconMastercard',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'QIWI',
          icon: 'IconQiwi',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'Ali Pay',
          icon: 'IconAliPay',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'Webmoney',
          icon: 'IconWebmoney',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
        {
          ...(cloneDeep(refundCostsItem)),
          method: 'Yandex Money',
          icon: 'IconYandexMoney',
          isExpanded: false,
          items: [
            cloneDeep(refundCostsItem),
            cloneDeep(refundCostsItem),
          ],
        },
      ],

      payoutPartyList: [
        {
          label: 'Pay Super',
          value: 'paysuper',
        },
        {
          label: 'Merchant',
          value: 'merchant',
        },
      ],
    };
  },

  computed: {
    refundCostsFlattened() {
      return this.$_PaymentMethodsTable_flattenDataList(this.refundCosts, 'method');
    },
  },

  methods: {
    moveFocus(index, fieldName, focusMoveDirection) {
      this.$_PaymentMethodsTable_moveFocus({
        index,
        fieldName,
        focusMoveDirection,
        activeFieldNames: this.activeFieldNames,
        flattenedDataList: this.refundCostsFlattened,
      });
    },

    closePayoutPartyMenu(data) {
      data.isPayoutPartyMenuOpened = false;
    },

    getPayoutPartyLabel(data) {
      return find(this.payoutPartyList, { value: data.payoutParty }).label;
    },

    handlePayoutPartyMenuItemClick(data, item) {
      if (data.payoutParty === item.value) {
        return;
      }
      data.payoutParty = item.value;
      data.isPayoutPartyMenuOpened = false;
    },
  },
};
</script>

<template>
<ComplexTable>
  <ComplexTableRow :isHead="true">
    <ComplexTableCell class="cell _method" align="left">Payment Method</ComplexTableCell>
    <ComplexTableCell class="cell _currency">Payout currency</ComplexTableCell>
    <ComplexTableCell class="cell _region">Region</ComplexTableCell>
    <ComplexTableCell class="cell _country">Country</ComplexTableCell>
    <ComplexTableCell class="cell _fee">Fee, %</ComplexTableCell>
    <ComplexTableCell class="cell _fee">Fixed fee</ComplexTableCell>
    <ComplexTableCell class="cell _fee">Refund fee payout party</ComplexTableCell>
  </ComplexTableRow>
  <template
    v-for="(data, index) in refundCostsFlattened"
  >
    <ComplexTableRow
      :key="index"
      :isPainted="index % 2 === 1"
    >
      <ComplexTableCell
        class="cell _method"
        :class="{ '_leading': !data.parent}"
        align="left"
        :isCollapsed="!!data.parent"
        :hasChanges="$_PaymentMethodsTable_getIsGroupHasChanges(data, activeFieldNames)"
        @click.native="data.isExpanded = !data.isExpanded"
      >
        <ExpandableCellText
          v-if="!data.parent"
          :isOpened="data.isExpanded"
        >
          <component :is="data.icon" class="method-icon" />
          {{ data.method }}
        </ExpandableCellText>
      </ComplexTableCell>
      <ComplexTableCell class="cell _currency">USD</ComplexTableCell>
      <ComplexTableCell class="cell _region">EU</ComplexTableCell>
      <ComplexTableCell class="cell _country">United States</ComplexTableCell>
      <ComplexTableCell
        class="cell _fee"
        v-bind="$_PaymentMethodsTable_getEditableCellProps(data.fee)"
        @toggleFocus="data.fee.hasFocus = $event"
        @moveFocus="moveFocus(index, 'fee', $event)"
        @change="$_PaymentMethodsTable_handleCellChange(data.fee, $event)"
        mask="###"
      >
        {{ $_PaymentMethodsTable_getCellText(data.fee.value, '%') }}
      </ComplexTableCell>
      <ComplexTableCell
        class="cell _fee"
        v-bind="$_PaymentMethodsTable_getEditableCellProps(data.fixedFee)"
        @toggleFocus="data.fixedFee.hasFocus = $event"
        @moveFocus="moveFocus(index, 'fixedFee', $event)"
        @change="$_PaymentMethodsTable_handleCellChange(data.fixedFee, $event)"
        mask="NNNNNN"
      >
        {{ $_PaymentMethodsTable_getCellText(data.fixedFee.value, '$') }}
      </ComplexTableCell>
      <ComplexTableCell
        class="cell _payout-party"
        @click.native="data.isPayoutPartyMenuOpened = !data.isPayoutPartyMenuOpened"
        v-click-outside="() => closePayoutPartyMenu(data)"
      >
        <div class="payout-party">
          {{getPayoutPartyLabel(data)}}
          <OpenerCorner :isOpened="data.isPayoutPartyMenuOpened" />
        </div>

        <UiTip
          class="dropdown"
          innerPosition="right"
          position="bottom"
          width="180px"
          :visible="data.isPayoutPartyMenuOpened"
          :closeDelay="0"
          :stayOpenedOnHover="false"
        >
          <SimpleMenuItem
            v-for="item in payoutPartyList"
            v-text="item.label"
            :key="item.value"
            :isCurrent="data.payoutParty === item.value"
            @click.native.stop="handlePayoutPartyMenuItemClick(data, item)"
          />
        </UiTip>
      </ComplexTableCell>
    </ComplexTableRow>
  </template>

</ComplexTable>
</template>

<style lang="scss" scoped>
.cell {
  &._method {
    width: 30%;

    &._leading {
      cursor: pointer;
    }
  }
  &._currency {
    width: 7%;
  }
  &._region {
    width: 7%;
  }
  &._country {
    width: 18%;
  }
  &._fee {
    width: 8%;
  }
  &._payout-party {
    width: 18%;
    cursor: pointer;
    position: relative;
  }
}
.method-icon {
  width: 32px;
  height: 18px;
  margin-right: 4px;
}
.payout-party {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 9px;
}
.dropdown {
  top: calc(100% + 4px);
}
</style>
