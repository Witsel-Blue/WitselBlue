<template>
    <div id='contact'>
        <section>
            <div class='inner'>
                <h2>Contact</h2>
            </div>
        </section>
        <section>
            <div class='inner'>
                <form>
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
                    <ButtonRound class='col-2' :link='{ text: "Send Message" }' />
                </form>
            </div>
        </section>
    </div>
</template>

<script>
    import ButtonRound from '@/components/ButtonRound.vue';
    import FieldSelect from '@/components/FieldSelect.vue';

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

            h2 {
                font-size: 10rem;
                line-height: 1;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                padding: 20vh 0 10vh;
            }

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
        }
    }
</style>