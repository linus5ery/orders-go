<template>
    <b-container class="ordersList">
        <template v-if="orders.length > 0">
            <b-table class="ordersList center" striped hover :fields="ordersFields" :items="orders">
                <template slot="action" slot-scope="row">
                    <b-button size="sm" @click="row.toggleDetails" v-on:click="detailsBtnClicked()">
                        {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
                    </b-button>
                </template>

                <template slot="row-details" slot-scope="row">
                    <b-card>
                        <ul>
                            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                        </ul>
                        <template v-if="ordersType == 'created'">
                            <b-button class="actionBtn" size="sm" @click="redirectToPayment(row.item._id)">Pay Order</b-button>
                        </template>
                        <b-button class="actionBtn" size="sm" @click="cancelOrder(row.item._id)">Cancel Order</b-button>
                    </b-card>
                </template>
            </b-table>
        </template>
        <template v-else>
            <h4><span class="capitalize">{{ ordersType }}</span> orders are not available.</h4>
        </template>
    </b-container>
</template>

<script>
import { timer } from 'rxjs'
import axios from 'axios'
import moment from 'moment'

export default {
    name: "OrdersList",
    props: ["ordersType"],
    data() {
        return {
            ordersFields: [
                {
                    key: '_id',
                    label: 'ID'
                },
                {
                    key: 'createdDate',
                    label: 'Created Date'
                },
                {
                    key: 'totalQty',
                    label: 'Total Quantity'
                },
                {
                    key: 'totalAmount',
                    label: 'Total Amount (RM)'
                },
                {
                    key: 'status',
                    label: 'Status'
                },
                {
                    key: 'action'
                }
            ],
            orders: [],
            orderDetailsExpanded: [],
            orderDetailsExpanded1: false,
            errors: [],
        }
    },
    methods: {
        detailsBtnClicked() {
            this.orderDetailsExpanded1 != this.orderDetailsExpanded1;
        },

        redirectToPayment(_id) {
            this.redirect.payment(_id);
        },

        cancelOrder(_id) {
            var msg;
            const url = this.orderApiUrl + '/cancel';
            axios.delete(url, {data: {orderId: _id}}, {
                headers: {
                    'Content-type': 'application/json',
                }
            })
            .then(res => {
                msg = res.data;
                this.showWarningAlert(msg, 5, false);
            })
            .catch(err => this.errors.push(err));
        },

        showWarningAlert(msg, secs, showTimer) {
            this.$emit('showWarningAlert', msg, secs, showTimer)
        },        
    },
    mounted() {
        const url = this.orderApiUrl + '/getAll';
        timer(0, 5000).subscribe(()=> {
            axios.get(url)
            .then(res => {
                this.orders = res.data;
                this.orders = this.orders.filter(i => i.status == this.ordersType);
                this.orders.sort((a, b) => (a.createdDate > b.createdDate) ? 1 : -1);
                this.orders.map(i => i.createdDate =  moment(String(i.createdDate))
                                                        .format('DD-MM-YYYY hh:mm:ss'));

                
                if(this.orderDetailsExpanded.length <= 0) {
                    for(var i = 0; i < this.orders.length; i++) {
                        this.orderDetailsExpanded[i] = false;
                    }
                }
            })
            .catch(err => this.errors.push(err));
        });
    },
}
</script>

<style lang="scss" scoped>
div.ordersList {
    min-height: 400px;
    height: 100%;

    table.ordersList {
        background: white;
        width: 90%;
        border-radius: 20px;
        text-align: left;
    }

    .actionBtn {
        margin-left: 20px;
    }

    .capitalize {
        text-transform: capitalize;
    }
}
</style>
