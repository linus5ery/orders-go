<template>
    <div class="orders">     
        <b-card class="orders-card center" no-body>
            <b-tabs pills card>
                <b-tab title="Created" active>
                    <OrdersList ordersType = "created" @showWarningAlert = "showWarningAlert" />  
                </b-tab>
                <b-tab title="Processing">
                    <OrdersList ordersType = "processing" @showWarningAlert = "showWarningAlert" />  
                </b-tab>
                <b-tab title="Delivered">
                    <OrdersList ordersType = "delivered" @showWarningAlert = "showWarningAlert" />  
                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>

<script>
import OrdersList from './OrdersList.vue'

export default {
    name: "Orders",
    components: {
        OrdersList
    },
    methods: {
        showWarningAlert(msg, secs, showTimer) {
            this.$emit('showWarningAlert', msg, secs, showTimer)
        }
    }
}
</script>

<style lang="scss" scoped>
.orders {
    .msg {
        font-size: 35px;
    }
    
    .orders-card {
        width: 1050px;
    }
}
</style>