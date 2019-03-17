<template>
    <div class="card-outline col-12 mt-3">
        <div class="card">
            <div class="card-horizontal">
                <div class="img-square-wrapper">
                    <img class="card-img" :src="require('../../assets/items/' + item.imageName)" alt="Item image">
                </div>
                <div class="card-body">
                    <h4 class="card-title">{{ item.name }}</h4>
                    <p class="card-text">RM{{ item.price }}</p>
                    <b-form-select class="qtyFormSelect" v-model="qtySelected" :options="qtys" v-on:change="onQtySelectedChanged()" /><br>
                    <b-form-checkbox class="itemCheckbox" button button-variant="info"
                    size="md" name="check-button" v-model="itemCheckboxChecked" v-on:input="onItemCheckboxChanged()">
                        {{ !itemCheckboxChecked ? 'Add' : 'Cancel'  }}
                    </b-form-checkbox>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ShopItem",
    props: ["item", "bus"],
    data() {
        return {
            qtys: [
                { value: 1, text: '1' },
                { value: 2, text: '2' },
                { value: 3, text: '3' },
                { value: 4, text: '4' },
                { value: 5, text: '5' }
            ],
            qtySelected: 1,
            itemCheckboxChecked: false
        }
    },
    methods: {
        onQtySelectedChanged() {
            if(this.itemCheckboxChecked) {
                var itemData = this.getItemData();
                this.$emit('updateCart', itemData);
            }
        },        
        onItemCheckboxChanged() {
            this.addToCart();
        },
        addToCart() {
            var itemData = this.getItemData();
            this.$emit('addToCart', itemData);
        },
        getItemData() {
            return {
                _id: this.item._id,
                name: this.item.name,
                price: this.item.price,
                qty: this.qtySelected,
                totalAmount: this.item.price * this.qtySelected
            }
        },
        unChecked() {
            if(this.itemCheckboxChecked)
                this.itemCheckboxChecked = false;
            if(this.qtySelected > 1)
                this.qtySelected = 1;
        },
    },
    mounted() {
        this.bus.$on('unChecked', this.unChecked);
    },  
}
</script>

<style lang="scss" scoped>
// .card {
//     width: 100%;

//     .card-img-top {
//         width: 100%;
//     }
// }

.card {
    // display: inline-block;
    border-radius: 20px;
    -webkit-user-select: none; /* Safari */        
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */


    .card-horizontal {
        display: flex;
        flex: 1 1 auto;

        .img-square-wrapper {

            img  {
                height: 200px;
                width: 200px;
            }
        } 

        .card-body {
            height: 100%;
            width: 225px;
        }

        .card-text, .card-title {
            font-weight: bold;
            -webkit-user-select: text; /* Safari */        
            -moz-user-select: text; /* Firefox */
            -ms-user-select: text; /* IE10+/Edge */
            user-select: text; /* Standard */
        }

        .qtyFormSelect {
            width: 100px;
        }

        .itemCheckbox {
            margin-top: 10px;
        }
    }
}
</style>