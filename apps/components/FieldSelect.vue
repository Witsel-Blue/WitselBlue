<template>
    <div
        class='field-select'
        :class='{ "is-open": isOpen }'
    >
        <select
            :id='id'
            v-model='nativeValue'
            class='field-select__native'
            :name='name'
            :required='required'
            tabindex='-1'
            aria-hidden='true'
        >
            <option
                v-for='option in options'
                :key='option.value'
                :value='option.value'
            >
                {{ option.label }}
            </option>
        </select>

        <button
            type='button'
            class='field-select__trigger'
            :aria-expanded='isOpen ? "true" : "false"'
            aria-haspopup='listbox'
            @click='toggle'
        >
            <span>{{ selectedLabel }}</span>
        </button>

        <ul
            v-show='isOpen'
            class='field-select__options'
            role='listbox'
        >
            <li
                v-for='option in options'
                :key='option.value'
                class='field-select__option'
                :class='{ "is-selected": option.value === value }'
                role='option'
                :aria-selected='option.value === value ? "true" : "false"'
                @click='selectOption(option)'
            >
                {{ option.label }}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'FieldSelect',
        props: {
            id: {
                type: String,
                default: '',
            },
            name: {
                type: String,
                required: true,
            },
            value: {
                type: [String, Number],
                required: true,
            },
            options: {
                type: Array,
                required: true,
            },
            required: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                isOpen: false,
            };
        },
        computed: {
            nativeValue: {
                get() {
                    return this.value;
                },
                set(value) {
                    this.$emit('input', value);
                },
            },
            selectedLabel() {
                const selected = this.options.find(
                    (option) => String(option.value) === String(this.value),
                );
                return selected ? selected.label : '';
            },
        },
        mounted() {
            document.addEventListener('click', this.onDocumentClick);
            document.addEventListener('keydown', this.onKeydown);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.onDocumentClick);
            document.removeEventListener('keydown', this.onKeydown);
        },
        methods: {
            toggle() {
                this.isOpen = !this.isOpen;
            },
            close() {
                this.isOpen = false;
            },
            selectOption(option) {
                this.$emit('input', option.value);
                this.close();
            },
            onDocumentClick(event) {
                if (!this.$el.contains(event.target)) {
                    this.close();
                }
            },
            onKeydown(event) {
                if (event.key === 'Escape') {
                    this.close();
                }
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    .field-select {
        position: relative;
        width: 100%;

        &__native {
            position: absolute;
            width: 1px;
            height: 1px;
            opacity: 0;
            pointer-events: none;
        }

        &__trigger {
            position: relative;
            width: 100%;
            text-align: left;
            padding: 12px;
            padding-right: 40px;
            border: 1px solid $gray2;
            border-radius: 8px;
            background-color: transparent;
            color: $white;
            font-size: 1.2rem;
            cursor: pointer;

            &:focus {
                outline: 1px solid $white;
            }

            &::after {
                content: '';
                position: absolute;
                right: 12px;
                top: 50%;
                width: 14px;
                height: 14px;
                background: url('@/assets/img/icons/interface-arrows-button-down--arrow-down-keyboard--Streamline-Core.svg')
                    no-repeat center / contain;
                pointer-events: none;
                transform: translateY(-50%);
                transition: transform 0.4s ease;
            }
        }

        &__options {
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            right: 0;
            z-index: 1;
            border: 1px solid $gray2;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: $box-shadow;
            backdrop-filter: blur(32px);
        }

        &__option {
            padding: 8px 12px;
            font-size: 1rem;
            color: $white;
            text-align: left;
            cursor: pointer;
            transition: background-color 0.4s ease;

            &:hover,
            &.is-selected {
                background-color: $gray3;
            }
        }

        &.is-open &__trigger::after {
            transform: translateY(-50%) rotate(180deg);
        }
    }
</style>
