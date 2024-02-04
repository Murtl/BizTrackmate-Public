<script setup lang="ts">
import dynamicText from '@/text/dynamicText.json'
import { computed, onMounted, ref } from 'vue'
import BTMLogin from '@/App.vue'
import { BTMAuthService } from '@/services/BTMAuthService'

const shopName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const showLogin = ref(false)
const showDefaultModal = ref(false)
const defaultModalText = ref('')

const registerRef = ref<HTMLDivElement>()

const registerButtonDisabledState = computed(() => {
  return (
    shopName.value === '' ||
    email.value === '' ||
    password.value === '' ||
    confirmPassword.value === '' ||
    shopName.value.length > 16 ||
    loading.value
  )
})

const invalidFeedbackShopNameState = computed(() => {
  return shopName.value.length < 16
})

onMounted(() => {
  if (registerRef.value) {
    registerRef.value?.addEventListener('keyup', (event) => {
      if (event.key === 'Enter' && !registerButtonDisabledState.value) {
        handleRegister()
      }
    })
  }
})

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    defaultModalText.value = dynamicText.auth_passwords_do_not_match
    showDefaultModal.value = true
    return
  }
  loading.value = true
  const { state, message } = await BTMAuthService.register(
    shopName.value,
    email.value,
    password.value
  )
  if (state) {
    await BTMAuthService.login(email.value, password.value)
    shopName.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
  }
  loading.value = false
  defaultModalText.value = message
  showDefaultModal.value = true
}
</script>

<template>
  <div class="btm-register-host" v-if="!showLogin" ref="registerRef">
    <section class="btm-logo">
      <img src="@/assets/BTMLogo.png" alt="Logo" />
    </section>
    <section class="main-section">
      <span>{{ dynamicText.Register }}</span>
      <BFormGroup
        :label="dynamicText.shop_name"
        :state="invalidFeedbackShopNameState"
        :invalid-feedback="dynamicText.invalid_shop_name"
      >
        <BFormInput :placeholder="dynamicText.enter_shop_name" v-model="shopName" />
      </BFormGroup>
      <BFormGroup :label="dynamicText.E_Mail">
        <BFormInput :placeholder="dynamicText.enter_E_Mail" v-model="email" />
      </BFormGroup>
      <BFormGroup :label="dynamicText.password">
        <BFormInput :placeholder="dynamicText.enter_password" type="password" v-model="password" />
      </BFormGroup>
      <BFormGroup :label="dynamicText.confirm_password">
        <BFormInput
          :placeholder="dynamicText.enter_confirm_password"
          type="password"
          v-model="confirmPassword"
        />
      </BFormGroup>
      <section class="buttons">
        <BButton variant="light" @click="showLogin = true">{{
          dynamicText.already_registered
        }}</BButton>
        <BButton variant="primary" :disabled="registerButtonDisabledState" @click="handleRegister"
          >{{ dynamicText.Register }}
        </BButton>
      </section>
    </section>
  </div>
  <BTMLogin v-else />
  <BModal v-model="showDefaultModal" :ok-only="true">
    {{ defaultModalText }}
  </BModal>
</template>

<style scoped lang="scss">
@import '@/custom';

.btm-register-host {
  display: flex;
  flex-direction: row;
  width: fit-content;
  margin: 10% auto 0;

  .btm-logo {
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: $primary;
    border-radius: 20px 0 0 20px;

    img {
      width: 300px;
    }
  }

  .main-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    border-radius: 0 20px 20px 0;
    background-color: $light;
    width: 400px;

    span {
      font-size: 30px;
      font-weight: bold;
    }

    .buttons {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      gap: 10px;
    }
  }
}

@media screen and (max-width: 750px) {
  .btm-register-host {
    flex-direction: column;
    width: 95%;
    margin: 10px;

    .btm-logo {
      border-radius: 20px 20px 0 0;

      img {
        width: 200px;
      }
    }

    .main-section {
      border-radius: 0 0 20px 20px;
      width: 100%;
    }
  }
}
</style>
