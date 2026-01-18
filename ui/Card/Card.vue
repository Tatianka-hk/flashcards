<template>
    <div class="flip-container relative" @click="onClick">
        <div
            class="flex justify-end w-full absolute top-3 z-10 pr-2"
            v-if="canListen"
        >
            <SoundButton :value="card.front" :lang="lang" />
        </div>
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

const props = withDefaults(
    defineProps<{
        card: ICard
        canSeeBack?: boolean
        lang?: string
        canListen?: boolean
    }>(),
    {
        canSeeBack: true,
        lang: 'en',
        canListen: false,
    }
)

const frontSide = ref(true)

const onClick = () => {
    if (!props.canSeeBack) return
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
