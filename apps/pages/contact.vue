<template>
    <div id='contact'>
        <section class='page-title'>
            <div class='inner-l'>
                <h2>Contact</h2>
                <p>
                    If you have any questions or would like to discuss a project, <br/>
                    please fill out the form below. <br />
                    We will get back to you as soon as possible.
                </p>
            </div>
        </section>
        <section>
            <div class='inner'>
                <form @submit.prevent='onSubmit'>
                    <div class='form-group required'>
                        <label for='name'>Name</label>
                        <input id='name' type='text' name='name' required placeholder='John Doe'/>
                    </div>
                    <div class='form-group required'>
                        <label for='email'>Email</label>
                        <input id='email' type='email' name='email' required placeholder='john.doe@example.com'/>
                    </div>
                    <div class='form-group'>
                        <label for='organization'>Organization</label>
                        <input id='organization' type='text' name='organization' placeholder='Company Name'/>
                    </div>
                    <div class='form-group field-date'>
                        <label for='deadline'>Deadline</label>
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
                        <label for='type'>Project Type</label>
                        <FieldSelect
                            id='type'
                            v-model='projectType'
                            name='type'
                            :options='projectTypeOptions'
                            required
                        />
                    </div>
                    <div class='form-group'>
                        <label for='budget'>Estimated Budget</label>
                        <FieldSelect
                            id='budget'
                            v-model='budget'
                            name='budget'
                            :options='budgetOptions'
                        />
                    </div>
                    <div class='form-group field-textarea col-2 required'>
                        <label for='message'>Message</label>
                        <div class='field-textarea__wrap'>
                            <textarea id='message' name='message' rows='20' required />
                        </div>
                    </div>
                    <ButtonRound
                        class='col-2'
                        button-type='submit'
                        :disabled='isSubmitting'
                        :link='{ text: isSubmitting ? "Sending..." : "Send Message" }'
                    />
                </form>
            </div>
        </section>
        <section>
            <p
                v-if='submitSuccess'
                class='form-status form-status--success'
            >
                Message sent. Thank you!
            </p>
            <p
                v-if='submitError'
                class='form-status form-status--error'
            >
                {{ submitError }}
            </p>
        </section>
    </div>
</template>

<script>
    import ButtonRound from '@/components/ButtonRound.vue';
    import FieldSelect from '@/components/FieldSelect.vue';

    const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY || '';

    export default {
        name: 'Contact',
        components: {
            ButtonRound,
            FieldSelect,
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
                projectTypeOptions: [
                    { value: 'New Website', label: 'New Website' },
                    {
                        value: 'Interactive / 3D Experience',
                        label: 'Interactive / 3D Experience',
                    },
                    { value: 'New Feature', label: 'New Feature' },
                    { value: 'Fix / Improvement', label: 'Fix / Improvement' },
                    { value: 'Other', label: 'Other' },
                ],
                budgetOptions: [
                    { value: '0', label: 'Undecided' },
                    { value: '1', label: '- $10' },
                    { value: '2', label: '$10 - $50' },
                    { value: '3', label: '$50 - $100' },
                    { value: '4', label: '$100 - $200' },
                    { value: '5', label: '$200 - $500' },
                    { value: '6', label: '$500 -' },
                ],
            };
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
                    this.submitError =
                        'Email service is not configured. Set WEB3FORMS_ACCESS_KEY in .env';
                    this.isSubmitting = false;
                    return;
                }

                const budgetLabel =
                    this.budgetOptions.find(
                        (option) => String(option.value) === String(this.budget),
                    )?.label || this.budget;

                const name = form.name.value;
                const company = form.organization.value || '—';
                const deadline = this.deadlineDisplay || '—';
                const projectType = this.projectType;
                const messageText = form.message.value;

                const subject = `[${name} / ${company}] ${projectType} (${deadline})`;
                const body = [
                    `name: ${name}`,
                    `email: ${form.email.value}`,
                    `company: ${company}`,
                    `project type: ${projectType}`,
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
                        result.message ||
                        'Failed to send message. Please try again later.';
                } catch {
                    this.submitError =
                        'Failed to send message. Please check your connection and try again.';
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

        section {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;

            // &:first-child {
            //     padding: 20vh 0 10vh;

            //     h2 {
            //         font-size: 10rem;
            //         line-height: 1;
            //         letter-spacing: 0.2em;
            //         text-transform: uppercase;
            //     }

            //     p {
            //         margin-top: 5vh;
            //         font-size: 1.2rem;
            //     }
            // }

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
                        no-repeat center / contain;                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: contain;
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