<template>
    <div id='contact'>
        <section class='page-title'>
            <div class='inner-l'>
                <TextStaggerByMiddle text='Contact' />
                <p v-html="$t('contact.mainText')" />
            </div>
        </section>
        <section>
            <div class='inner'>
                <form @submit.prevent='onSubmit'>
                    <div class='form-group required'>
                        <label for='name'>{{ $t('contact.NameLabel') }}</label>
                        <input
                            id='name'
                            type='text'
                            name='name'
                            required
                            :placeholder="$t('contact.NamePlaceholder')"
                        />
                    </div>
                    <div class='form-group required'>
                        <label for='email'>{{ $t('contact.EmailLabel') }}</label>
                        <input
                            id='email'
                            type='email'
                            name='email'
                            required
                            :placeholder="$t('contact.EmailPlaceholder')"
                        />
                    </div>
                    <div class='form-group'>
                        <label for='organization'>
                            {{ $t('contact.OrganizationLabel') }}
                        </label>
                        <input
                            id='organization'
                            type='text'
                            name='organization'
                            :placeholder="$t('contact.OrganizationPlaceholder')"
                        />
                    </div>
                    <div class='form-group field-date'>
                        <label for='deadline'>
                            {{ $t('contact.DeadlineLabel') }}
                        </label>
                        <div class='field-date'>
                            <input
                                id='deadline'
                                type='text'
                                readonly
                                placeholder='YYYY.MM.DD'
                                :value='deadlineDisplay'
                            />
                            <input
                                ref='deadlinePicker'
                                class='field-date__picker'
                                type='date'
                                name='deadline'
                                lang='en'
                                :value='deadlineValue'
                                @change='onDeadlineChange'
                            />
                        </div>
                    </div>
                    <div class='form-group required'>
                        <label for='type'>
                            {{ $t('contact.ProjectTypeLabel') }}
                        </label>
                        <FieldSelect
                            id='type'
                            v-model='projectType'
                            name='type'
                            :options='projectTypeOptions'
                            required
                        />
                    </div>
                    <div class='form-group'>
                        <label for='budget'>
                            {{ $t('contact.BudgetLabel') }}
                        </label>
                        <FieldSelect
                            id='budget'
                            v-model='budget'
                            name='budget'
                            :options='budgetOptions'
                        />
                    </div>
                    <div class='form-group field-textarea col-2 required'>
                        <label for='message'>
                            {{ $t('contact.MessageLabel') }}
                        </label>
                        <div class='field-textarea__wrap'>
                            <textarea id='message' name='message' rows='20' required />
                        </div>
                    </div>
                    <div class='subm`it-btn-wra col-2'>
                        <ClickSound attach-to-parent />
                        <ButtonRound
                            button-type='submit'
                            :disabled='isSubmitting'
                            :link='{ text: submitButtonText }'
                        />
                    </div>
                </form>
            </div>
        </section>
        <section>
            <p
                v-if='submitSuccess'
                class='form-status form-status--success'
            >
                {{ $t('contact.messageSent') }}
            </p>
            <p
                v-if='submitError'
                class='form-status form-status--error'
            >
                {{ submitError }}
            </p>
        </section>
        <div class='bg'>
            <img src='@/assets/img/contact/contact_bg.png' alt='Contact' />
        </div>
    </div>
</template>

<script>
    import TextStaggerByMiddle from '@/components/common/TextStaggerByMiddle.vue';
    import ButtonRound from '@/components/common/ButtonRound.vue';
    import FieldSelect from '@/components/common/FieldSelect.vue';
    import ClickSound from '@/components/common/ClickSound.vue';

    const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY || '';

    export default {
        name: 'Contact',
        components: {
            TextStaggerByMiddle,
            ButtonRound,
            FieldSelect,
            ClickSound,
        },
        data() {
            return {
                deadlineValue: '',
                deadlineDisplay: '',
                projectType: 'Other',
                budget: '0',
                isSubmitting: false,
                submitSuccess: false,
                submitError: '',
            };
        },
        computed: {
            projectTypeOptions() {
                return [
                    {
                        value: 'New Website',
                        label: this.$t('contact.ProjectTypeOption1'),
                    },
                    {
                        value: 'Interactive / 3D Experience',
                        label: this.$t('contact.ProjectTypeOption2'),
                    },
                    {
                        value: 'New Feature',
                        label: this.$t('contact.ProjectTypeOption3'),
                    },
                    {
                        value: 'Fix / Improvement',
                        label: this.$t('contact.ProjectTypeOption4'),
                    },
                    {
                        value: 'Other',
                        label: this.$t('contact.ProjectTypeOption5'),
                    },
                ];
            },
            budgetOptions() {
                return [
                    { value: '0', label: this.$t('contact.BudgetOption1') },
                    { value: '1', label: this.$t('contact.BudgetOption2') },
                    { value: '2', label: this.$t('contact.BudgetOption3') },
                    { value: '3', label: this.$t('contact.BudgetOption4') },
                    { value: '4', label: this.$t('contact.BudgetOption5') },
                    { value: '5', label: this.$t('contact.BudgetOption6') },
                    { value: '6', label: this.$t('contact.BudgetOption7') },
                ];
            },
            submitButtonText() {
                return this.isSubmitting
                    ? this.$t('contact.SendingButtonText')
                    : this.$t('contact.SendButtonText');
            },
        },
        methods: {
            async onSubmit(event) {
                const form = event.target;

                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                this.isSubmitting = true;
                this.submitSuccess = false;
                this.submitError = '';

                if (!WEB3FORMS_ACCESS_KEY) {
                    this.submitError = this.$t('contact.messageConfigError');
                    this.isSubmitting = false;
                    return;
                }

                const budgetLabel =
                    this.budgetOptions.find(
                        (option) => String(option.value) === String(this.budget),
                    )?.label || this.budget;

                const projectTypeLabel =
                    this.projectTypeOptions.find(
                        (option) => option.value === this.projectType,
                    )?.label || this.projectType;

                const name = form.name.value;
                const company = form.organization.value || '—';
                const deadline = this.deadlineDisplay || '—';
                const messageText = form.message.value;

                const subject = `[${name} / ${company}] ${projectTypeLabel} (${deadline})`;
                const body = [
                    `name: ${name}`,
                    `email: ${form.email.value}`,
                    `company: ${company}`,
                    `project type: ${projectTypeLabel}`,
                    `deadline: ${deadline}`,
                    `estimated budget: ${budgetLabel}`,
                    `message: ${messageText}`,
                ].join('\n');

                try {
                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                        body: JSON.stringify({
                            access_key: WEB3FORMS_ACCESS_KEY,
                            subject,
                            from_name: name,
                            email: form.email.value,
                            replyto: form.email.value,
                            message: body,
                        }),
                    });

                    let result = {};

                    try {
                        result = await response.json();
                    } catch {
                        result = {};
                    }

                    if (result.success) {
                        this.submitSuccess = true;
                        form.reset();
                        this.deadlineValue = '';
                        this.deadlineDisplay = '';
                        this.projectType = 'Other';
                        this.budget = '0';
                        return;
                    }

                    this.submitError =
                        result.message || this.$t('contact.messageError');
                } catch {
                    this.submitError = this.$t('contact.messageConnectionError');
                } finally {
                    this.isSubmitting = false;
                }
            },

            onDeadlineChange(event) {
                const value = event.target.value;
                this.deadlineValue = value;

                if (!value) {
                    this.deadlineDisplay = '';
                    return;
                }

                const [year, month, day] = value.split('-');
                this.deadlineDisplay = `${year}.${month}.${day}`;
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #contact {
        min-height: 100vh;
        position: relative;

        .bg {
            position: absolute;
            top: 60vh;
            left: 50%;
            transform: translateX(-50%);
            width: 60vw;
            height: auto;
            filter: grayscale(0.1) blur(16px);
            opacity: 0.6;
        }

        section {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            position: relative;
            z-index: 1;

            form {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;

                .col-2 {
                    grid-column: 1/3;
                }

                .form-group {
                    display: flex;
                    gap: 8px;
                    flex-direction: column;
                    align-items: flex-start;

                    label {
                        color: $gray1;
                    }

                    &.required label::after {
                        content: '';
                        width: 1rem;
                        height: 0.8rem;
                        display: inline-block;
                        background: url('@/assets/img/icons/computer-keyboard-asterisk-1--asterisk-star-keyboard--Streamline-Core.svg')
                            no-repeat center / contain;
                        margin-left: 8px;
                    }

                    input,
                    select,
                    textarea,
                    .field-date {
                        width: 100%;
                    }
                }
            }

            .form-status {
                margin-top: 10vh;
                text-align: center;
                font-size: 1.2rem;
            }
        }
    }
</style>
