<template>
  <div>
    <div id="p1payone-form"></div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  async created() {
    const { data } = await axios.get('https://static.protocol.one/paysuper/sdk/dev/paysuper.js');
    const script = document.createElement('script');
    script.innerHTML = data;
    document.head.appendChild(script);
    let request = {
      project: '5cd5620f06ae110001509185',
      products: ['5cda8d3938e0e2000176988b', '5cda8e6738e0e2000176988c'],
    };
    if (this.$route.query.productsCount) {
      request.products = request.products.slice(0, this.$route.query.productsCount);
    }
    if (this.$route.query.pay) {
      const [amount, currency] = this.$route.query.pay.split('-');
      request = {
        project: '5cda856f38e0e20001769886',
        amount: Number(amount),
        currency,
      };
    }

    const paySuper = new window.PaySuper({
      formUrl: '/payform-page/',
      ...request,
    });
    paySuper.renderModal();
  },
};
</script>
