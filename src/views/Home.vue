<script setup lang="ts">
import HeaderComponent from '@/components/utils/HeaderComponent.vue'
import HomeMain from '@/components/HomeComponents/HomeMain.vue';
import ContactForm from '@/components/utils/ContactForm.vue';
import FooterComponent from '@/components/utils/FooterComponent.vue';
</script>
<template>
    <div class="container">
        <HeaderComponent />
        <HomeMain />
        <ContactForm />
        <FooterComponent />
    </div>
</template>
<style scoped lang="scss">
.container {
    min-height: 100lvh;
    display: grid;
    grid-template-rows: auto 1fr auto auto;
}
</style>