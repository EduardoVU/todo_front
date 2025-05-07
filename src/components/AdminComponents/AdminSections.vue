<script setup lang="ts">
import { useHistoryStore } from '@/stores/History';
import { computed } from 'vue';
import BenefactorFormEdit from '../BenefactorComponents/BenefactorFormEdit.vue';
import AllHomeworks from '../HomeworksComponents/AllHomeworks.vue';

const historyStore = useHistoryStore();
const historyOption = computed(() => historyStore.historyOption);


</script>

<template>
    <section>
        <AllHomeworks v-if="historyOption === 'Default'"/>
        <BenefactorFormEdit v-if="historyOption === 'mi perfil'" />
    </section>
</template>

<style scoped lang="scss"></style>