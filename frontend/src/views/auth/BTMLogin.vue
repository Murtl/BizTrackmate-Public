<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { BTMAuthService } from '@/services/BTMAuthService'
import dynamicText from '@/text/dynamicText.json'
import BTMRegister from '@/views/auth/BTMRegister.vue'

const email = ref('')
const password = ref('')

const showRegister = ref(false)
const showDefaultModal = ref(false)
const defaultModalText = ref('')

const loginRef = ref<HTMLDivElement>()

const loginButtonDisabledState = computed(() => {
  return email.value === '' || password.value === ''
})

onMounted(() => {
  if (loginRef.value) {
    loginRef.value?.addEventListener('keyup', (event) => {
      if (event.key === 'Enter' && !loginButtonDisabledState.value) {
        handleLogin()
      }
    })
  }
})

const handleLogin = async () => {
  const { state, message } = await BTMAuthService.login(email.value, password.value)
  if (state) {
    email.value = ''
    password.value = ''
  }
  defaultModalText.value = message
  showDefaultModal.value = true
}
</script>

<template>
  <div class="btm-login-host" v-if="!showRegister" ref="loginRef">
    <section class="btm-logo">
      <img src="@/assets/BTMLogo.png" alt="Logo" />
    </section>
    <section class="main-section">
      <span>{{ dynamicText.Login }}</span>
      <BFormGroup :label="dynamicText.E_Mail">
        <BFormInput :placeholder="dynamicText.enter_E_Mail" v-model="email" />
      </BFormGroup>
      <BFormGroup :label="dynamicText.password">
        <BFormInput :placeholder="dynamicText.enter_password" type="password" v-model="password" />
      </BFormGroup>

      <section class="buttons">
        <BButton variant="light" @click="showRegister = true">{{ dynamicText.new_here }}</BButton>
        <BButton variant="primary" :disabled="loginButtonDisabledState" @click="handleLogin"
          >{{ dynamicText.Login }}
        </BButton>
      </section>
    </section>
  </div>
  <BTMRegister v-else />
  <BModal v-model="showDefaultModal" :ok-only="true">
    {{ defaultModalText }}
  </BModal>
</template>

<style scoped lang="scss">
@import '@/custom';

.btm-login-host {
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
  .btm-login-host {
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
