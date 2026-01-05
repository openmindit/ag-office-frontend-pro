import { FormEvent, useEffect, useMemo, useState, type ChangeEvent } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import TextArea from "../../components/form/input/TextArea";
import { applicationConfigService } from "../../services/applicationConfig.service";
import type { ApplicationConfig } from "../../types/api.types";

const EMPTY_CONFIG: ApplicationConfig = {
  company_name: "",
  company_legal_name: "",
  tax_id: "",
  logo_url: "",
  favicon_url: "",
  default_language: "fr",
  default_currency: "EUR",
  default_timezone: "Europe/Paris",
  default_date_format: "DD/MM/YYYY",
  default_time_format: "24h",
  headquarters_address: "",
  phone: "",
  email: "",
  website: "",
  vat_number: "",
  siret: "",
  license_number: "",
  primary_color: "#f7eb29",
  secondary_color: "#1ad962",
  theme: "light",
  default_vat_rate: "",
  booking_reference_prefix: "AGO",
  invoice_number_format: "{year}-{seq:05d}",
  contract_validity_days: "30",
  data_retention_days: "2555",
  privacy_policy_url: "",
  terms_conditions_url: "",
  settings: {},
};

  const ApplicationConfigPage = () => {
    const [config, setConfig] = useState<ApplicationConfig>(EMPTY_CONFIG);
    const [settingsText, setSettingsText] = useState<string>("{}");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(
      null
  );

  const mergeWithDefaults = useMemo(
    () => (remoteConfig: ApplicationConfig) => ({ ...EMPTY_CONFIG, ...remoteConfig }),
    []
  );

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      setStatus(null);
      try {
        const data = await applicationConfigService.getConfig();
        setConfig(mergeWithDefaults(data));
        setSettingsText(JSON.stringify(data.settings ?? {}, null, 2));
      } catch (error) {
        console.error("Unable to load application config", error);
        setStatus({ type: "error", message: "Impossible de charger la configuration." });
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [mergeWithDefaults]);

  const handleChange = (field: keyof ApplicationConfig) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    let parsedSettings: Record<string, unknown> = {};

    if (settingsText.trim()) {
      try {
        parsedSettings = JSON.parse(settingsText);
      } catch (error) {
        console.error("Invalid JSON in settings", error);
        setStatus({
          type: "error",
          message: "Le champ Paramètres avancés doit contenir un JSON valide.",
        });
        setSaving(false);
        return;
      }
    }

    try {
      const payload: ApplicationConfig = { ...config, settings: parsedSettings };
      const updated = await applicationConfigService.updateConfig(payload);
      setConfig(mergeWithDefaults(updated));
      setSettingsText(JSON.stringify(updated.settings ?? {}, null, 2));
      setStatus({ type: "success", message: "Configuration enregistrée avec succès." });
    } catch (error) {
      console.error("Unable to save application config", error);
      setStatus({
        type: "error",
        message: "Une erreur est survenue lors de l'enregistrement.",
      });
    } finally {
      setSaving(false);
    }
  };

  // @ts-ignore
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="App Config" />

      <div className="rounded-xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90">
                Configuration de l'application
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gérez les informations et préférences globales de votre application.
              </p>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Endpoint: <code className="font-mono text-gray-700 dark:text-gray-300">api/v1/application-config</code>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {status && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                status.type === "success"
                  ? "border-success-200 bg-success-50 text-success-700 dark:border-success-800/40 dark:bg-success-900/20 dark:text-success-200"
                  : "border-error-200 bg-error-50 text-error-700 dark:border-error-800/40 dark:bg-error-900/20 dark:text-error-200"
              }`}
            >
              {status.message}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400">
              Chargement de la configuration...
            </div>
          ) : (
            <div className="space-y-8">
              <section className="space-y-4">
                <div>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white/90">
                    Identité de la société
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Informations affichées dans les documents officiels et communications.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="company_name">Nom de l'entreprise</Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      value={config.company_name ?? ""}
                      onChange={handleChange("company_name")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_legal_name">Raison sociale</Label>
                    <Input
                      id="company_legal_name"
                      name="company_legal_name"
                      value={config.company_legal_name ?? ""}
                      onChange={handleChange("company_legal_name")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax_id">Identifiant fiscal</Label>
                    <Input
                      id="tax_id"
                      name="tax_id"
                      value={config.tax_id ?? ""}
                      onChange={handleChange("tax_id")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vat_number">Numéro de TVA</Label>
                    <Input
                      id="vat_number"
                      name="vat_number"
                      value={config.vat_number ?? ""}
                      onChange={handleChange("vat_number")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="siret">SIRET</Label>
                    <Input id="siret" name="siret" value={config.siret ?? ""} onChange={handleChange("siret")} />
                  </div>
                  <div>
                    <Label htmlFor="license_number">Numéro de licence</Label>
                    <Input
                      id="license_number"
                      name="license_number"
                      value={config.license_number ?? ""}
                      onChange={handleChange("license_number")}
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white/90">Coordonnées</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Informations visibles sur vos documents et communications externes.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="headquarters_address">Adresse du siège</Label>
                    <Input
                      id="headquarters_address"
                      name="headquarters_address"
                      value={config.headquarters_address ?? ""}
                      onChange={handleChange("headquarters_address")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" name="phone" value={config.phone ?? ""} onChange={handleChange("phone")} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={config.email ?? ""} onChange={handleChange("email")} />
                  </div>
                  <div>
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      name="website"
                      value={config.website ?? ""}
                      onChange={handleChange("website")}
                      placeholder="https://"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo_url">Logo URL</Label>
                    <Input
                      id="logo_url"
                      name="logo_url"
                      value={config.logo_url ?? ""}
                      onChange={handleChange("logo_url")}
                      placeholder="https://"
                    />
                  </div>
                  <div>
                    <Label htmlFor="favicon_url">Favicon URL</Label>
                    <Input
                      id="favicon_url"
                      name="favicon_url"
                      value={config.favicon_url ?? ""}
                      onChange={handleChange("favicon_url")}
                      placeholder="https://"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white/90">Préférences</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Langue, devise et formats utilisés par défaut dans l'application.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="default_language">Langue par défaut</Label>
                    <Input
                      id="default_language"
                      name="default_language"
                      value={config.default_language ?? ""}
                      onChange={handleChange("default_language")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="default_currency">Devise</Label>
                    <Input
                      id="default_currency"
                      name="default_currency"
                      value={config.default_currency ?? ""}
                      onChange={handleChange("default_currency")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="default_timezone">Fuseau horaire</Label>
                    <Input
                      id="default_timezone"
                      name="default_timezone"
                      value={config.default_timezone ?? ""}
                      onChange={handleChange("default_timezone")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="default_date_format">Format de date</Label>
                    <Input
                      id="default_date_format"
                      name="default_date_format"
                      value={config.default_date_format ?? ""}
                      onChange={handleChange("default_date_format")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="default_time_format">Format d'heure</Label>
                    <Input
                      id="default_time_format"
                      name="default_time_format"
                      value={config.default_time_format ?? ""}
                      onChange={handleChange("default_time_format")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="default_vat_rate">TVA par défaut</Label>
                    <Input
                      id="default_vat_rate"
                      name="default_vat_rate"
                      value={config.default_vat_rate ?? ""}
                      onChange={handleChange("default_vat_rate")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="booking_reference_prefix">Préfixe de référence</Label>
                    <Input
                      id="booking_reference_prefix"
                      name="booking_reference_prefix"
                      value={config.booking_reference_prefix ?? ""}
                      onChange={handleChange("booking_reference_prefix")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="invoice_number_format">Format de facture</Label>
                    <Input
                      id="invoice_number_format"
                      name="invoice_number_format"
                      value={config.invoice_number_format ?? ""}
                      onChange={handleChange("invoice_number_format")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contract_validity_days">Validité des contrats (jours)</Label>
                    <Input
                      id="contract_validity_days"
                      name="contract_validity_days"
                      value={config.contract_validity_days ?? ""}
                      onChange={handleChange("contract_validity_days")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="data_retention_days">Rétention des données (jours)</Label>
                    <Input
                      id="data_retention_days"
                      name="data_retention_days"
                      value={config.data_retention_days ?? ""}
                      onChange={handleChange("data_retention_days")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="privacy_policy_url">Politique de confidentialité</Label>
                    <Input
                      id="privacy_policy_url"
                      name="privacy_policy_url"
                      value={config.privacy_policy_url ?? ""}
                      onChange={handleChange("privacy_policy_url")}
                      placeholder="https://"
                    />
                  </div>
                  <div>
                    <Label htmlFor="terms_conditions_url">CGV / CGU</Label>
                    <Input
                      id="terms_conditions_url"
                      name="terms_conditions_url"
                      value={config.terms_conditions_url ?? ""}
                      onChange={handleChange("terms_conditions_url")}
                      placeholder="https://"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white/90">Apparence</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Couleurs et thème appliqués aux interfaces.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="primary_color">Couleur principale</Label>
                    <Input
                      id="primary_color"
                      name="primary_color"
                      type="color"
                      value={config.primary_color ?? ""}
                      onChange={handleChange("primary_color")}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondary_color">Couleur secondaire</Label>
                    <Input
                      id="secondary_color"
                      name="secondary_color"
                      type="color"
                      value={config.secondary_color ?? ""}
                      onChange={handleChange("secondary_color")}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Label htmlFor="theme">Thème</Label>
                    <Input
                      id="theme"
                      name="theme"
                      value={config.theme ?? ""}
                      onChange={handleChange("theme")}
                      placeholder="light / dark"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white/90">
                    Paramètres avancés
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Objet JSON libre pour des préférences supplémentaires.
                  </p>
                </div>
                <div>
                  <Label htmlFor="settings">Paramètres (JSON)</Label>
                  <TextArea
                    id="settings"
                    name="settings"
                    rows={8}
                    value={settingsText}
                    onChange={(value) => setSettingsText(value)}
                    className="font-mono"
                  />
                </div>
              </section>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
            <button
              type="submit"
              disabled={saving || loading}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-theme-sm transition-colors ${
                saving || loading
                  ? "cursor-not-allowed bg-brand-300/70"
                  : "bg-brand-500 hover:bg-brand-600"
              }`}
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationConfigPage;