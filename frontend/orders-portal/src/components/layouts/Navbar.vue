<template>
    <nav class="navbar navbar-expand-lg navbar-light">
        <a class="navbar-brand">
            <img src="../../assets/logo.png" class="d-inline-block align-top" alt="">&nbsp;
            <span>OrdersGo</span>
        </a>
        <div class="collapse navbar-collapse center">
            <div class="navbar-nav">
                <router-link class="link nav-item nav-link" v-bind:to="'/'">Shop</router-link>
                <router-link class="link nav-item nav-link" v-bind:to="'/orders'">Orders</router-link>
                <router-link class="link nav-item nav-link" v-bind:to="'/paymentServices'">Payment Services</router-link>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: "Navbar",
    props: []
}
</script>

<style lang="scss" scoped>
.navbar {
    background: #c0c0c0;
    height: 120px;
    
    .navbar-brand {
        font-size: 35px;
        line-height: 100px;
        text-align: center;

        img {
            width: 100px;
            height: 100px;
        }   
    }

    .navbar-nav {
        margin-left: 25px;
        .link {
            font-weight: bold; 
        }
    }
}
</style>