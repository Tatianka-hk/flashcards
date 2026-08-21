<template>
    <div class="relative group">
        <button
            type="button"
            aria-label="Чому доступно лише 3 спроби?"
            class="w-5 h-5 flex items-center justify-center rounded-full border border-text text-xs text-text cursor-help"
        >
            <slot name="trigger" />
        </button>

        <div
            class="pointer-events-none absolute right-0 top-full z-20 mt-2 w-[260px] border border-text bg-blue px-4 py-3 text-sm leading-5 text-text opacity-0 invisible transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
        >
            <slot name="content" />
        </div>
    </div>
</template>
