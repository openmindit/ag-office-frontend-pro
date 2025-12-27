import {FormEvent, useEffect, useMemo, useState} from "react";
import Label from "../../components/form/Label";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import {userProfileService} from "../../services/userProfile.service";
import type {UserProfile, UserProfileUpdatePayload} from "../../types/api.types";

type UserProfileFormState = {
    department_id: string;
    first_name: string;
    last_name: string;
    display_name: string;
    phone: string;
    mobile: string;
    preferred_language: string;
    timezone: string;
    date_format: string;
    time_format: string;
    currency: string;
    job_title: string;
    employee_id: string;
    office_location: string;
    signature: string;
    avatar_url: string;
    bio: string;
};

const emptyFormState: UserProfileFormState = {
    department_id: "",
    first_name: "",
    last_name: "",
    display_name: "",
    phone: "",
    mobile: "",
    preferred_language: "",
    timezone: "",
    date_format: "",
    time_format: "",
    currency: "",
    job_title: "",
    employee_id: "",
    office_location: "",
    signature: "",
    avatar_url: "",
    bio: "",
};

const SETTINGS_PLACEHOLDER = '{\n  "notifications": true\n}';
export default function UserProfile() {
    const [formData, setFormData] = useState<UserProfileFormState>(emptyFormState);
    const [settingsInput, setSettingsInput] = useState<string>("{}");
    const [profileMeta, setProfileMeta] = useState<
        Pick<UserProfile, "username" | "user_email" | "department_name">
    >({username: "", user_email: "", department_name: ""});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const languageOptions = useMemo(
        () => [
            {label: "English", value: "en"},
            {label: "Français", value: "fr"},
            {label: "Español", value: "es"},
        ],
        []
    );

    const timeFormatOptions = useMemo(
        () => [
            {label: "12h", value: "12h"},
            {label: "24h", value: "24h"},
        ],
        []
    );

    const mapProfileToForm = (profile: UserProfile): UserProfileFormState => ({
        department_id: profile.department_id ?? "",
        first_name: profile.first_name ?? "",
        last_name: profile.last_name ?? "",
        display_name: profile.display_name ?? "",
        phone: profile.phone ?? "",
        mobile: profile.mobile ?? "",
        preferred_language: profile.preferred_language ?? "",
        timezone: profile.timezone ?? "",
        date_format: profile.date_format ?? "",
        time_format: profile.time_format ?? "",
        currency: profile.currency ?? "",
        job_title: profile.job_title ?? "",
        employee_id: profile.employee_id ?? "",
        office_location: profile.office_location ?? "",
        signature: profile.signature ?? "",
        avatar_url: profile.avatar_url ?? "",
        bio: profile.bio ?? "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const profile = await userProfileService.getMyProfile();
                setFormData(mapProfileToForm(profile));
                setSettingsInput(
                    profile.settings ? JSON.stringify(profile.settings, null, 2) : "{}"
                );
                setProfileMeta({
                    username: profile.username ?? "",
                    user_email: profile.user_email ?? "",
                    department_name: profile.department_name ?? "",
                });
            } catch {
                setError("Unable to load your profile at the moment.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (
        field: keyof UserProfileFormState,
        value: string
    ) => {
        setFormData((prev) => ({...prev, [field]: value}));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMessage(null);

        let parsedSettings: Record<string, unknown> = {};

        if (settingsInput.trim()) {
            try {
                parsedSettings = JSON.parse(settingsInput);
            } catch {
                setSaving(false);
                setError("Settings must be valid JSON.");
                return;
            }
        }

        const payload: UserProfileUpdatePayload = {
            ...formData,
            settings: parsedSettings,
        };

        try {
            const updatedProfile = await userProfileService.updateMyProfile(payload);
            setFormData(mapProfileToForm(updatedProfile));
            setSettingsInput(
                updatedProfile.settings
                    ? JSON.stringify(updatedProfile.settings, null, 2)
                    : "{}"
            );
            setProfileMeta({
                username: updatedProfile.username ?? "",
                user_email: updatedProfile.user_email ?? "",
                department_name: updatedProfile.department_name ?? "",
            });
            setSuccessMessage("Profile updated successfully.");
        } catch {
            setError("Unable to save your profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <PageMeta
                 title="User profile | AG Office"
                description="Manage your personal information and preferences"
            />

            <div
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Profil utilisateur
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mettez à jour vos informations personnelles et vos préférences.
            </p>
          </div>
        </div>

        <div className="mt-6">
          {error && (
            <div className="mb-4 rounded-lg border border-error-200 bg-error-50 p-4 text-sm text-error-700 dark:border-error-700/50 dark:bg-error-500/10 dark:text-error-200">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-lg border border-success-200 bg-success-50 p-4 text-sm text-success-700 dark:border-success-700/50 dark:bg-success-500/10 dark:text-success-200">
              {successMessage}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-5 lg:col-span-8">
                <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                  <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                    Informations générales
                  </h4>
                  {loading ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Chargement du profil...
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                      <div>
                        <Label>Prénom</Label>
                        <Input
                          value={formData.first_name}
                          onChange={(event) =>
                            handleInputChange("first_name", event.target.value)
                          }
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div>
                        <Label>Nom</Label>
                        <Input
                          value={formData.last_name}
                          onChange={(event) =>
                            handleInputChange("last_name", event.target.value)
                          }
                          placeholder="Votre nom"
                        />
                      </div>
                      <div>
                        <Label>Nom affiché</Label>
                        <Input
                          value={formData.display_name}
                          onChange={(event) =>
                            handleInputChange(
                              "display_name",
                              event.target.value
                            )
                          }
                          placeholder="Nom utilisé dans l'application"
                        />
                      </div>
                      <div>
                        <Label>Téléphone</Label>
                        <Input
                          value={formData.phone}
                          onChange={(event) =>
                            handleInputChange("phone", event.target.value)
                          }
                          placeholder="Numéro de téléphone"
                        />
                      </div>
                      <div>
                        <Label>Mobile</Label>
                        <Input
                          value={formData.mobile}
                          onChange={(event) =>
                            handleInputChange("mobile", event.target.value)
                          }
                          placeholder="Numéro de mobile"
                        />
                      </div>
                      <div>
                        <Label>Job title</Label>
                        <Input
                          value={formData.job_title}
                          onChange={(event) =>
                            handleInputChange("job_title", event.target.value)
                          }
                          placeholder="Votre poste"
                        />
                      </div>
                      <div>
                        <Label>Identifiant employé</Label>
                        <Input
                          value={formData.employee_id}
                          onChange={(event) =>
                            handleInputChange(
                              "employee_id",
                              event.target.value
                            )
                          }
                          placeholder="ID interne"
                        />
                      </div>
                      <div>
                        <Label>Département (ID)</Label>
                        <Input
                          value={formData.department_id}
                          onChange={(event) =>
                            handleInputChange(
                              "department_id",
                              event.target.value
                            )
                          }
                          placeholder="Identifiant du département"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Bio</Label>
                        <TextArea
                          rows={3}
                          value={formData.bio}
                          onChange={(value) => handleInputChange("bio", value)}
                          placeholder="Quelques mots sur vous"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Signature</Label>
                        <TextArea
                          rows={3}
                          value={formData.signature}
                          onChange={(value) =>
                            handleInputChange("signature", value)
                          }
                          placeholder="Signature pour les communications"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>URL de l'avatar</Label>
                        <Input
                          value={formData.avatar_url}
                          onChange={(event) =>
                            handleInputChange("avatar_url", event.target.value)
                          }
                          placeholder="https://exemple.com/avatar.jpg"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                  <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                    Préférences
                  </h4>
                  {loading ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Chargement du profil...
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                      <div>
                        <Label>Langue préférée</Label>
                        <select
                          className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                          value={formData.preferred_language}
                          onChange={(event) =>
                            handleInputChange(
                              "preferred_language",
                              event.target.value
                            )
                          }
                        >
                          <option value="" disabled>
                            Sélectionnez une langue
                          </option>
                          {languageOptions.map((language) => (
                            <option key={language.value} value={language.value}>
                              {language.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label>Fuseau horaire</Label>
                        <Input
                          value={formData.timezone}
                          onChange={(event) =>
                            handleInputChange("timezone", event.target.value)
                          }
                          placeholder="Europe/Paris"
                        />
                      </div>
                      <div>
                        <Label>Format de date</Label>
                        <Input
                          value={formData.date_format}
                          onChange={(event) =>
                            handleInputChange("date_format", event.target.value)
                          }
                          placeholder="yyyy-MM-dd"
                        />
                      </div>
                      <div>
                        <Label>Format de l'heure</Label>
                        <select
                          className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                          value={formData.time_format}
                          onChange={(event) =>
                            handleInputChange("time_format", event.target.value)
                          }
                        >
                          <option value="" disabled>
                            Choisir un format
                          </option>
                          {timeFormatOptions.map((format) => (
                            <option key={format.value} value={format.value}>
                              {format.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label>Devise</Label>
                        <Input
                          value={formData.currency}
                          onChange={(event) =>
                            handleInputChange("currency", event.target.value)
                          }
                          placeholder="EUR"
                        />
                      </div>
                      <div>
                        <Label>Lieu de travail</Label>
                        <Input
                          value={formData.office_location}
                          onChange={(event) =>
                            handleInputChange(
                              "office_location",
                              event.target.value
                            )
                          }
                          placeholder="Bureau ou site"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                      Paramètres avancés
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Utilisez du JSON pour configurer vos préférences avancées.
                    </p>
                  </div>
                  {loading ? (
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                      Chargement du profil...
                    </p>
                  ) : (
                    <div className="mt-4">
                      <TextArea
                        rows={6}
                        value={settingsInput}
                        onChange={setSettingsInput}
                        className="font-mono"
                        placeholder={SETTINGS_PLACEHOLDER}
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Les paramètres doivent être un objet JSON valide.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-5 lg:col-span-4">
                <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                  <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                    Coordonnées du compte
                  </h4>
                  {loading ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Chargement du profil...
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label>Nom d'utilisateur</Label>
                        <Input value={profileMeta.username ?? ""} disabled />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input value={profileMeta.user_email ?? ""} disabled />
                      </div>
                      <div>
                        <Label>Département</Label>
                        <Input
                          value={profileMeta.department_name ?? ""}
                          disabled
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                  <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
                    Sauvegarde
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enregistrez vos modifications pour mettre à jour votre profil.
                  </p>
                  <div className="mt-4 flex flex-col gap-3">
                    <Button
                      size="sm"
                      disabled={saving || loading}
                      className="w-full"

                    >
                      {saving ? "Enregistrement..." : "Sauvegarder"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={saving || loading}
                      className="w-full"
                      type="button"
                      onClick={() => {
                        setFormData(emptyFormState);
                        setSettingsInput("{}");
                        setSuccessMessage(null);
                        setError(null);
                      }}
                    >
                      Réinitialiser le formulaire
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
