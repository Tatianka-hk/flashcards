<template>
    <div class="flip-container" @click="onClick">
        <div class="flip-card" :class="{ flipped: !frontSide }">
            <div class="flip-front">
                <CardSide :text="card.front" />
            </div>
            <div class="flip-back">
                <CardSide :text="card.back" />
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import CardSide from './CardSide.vue'
import type { ICard } from '../../types'

defineProps<{
    card: ICard
}>()

const frontSide = ref(true)

const onClick = () => {
    frontSide.value = !frontSide.value
}
</script>
<style scoped>
.flip-container {
    perspective: 1000px;
    width: 222px;
    height: 366px;
}

.flip-card {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.9s;
}

.flip-card.flipped {
    transform: rotateY(180deg);
}

.flip-front,
.flip-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
}

.flip-back {
    transform: rotateY(180deg);
}
</style>
