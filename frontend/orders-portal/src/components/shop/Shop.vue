<template>
    <div class="shop">
        <div class="row d-flex justify-content-center">
            <div v-bind:key="item._id" v-for="item in items">
                <ShopItem :item="item" :bus="bus" @addToCart = "addToCart" @updateCart = "updateCart" @showAlert = "showAlert" />
            </div>
        </div>
        <h4 class="cartInfo"><b>Total Quantity: {{ totalQty }}&emsp; Total Amount: RM{{ totalAmount }}</b></h4>
        <button type="button" class="actionBtn btn btn-primary btn-lg" v-on:click="placeOrder()">Place Order</button>&emsp;
        <button type="button" class="actionBtn btn btn-warning btn-lg" v-on:click="clearCart()">Clear</button>    
    </div>
</template>

<script>
import Vue from 'vue'
import ShopItem from './ShopItem.vue'
import { timer } from 'rxjs';
import axios from 'axios';

export default {
    name: "Shop",
    components: {
        ShopItem
    },
    props: [],
    data() {
        return {
            bus: new Vue(),
            items: [],
            cart: [],
            errors: [],
            totalQty: 0,
            totalAmount: 0
        }
    },
    methods: {
        addToCart(item) {
            var index = this.cart.findIndex((p) => { return p._id === item._id });
            if (index >= 0) this.cart.splice(index, 1);
            else this.cart.push(item);
            this.cart.sort((a, b) => (a.name > b.name) ? 1 : -1);
            this.countCartItem();
        },

        updateCart(item) {
            var index = this.cart.findIndex((p) => { return p._id === item._id });
            if (index < 0) return;
            else this.cart.splice(index, 1, item);
            this.countCartItem();
        },

        countCartItem() {
            this.totalQty = 0;
            this.totalAmount = 0;
            if(this.cart.length > 0) {
                for(var i = 0; i < this.cart.length; i++) {
                    this.totalQty += this.cart[i].qty;
                    this.totalAmount += this.cart[i].totalAmount;
                }
            }
        },

        clearCart() {
            this.bus.$emit('unChecked');
        },

        placeOrder() {
            if(this.cart.length <= 0) 
                this.showAlert('Please select at least 1 item.')
            else {
                var orderCart = [];
                for(var i in this.cart) {
                    orderCart.push({
                        'itemId': this.cart[i]._id,
                        'qty': this.cart[i].qty
                    });
                }

                var msg;
                const url = this.orderApiUrl + '/create'
                axios.post(url, {cart: orderCart}, {
                    headers: {
                        'Content-type': 'application/json',
                    }
                })
                .then(res => {
                    msg = res.data;
                    this.showWarningAlert(msg, 5, false);
                })
                .catch(err => this.errors.push(err));
            }
        },

        showAlert(msg) {
            this.$emit('showAlert', msg);            
        },

        showWarningAlert(msg, secs, showTimer) {
            this.$emit('showWarningAlert', msg, secs, showTimer)
        }

    },
    mounted() {
        const url = this.orderApiUrl + '/getAllItems';
        timer(0, 5000).subscribe(() => {
            axios.get(url)
            .then(res => this.items = res.data)
            .catch(err => this.errors.push(err));
        });
    }
}
</script>

<style lang="scss" scoped>
.shop {
    overflow-x: hidden;

    .cartInfo {
        margin-top: 30px;
        font-weight: 400;
    }

    .actionBtn {
        margin-top: 15px;
    }
}
// .row {
//     text-align: center;
// }
</style>
