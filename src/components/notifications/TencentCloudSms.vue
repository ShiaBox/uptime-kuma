<template>
    <div>
        <div class="mb-3">
            <label for="tencentcloud-sms-secret-id" class="form-label">SecretId</label>
            <input id="tencentcloud-sms-secret-id" v-model="notification.secretId" type="text" class="form-control" required>
            <div class="form-text">
                {{ $t("tencentcloudSmsSecretIdDescription") }}
            </div>
        </div>

        <div class="mb-3">
            <label for="tencentcloud-sms-secret-key" class="form-label">SecretKey</label>
            <HiddenInput id="tencentcloud-sms-secret-key" v-model="notification.secretKey" :required="true" />
            <div class="form-text">
                {{ $t("tencentcloudSmsSecretKeyDescription") }}
            </div>
        </div>

        <div class="mb-3">
            <label for="tencentcloud-sms-sdk-app-id" class="form-label">SmsSdkAppId</label>
            <input id="tencentcloud-sms-sdk-app-id" v-model="notification.smsSdkAppId" type="text" class="form-control" required>
            <div class="form-text">
                {{ $t("tencentcloudSmsSdkAppIdDescription") }}
            </div>
        </div>

        <div class="mb-3">
            <label for="tencentcloud-sms-sign-name" class="form-label">SignName</label>
            <input id="tencentcloud-sms-sign-name" v-model="notification.signName" type="text" class="form-control" required>
            <div class="form-text">
                {{ $t("tencentcloudSmsSignNameDescription") }}
            </div>
        </div>

        <div class="mb-3">
            <label for="tencentcloud-sms-template-id" class="form-label">TemplateID</label>
            <input id="tencentcloud-sms-template-id" v-model="notification.templateCode" type="text" class="form-control" required>
            <div class="form-text">
                {{ $t("tencentcloudSmsTemplateIdDescription") }}
            </div>
        </div>

        <div class="mb-3">
            <label for="tencentcloud-sms-phone-number" class="form-label">PhoneNumber</label>
            <input id="tencentcloud-sms-phone-number" v-model="notification.phonenumber" type="text" class="form-control" required>
            <div class="form-text">
                {{ $t("tencentcloudSmsPhoneNumberDescription") }}
            </div>
        </div>

        <div class="mb-3">
            <label for="tencentcloud-sms-region" class="form-label">Region</label>
            <input id="tencentcloud-sms-region" v-model="notification.region" type="text" class="form-control" required>
            <div class="form-text">
                {{ $t("tencentcloudSmsRegionDescription") }}
            </div>
        </div>
    </div>
</template>

<script>
import HiddenInput from "../HiddenInput.vue";

export default {
    components: {
        HiddenInput,
    },
    props: {
        notification: {
            type: Object,
            required: true,
        },
    },
};
</script>