<template>
    <div class="payment">
        <h4>Order id: {{ orderId }}</h4><br>
        <h3>Please select payment type: </h3><br>
        <b-form-select class="paymentServicesFormSelect" v-model="paymentTypeSelected" :options="paymentTypes" v-on:change="onQtySelectedChanged()" /><br>        
        <b-button class="actionBtn" size="sm" @click="pay()">Pay</b-button>&emsp;
        <b-button class="actionBtn" size="sm" @click="cancelPayment()">Cancel Payment</b-button>
    </div>
</template>

<script>
import { timer } from 'rxjs'
import axios from 'axios'

export default {
    name: "Payment",
    props: [],
    data() {
        return {
            paymentTypes: [],
            qtySelected: 1,
            paymentTypeSelected: 'A',
            orderId: this.$route.params.orderId
        }
    },
    methods: {
        pay() {
            const url = this.orderApiUrl + '/pay';
            var data, data2;
            axios.post(url, {
                orderId: this.orderId,
                paymentType: this.paymentTypeSelected
            }, 
            {
                headers: {
                    'Content-type': 'application/json',
                }
            })
            .then(res => {
                data = res.data;            

                if(data.code == 1) {
                    this.showWarningAlert(data.msg, data.processTimeInSec, true); 
                    const processTimeInMilliSec = data.processTimeInSec * 1000;

                    timer(processTimeInMilliSec).subscribe(() => {                        
                        const updateStatusUrl = this.orderApiUrl + '/updateStatus';

                        axios.put(updateStatusUrl, {
                            orderId: this.orderId,
                            statusId: '3'
                        }, {
                            headers: {
                                'Content-type': 'application/json',
                            }
                        })
                        .then(res2 => {
                            data2 = res2.data;
                            this.showWarningAlert(data2, 5, false);
                        })
                        .catch(err2 => this.errors.push(err2));
                    });
                } else if (data.code == -1) {
                    this.showWarningAlert(data.msg, 5, false);
                }               

                this.redirect.orders();
            })
            .catch(err => this.errors.push(err));
        },

        cancelPayment() {
            this.redirect.orders();
        },

        showWarningAlert(msg, secs, showTimer) {    
            this.$emit('showWarningAlert', msg, secs, showTimer);
        }

    },
    mounted() {
        const url = this.paymentApiUrl + '/getAllServices';
        timer(0, 5000).subscribe(() => {
            axios.get(url)
            .then(res => {
                this.paymentTypes = res.data.map(i => i.type);
                })
            .catch(err => this.errors.push(err));
        });
    },
}
</script>

<style lang="scss" scoped>
.paymentServicesFormSelect {
    width: 100px;
}

.actionBtn {
    margin-top: 25px;
}
</style>