import {authService} from "../services/auth.service";
import {useAuthStore} from "../stores/auth.store";
import { configurationService } from "../services/configuration.service";
import { useConfigurationStore } from "../stores/configuration.store";
import i18n from "../i18n";


export const loginAndLoadContext = async (
    email: string,
     password: string,
    rememberMe: boolean = false
) => {
    // 🔐 stocker le token
   const {access_token} = await authService.login(email, password, rememberMe);

    // 👤 récupérer l'utilisateur
    const user = await authService.me();

    // 🔑 récupérer les permissions
    const permissions = await authService.getMyPermissions();

    // ⚙️ récupérer la configuration de l'utilisateur
    const configuration = await configurationService.getMyConfiguration();

    if (configuration.language) {
        i18n.changeLanguage(configuration.language);
    }

    // 🧠 hydrater le store
    useAuthStore.getState().login(user, access_token, permissions);
    useConfigurationStore.getState().setConfiguration(configuration);

};
