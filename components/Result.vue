<template>
    <div class="w-full flex flex-col items-center justify-center gap-5">
        <div v-if="cards.length">
            <div class="flex gap-4 items-center justify-center">
                <div class="md:w-[110px] h-[100px] w-[50px]">
                    <Arrow
                        label="Previous"
                        v-show="currentIndex > 0"
                        @click="onClick(-1)"
                        class="rotate-180"
                    />
                </div>
                <div>
                    <Card :card="cards[currentIndex]" />
                </div>
                <div class="md:w-[110px] h-[100px] w-[50px]">
                    <Arrow
                        v-show="currentIndex < cards.length - 1"
                        @click="onClick(1)"
                    />
                </div>
            </div>
            <div class="flex items-center justify-center mt-4 gap-4">
                <VButton @click="downloadJSON(cards)">
                    {{ t('button.download') }}
                </VButton>
                <VButton @click="$emit('close')">
                    {{ $t('button.back') }}
                </VButton>
            </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center">
            <MessageItem :message="$t('message.generateCardError')" />
            <VButton @click="$emit('close')"> {{ t('button.back') }} </VButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Arrow, VButton } from '@/ui'
import type { ICard } from '@/types/card'
import { downloadJSON } from '@/utils/files'
import { useI18n } from 'vue-i18n'
import Card from '../ui/Card/Card.vue'

const props = defineProps<{
    cards: ICard[]
}>()

const { t } = useI18n()
const currentIndex = ref(0)

onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
})

const onClick = (step: number) => {
    const next = currentIndex.value + step
    if (next >= 0 && next < props.cards.length) {
        currentIndex.value = next
    }
}

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') onClick(-1)
    if (event.key === 'ArrowRight') onClick(1)
}
</script>
