import { authService } from "../services/auth.service";
import { useAuthStore } from "../stores/auth.store";

export const loginAndLoadContext = async (
  email: string,
  password: string
) => {
  const { access_token } = await authService.login(email, password);

  // 🔐 stocker le token
  localStorage.setItem("access_token", access_token);

  // 👤 récupérer l'utilisateur
  const user = await authService.me();

  // 🔑 récupérer les permissions
  const permissions = await authService.getMyPermissions();

  // 🧠 hydrater le store
  useAuthStore.getState().login(user, access_token);
  useAuthStore.getState().setPermissions(permissions);
};
