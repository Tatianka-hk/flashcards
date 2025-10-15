<template>
    <div class="bg-blue p-[40px] flex gap-[108px] w-fit relative">
        <div class="absolute -top-4 -right-1">
            <div
                @click="$emit('delete')"
                class="bg-[#e6d6f5] h-[20px] w-[20px] rounded-full"
            >
                <IconClose class="h-[20px] w-[20px]" />
            </div>
        </div>
        <div class="flex flex-col gap-4 h-[222px] w-[666px]">
            <span class="text-2xl font-julius text-text"
                >{{ t('card.frontLabel') }}
            </span>
            <textarea
                class="bg-[#f7f1fa] text-text text-base font-julius h-[189px] p-2 resize-none"
                @input="emit('update:front', front)"
                v-model="front"
            />
        </div>
        <div class="flex flex-col gap-4 h-[222px] w-[666px]">
            <span class="text-2xl font-julius text-text"
                >{{ t('card.backLabel') }}
            </span>
            <textarea
                class="bg-[#f7f1fa] text-text text-base font-julius h-[189px] p-2 resize-none"
                @input="emit('update:back', back)"
                v-model="back"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconClose from '~/assets/icons/IconClose.vue'
import { ICard, IDbCard } from '~/types'

const props = defineProps<{ defCard?: ICard | IDbCard }>()
const front = ref(
    props.defCard && props.defCard?.front ? props.defCard?.front : ''
)
const back = ref(props.defCard?.back || '')
const { t } = useI18n()

const emit = defineEmits<{
    (e: 'update:front', val: string): void
    (e: 'update:back', val: string): void
    (e: 'delete'): void
}>()
</script>
