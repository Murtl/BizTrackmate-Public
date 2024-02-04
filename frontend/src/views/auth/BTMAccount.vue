<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import BTMCheckIcon from '@/components/icons/BTMCheckIcon.vue'
import dynamicText from '@/text/dynamicText.json'
import { BTMAuthService } from '@/services/BTMAuthService'
import { getCurrentUser } from '@/firebase'

const currentEmail = ref('')
const newEmail = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const newPasswordConfirm = ref('')

const showDefaultModal = ref(false)
const defaultModalText = ref('')

const showPasswordModal = ref(false)
const passwordInput = ref('')

onBeforeMount(() => {
  const user = getCurrentUser()
  if (user && typeof user.email === 'string') {
    currentEmail.value = user.email
  }
})

const saveMailButtonDisabledState = computed(() => {
  return newEmail.value === ''
})

const savePasswordButtonDisabledState = computed(() => {
  return oldPassword.value === '' || newPassword.value === '' || newPasswordConfirm.value === ''
})

/**
 * Saves the new email
 */
const handleSaveNewEMail = async () => {
  const { state, message } = await BTMAuthService.changeMail(newEmail.value)
  if (state) {
    currentEmail.value = newEmail.value
    newEmail.value = ''
  } else {
    if (message === 'auth/requires-recent-login') {
      showPasswordModal.value = true
      return
    }
  }
  defaultModalText.value = message
  showDefaultModal.value = true
}

/**
 * Saves the new password
 */
const handleSaveNewPassword = async () => {
  if (newPassword.value !== newPasswordConfirm.value) {
    defaultModalText.value = dynamicText.auth_passwords_do_not_match
    showDefaultModal.value = true
    return
  }
  const { state, message } = await BTMAuthService.changePassword(
    oldPassword.value,
    newPassword.value
  )
  if (state) {
    oldPassword.value = ''
    newPassword.value = ''
    newPasswordConfirm.value = ''
  }
  defaultModalText.value = message
  showDefaultModal.value = true
}

/**
 * Reauthenticates the user and changes the mail
 */
const handleReauthenticateAndChangeMail = async () => {
  const { state, message } = await BTMAuthService.reauthenticate(passwordInput.value)
  if (state) {
    passwordInput.value = ''
    await handleSaveNewEMail()
  } else {
    defaultModalText.value = message
    showDefaultModal.value = true
  }
}
</script>

<template>
  <div class="btm-account-host">
    <BForm class="form-1" @submit="handleSaveNewEMail">
      <BFormGroup :label="dynamicText.E_Mail" disabled>
        <BFormInput v-model="currentEmail" readonly></BFormInput>
      </BFormGroup>
      <BFormGroup :label="dynamicText.new_E_Mail">
        <BFormInput
          v-model="newEmail"
          type="text"
          :placeholder="dynamicText.enter_new_E_Mail"
          required
        ></BFormInput>
      </BFormGroup>
      <BFormGroup class="button">
        <BButton type="submit" variant="primary" :disabled="saveMailButtonDisabledState">
          <BTMCheckIcon />
          {{ dynamicText.save_new_E_Mail }}
        </BButton>
      </BFormGroup>
    </BForm>

    <BForm @submit="handleSaveNewPassword">
      <BFormGroup :label="dynamicText.old_password">
        <BFormInput
          v-model="oldPassword"
          type="password"
          :placeholder="dynamicText.enter_old_password"
          required
        ></BFormInput>
      </BFormGroup>
      <BFormGroup :label="dynamicText.new_password">
        <BFormInput
          v-model="newPassword"
          type="password"
          :placeholder="dynamicText.enter_new_password"
          required
        ></BFormInput>
      </BFormGroup>
      <BFormGroup :label="dynamicText.confirm_new_password">
        <BFormInput
          v-model="newPasswordConfirm"
          type="password"
          :placeholder="dynamicText.enter_confirm_new_password"
          required
        ></BFormInput>
      </BFormGroup>
      <BFormGroup class="button">
        <BButton type="submit" variant="primary" :disabled="savePasswordButtonDisabledState">
          <BTMCheckIcon />
          {{ dynamicText.save_new_password }}
        </BButton>
      </BFormGroup>
    </BForm>
  </div>
  <BModal v-model="showDefaultModal" :ok-only="true">
    {{ defaultModalText }}
  </BModal>
  <BModal
    v-model="showPasswordModal"
    :title="dynamicText.E_Mail_change_requires_password"
    :ok-only="true"
    @ok="handleReauthenticateAndChangeMail"
  >
    <BFormInput
      v-model="passwordInput"
      type="password"
      :placeholder="dynamicText.enter_password"
    ></BFormInput>
  </BModal>
</template>

<style scoped lang="scss">
@import '@/custom';

.btm-account-host {
  max-width: 500px;
  background-color: $light;
  padding: 20px;
  margin: 10px auto auto;
  border-radius: 10px;
  box-shadow: $main-box-shadow;

  .form-1 {
    margin-bottom: 30px;
  }

  .button {
    text-align: right;
  }
}

@media screen and (max-width: 520px) {
  .btm-account-host {
    margin-left: 10px;
    margin-right: 10px;
  }
}
</style>
