<script setup lang="ts">
import AdminHeader from '@/components/AdminComponents/AdminHeader.vue';
import AdminSidemenu from '@/components/AdminComponents/AdminSidemenu.vue';
import AdminSections from '@/components/AdminComponents/AdminSections.vue';
import { onBeforeUnmount } from 'vue';
import { useHistoryStore } from '@/stores/History';

const historyStore = useHistoryStore();

onBeforeUnmount(() => {
    historyStore.setHistoryOption('Default');
});

</script>
<template>
    <section>
        <div class="container">
            <AdminHeader class="admin-header" />
            <AdminSidemenu />
            <AdminSections />
        </div>
    </section>
</template>
<style scoped lang="scss">
.container {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    min-height: 100vh;
}

.admin-header {
    grid-column: 1 / -1;
}
</style>