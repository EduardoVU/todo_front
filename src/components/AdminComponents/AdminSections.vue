<script setup lang="ts">
import { useHistoryStore } from '@/stores/History';
import { computed } from 'vue';
import BenefactorFormEdit from '../BenefactorComponents/BenefactorFormEdit.vue';

const historyStore = useHistoryStore();
const historyOption = computed(() => historyStore.historyOption);


</script>

<template>
    <section>
        <template v-if="historyOption === 'mi perfil'">
            <BenefactorFormEdit />
        </template>
    </section>
</template>

<style scoped lang="scss"></style>