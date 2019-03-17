<template>
    <div class="paymentServices">
        <b-table class="paymentServices center" striped hover :fields="fields" :items="paymentServices" />
    </div>
</template>

<script>
import { timer } from 'rxjs'
import axios from 'axios';

export default {
    name: "PaymentServices",
    props: [],
    data() {
        return {
            fields: [
                {
                    key: 'type',
                    label: 'Type'
                },
                {
                    key: 'minItemQty',
                    label: 'Minimum Item Quantity'
                },
                {
                    key: 'minSpendAmount',
                    label: 'Minimum Spending (RM)'
                },
                {
                    key: 'processTimeInSec',
                    label: 'Processing Time (Sec)'
                }
            ],
            paymentServices: [],
            errors: [],
            i: 0
        }
    },
    methods: {
    },
    created() {
        
    },
    mounted() {
        const url = this.paymentApiUrl + '/getAllServices';
        timer(0, 5000).subscribe(() => {
            axios.get(url)
            .then(res => this.paymentServices = res.data)
            .catch(err => this.errors.push(err));
        });
    }
}
</script>

<style lang="scss" scoped>
table.paymentServices {
    background: white;
    width: 90%;
    border-radius: 20px;
    text-align: left;
}
</style>