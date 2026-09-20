package com.sentinela.mobile;

import android.app.Activity;
import android.app.KeyguardManager;
import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.Gravity;
import android.view.View;
import android.view.inputmethod.InputMethodInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends Activity {
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private LinearLayout root;
    private ProgressBar progress;
    private Button scanButton;
    private Button exportButton;
    private CheckBox consent;
    private JSONObject lastJson;
    private static final int REQ_EXPORT = 42;

    private static final Set<String> RISKY = new HashSet<>(Arrays.asList(
            "android.permission.READ_SMS",
            "android.permission.RECEIVE_SMS",
            "android.permission.SEND_SMS",
            "android.permission.READ_CONTACTS",
            "android.permission.WRITE_CONTACTS",
            "android.permission.READ_CALL_LOG",
            "android.permission.WRITE_CALL_LOG",
            "android.permission.RECORD_AUDIO",
            "android.permission.CAMERA",
            "android.permission.ACCESS_FINE_LOCATION",
            "android.permission.ACCESS_COARSE_LOCATION",
            "android.permission.READ_PHONE_STATE",
            "android.permission.CALL_PHONE",
            "android.permission.SYSTEM_ALERT_WINDOW",
            "android.permission.REQUEST_INSTALL_PACKAGES"
    ));

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        buildUi();
    }

    private void buildUi() {
        ScrollView scroll = new ScrollView(this);
        root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(20), dp(24), dp(20), dp(40));
        root.setBackgroundColor(Color.rgb(245,247,250));
        scroll.addView(root);

        TextView brand = txt("SENTINELA MOBILE", 13, true);
        brand.setTextColor(Color.rgb(20,83,45));
        root.addView(brand);

        TextView title = txt("Varredura de segurança do aparelho", 27, true);
        title.setPadding(0, dp(10), 0, dp(8));
        root.addView(title);

        TextView intro = txt("Este diagnóstico verifica configurações de segurança e o inventário de aplicativos deste aparelho. Nada é enviado automaticamente.", 16, false);
        intro.setTextColor(Color.DKGRAY);
        root.addView(intro);

        card("O que será verificado",
                "• versão do Android e patch de segurança\n" +
                "• aplicativos instalados e origem da instalação\n" +
                "• permissões sensíveis declaradas\n" +
                "• serviços de acessibilidade ativos\n" +
                "• administradores do dispositivo\n" +
                "• VPN, ADB e opções de desenvolvedor\n" +
                "• indicadores simples de root/modificação\n\n" +
                "O aplicativo não lê conversas, senhas ou conteúdo privado de outros apps.", false);

        consent = new CheckBox(this);
        consent.setText("Autorizo a análise deste aparelho e entendo quais informações serão verificadas.");
        consent.setTextSize(15);
        consent.setPadding(0, dp(8), 0, dp(8));
        root.addView(consent);

        scanButton = button("INICIAR VARREDURA");
        scanButton.setOnClickListener(v -> startScan());
        root.addView(scanButton);

        progress = new ProgressBar(this);
        progress.setIndeterminate(true);
        progress.setVisibility(View.GONE);
        LinearLayout.LayoutParams pp = new LinearLayout.LayoutParams(dp(42), dp(42));
        pp.gravity = Gravity.CENTER_HORIZONTAL;
        pp.setMargins(0, dp(18), 0, dp(10));
        root.addView(progress, pp);

        exportButton = button("EXPORTAR RELATÓRIO JSON");
        exportButton.setVisibility(View.GONE);
        exportButton.setOnClickListener(v -> export());
        root.addView(exportButton);

        setContentView(scroll);
    }

    private void startScan() {
        if (!consent.isChecked()) {
            Toast.makeText(this, "Marque a autorização antes de iniciar.", Toast.LENGTH_SHORT).show();
            return;
        }
        clearResults();
        scanButton.setEnabled(false);
        exportButton.setVisibility(View.GONE);
        progress.setVisibility(View.VISIBLE);
        executor.submit(() -> {
            ScanResult r = scanDevice();
            runOnUiThread(() -> showResult(r));
        });
    }

    private ScanResult scanDevice() {
        ScanResult out = new ScanResult();
        PackageManager pm = getPackageManager();

        out.manufacturer = Build.MANUFACTURER;
        out.model = Build.MODEL;
        out.androidVersion = Build.VERSION.RELEASE;
        out.sdk = Build.VERSION.SDK_INT;
        out.patch = Build.VERSION.SECURITY_PATCH == null || Build.VERSION.SECURITY_PATCH.isEmpty() ? "não informado" : Build.VERSION.SECURITY_PATCH;

        KeyguardManager km = (KeyguardManager) getSystemService(KEYGUARD_SERVICE);
        out.deviceSecure = km != null && km.isDeviceSecure();

        ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        if (cm != null) {
            try {
                Network n = cm.getActiveNetwork();
                NetworkCapabilities caps = n == null ? null : cm.getNetworkCapabilities(n);
                out.vpn = caps != null && caps.hasTransport(NetworkCapabilities.TRANSPORT_VPN);
            } catch (Exception ignored) {}
        }

        try { out.devOptions = Settings.Global.getInt(getContentResolver(), Settings.Global.DEVELOPMENT_SETTINGS_ENABLED, 0) == 1; } catch (Exception ignored) {}
        try { out.adb = Settings.Global.getInt(getContentResolver(), Settings.Global.ADB_ENABLED, 0) == 1; } catch (Exception ignored) {}

        List<String> rootHits = new ArrayList<>();
        if (Build.TAGS != null && Build.TAGS.contains("test-keys")) rootHits.add("Build test-keys");
        for (String p : new String[]{"/system/bin/su","/system/xbin/su","/sbin/su","/system/app/Superuser.apk","/data/adb/magisk","/sbin/.magisk","/data/local/su"}) {
            try { if (new File(p).exists()) rootHits.add(p); } catch (Exception ignored) {}
        }
        try { pm.getPackageInfo("com.topjohnwu.magisk", 0); rootHits.add("Pacote Magisk visível"); } catch (Exception ignored) {}
        out.rootHits.addAll(rootHits);

        String acc = Settings.Secure.getString(getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);
        if (acc != null && !acc.isEmpty()) {
            for (String s : acc.split(":")) if (!s.trim().isEmpty()) out.accessibility.add(s.trim());
        }

        DevicePolicyManager dpm = (DevicePolicyManager) getSystemService(DEVICE_POLICY_SERVICE);
        try {
            List<ComponentName> admins = dpm == null ? null : dpm.getActiveAdmins();
            if (admins != null) for (ComponentName c : admins) out.admins.add(c.flattenToShortString());
        } catch (Exception ignored) {}

        try {
            InputMethodManager imm = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
            List<InputMethodInfo> imes = imm == null ? new ArrayList<>() : imm.getEnabledInputMethodList();
            out.defaultKeyboard = Settings.Secure.getString(getContentResolver(), Settings.Secure.DEFAULT_INPUT_METHOD);
            if (imes.size() > 4) out.findings.add(new Finding("INFO", "Muitos teclados habilitados", imes.size() + " métodos de entrada estão habilitados. Revise os que você não reconhece."));
        } catch (Exception ignored) {}

        Set<String> accPkgs = new HashSet<>();
        for (String s : out.accessibility) {
            ComponentName c = ComponentName.unflattenFromString(s);
            if (c != null) accPkgs.add(c.getPackageName());
        }
        Set<String> adminPkgs = new HashSet<>();
        for (String s : out.admins) {
            ComponentName c = ComponentName.unflattenFromString(s);
            if (c != null) adminPkgs.add(c.getPackageName());
        }

        List<PackageInfo> packages;
        try { packages = pm.getInstalledPackages(PackageManager.GET_PERMISSIONS); }
        catch (Exception e) { packages = new ArrayList<>(); }

        for (PackageInfo pi : packages) {
            if (pi.applicationInfo == null) continue;
            AppInfo a = new AppInfo();
            a.pkg = pi.packageName;
            CharSequence lbl = pm.getApplicationLabel(pi.applicationInfo);
            a.label = lbl == null ? a.pkg : lbl.toString();
            a.version = pi.versionName == null ? "" : pi.versionName;
            a.system = (pi.applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0 ||
                    (pi.applicationInfo.flags & ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0;
            a.accessibility = accPkgs.contains(a.pkg);
            a.admin = adminPkgs.contains(a.pkg);
            try {
                if (Build.VERSION.SDK_INT >= 30) {
                    String s = pm.getInstallSourceInfo(a.pkg).getInstallingPackageName();
                    a.installer = s == null ? "desconhecido" : s;
                } else {
                    String s = pm.getInstallerPackageName(a.pkg);
                    a.installer = s == null ? "desconhecido" : s;
                }
            } catch (Exception e) { a.installer = "indisponível"; }

            if (pi.requestedPermissions != null) {
                for (String p : pi.requestedPermissions) if (RISKY.contains(p)) a.permissions.add(shortPerm(p));
            }

            if (a.accessibility && !a.system) a.score += 4;
            if (a.admin && !a.system) a.score += 4;
            if (!a.system && sideloaded(a.installer)) a.score += 2;
            if (a.permissions.contains("SYSTEM_ALERT_WINDOW")) a.score += 2;
            if (a.permissions.contains("REQUEST_INSTALL_PACKAGES")) a.score += 2;
            if (a.permissions.contains("READ_SMS") || a.permissions.contains("READ_CALL_LOG")) a.score += 2;

            out.apps.add(a);
            if (a.score >= 7) out.findings.add(new Finding("ALTO", "Aplicativo exige revisão: " + a.label, riskText(a)));
            else if (a.score >= 4) out.findings.add(new Finding("ATENÇÃO", "Aplicativo com privilégios relevantes: " + a.label, riskText(a)));
        }

        if (!out.rootHits.isEmpty()) out.findings.add(new Finding("ALTO", "Indicadores de root/modificação", String.join(", ", out.rootHits)));
        if (out.adb) out.findings.add(new Finding("ATENÇÃO", "Depuração ADB habilitada", "Desative a depuração USB/ADB se não estiver usando desenvolvimento ou manutenção técnica."));
        if (out.devOptions) out.findings.add(new Finding("INFO", "Opções de desenvolvedor habilitadas", "Não é necessariamente um problema, mas habilita configurações avançadas."));
        if (!out.deviceSecure) out.findings.add(new Finding("ATENÇÃO", "Sem bloqueio de tela seguro", "Configure PIN, senha ou outro bloqueio forte."));
        if (out.vpn) out.findings.add(new Finding("INFO", "VPN ativa", "Confirme se a VPN ativa é conhecida e esperada."));
        if (!out.accessibility.isEmpty()) out.findings.add(new Finding("INFO", "Serviços de acessibilidade ativos", String.join("\n", out.accessibility)));
        if (!out.admins.isEmpty()) out.findings.add(new Finding("INFO", "Administradores do dispositivo ativos", String.join("\n", out.admins)));

        out.json = toJson(out);
        return out;
    }

    private JSONObject toJson(ScanResult r) {
        JSONObject o = new JSONObject();
        try {
            o.put("schema", "sentinela-mobile-report-v1");
            o.put("scannedAt", System.currentTimeMillis());
            JSONObject d = new JSONObject();
            d.put("manufacturer", r.manufacturer);
            d.put("model", r.model);
            d.put("androidVersion", r.androidVersion);
            d.put("sdk", r.sdk);
            d.put("securityPatch", r.patch);
            d.put("deviceSecure", r.deviceSecure);
            d.put("vpnActive", r.vpn);
            d.put("developerOptions", r.devOptions);
            d.put("adbEnabled", r.adb);
            d.put("rootIndicators", new JSONArray(r.rootHits));
            d.put("defaultKeyboard", r.defaultKeyboard == null ? "" : r.defaultKeyboard);
            d.put("enabledAccessibilityServices", new JSONArray(r.accessibility));
            d.put("activeDeviceAdmins", new JSONArray(r.admins));
            o.put("device", d);

            JSONArray fs = new JSONArray();
            for (Finding f : r.findings) {
                JSONObject x = new JSONObject();
                x.put("severity", f.severity); x.put("title", f.title); x.put("detail", f.detail);
                fs.put(x);
            }
            o.put("findings", fs);

            JSONArray apps = new JSONArray();
            for (AppInfo a : r.apps) {
                JSONObject x = new JSONObject();
                x.put("label", a.label); x.put("packageName", a.pkg); x.put("versionName", a.version);
                x.put("installer", a.installer); x.put("systemApp", a.system);
                x.put("accessibilityEnabled", a.accessibility); x.put("deviceAdmin", a.admin);
                x.put("riskyPermissions", new JSONArray(a.permissions)); x.put("riskScore", a.score);
                apps.put(x);
            }
            o.put("apps", apps);
        } catch (Exception ignored) {}
        return o;
    }

    private void showResult(ScanResult r) {
        lastJson = r.json;
        progress.setVisibility(View.GONE);
        scanButton.setEnabled(true);
        exportButton.setVisibility(View.VISIBLE);

        TextView heading = txt("Resultado", 22, true);
        heading.setPadding(0, dp(22), 0, dp(6));
        heading.setTag("result");
        root.addView(heading);

        String summary =
                "Aparelho: " + r.manufacturer + " " + r.model + "\n" +
                "Android: " + r.androidVersion + " (API " + r.sdk + ")\n" +
                "Patch: " + r.patch + "\n" +
                "Apps analisados: " + r.apps.size() + "\n" +
                "VPN ativa: " + yesNo(r.vpn) + "\n" +
                "Bloqueio seguro: " + yesNo(r.deviceSecure) + "\n" +
                "Opções de desenvolvedor: " + yesNo(r.devOptions) + "\n" +
                "ADB: " + yesNo(r.adb) + "\n" +
                "Indicadores de root: " + yesNo(!r.rootHits.isEmpty()) + "\n" +
                "Achados: " + r.findings.size();
        card("Resumo", summary, true);

        if (r.findings.isEmpty()) {
            card("Nenhum alerta relevante", "Nenhum indicador de destaque foi encontrado. Isso reduz suspeitas, mas não prova ausência absoluta de malware.", true);
        } else {
            for (Finding f : r.findings) card(f.severity + " — " + f.title, f.detail, true);
        }

        TextView note = txt("A classificação é heurística. Um aplicativo aparecer como atenção não significa, sozinho, que seja malware.", 13, false);
        note.setTextColor(Color.GRAY);
        note.setPadding(0, dp(14), 0, dp(8));
        note.setTag("result");
        root.addView(note);
    }

    private void export() {
        if (lastJson == null) return;
        Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("application/json");
        i.putExtra(Intent.EXTRA_TITLE, "sentinela-relatorio.json");
        startActivityForResult(i, REQ_EXPORT);
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_EXPORT && resultCode == RESULT_OK && data != null && lastJson != null) {
            Uri uri = data.getData();
            if (uri == null) return;
            try (OutputStream out = getContentResolver().openOutputStream(uri)) {
                if (out != null) out.write(lastJson.toString(2).getBytes(StandardCharsets.UTF_8));
                Toast.makeText(this, "Relatório salvo.", Toast.LENGTH_SHORT).show();
            } catch (Exception e) {
                Toast.makeText(this, "Não foi possível salvar o relatório.", Toast.LENGTH_LONG).show();
            }
        }
    }

    private void clearResults() {
        for (int i = root.getChildCount() - 1; i >= 0; i--) {
            View v = root.getChildAt(i);
            if ("result".equals(v.getTag())) root.removeViewAt(i);
        }
    }

    private boolean sideloaded(String installer) {
        if (installer == null || installer.equals("desconhecido")) return true;
        if (installer.equals("indisponível")) return false;
        return !(installer.equals("com.android.vending") ||
                installer.equals("com.google.android.packageinstaller") ||
                installer.equals("com.android.packageinstaller") ||
                installer.equals("com.sec.android.app.samsungapps") ||
                installer.equals("com.huawei.appmarket") ||
                installer.equals("com.xiaomi.mipicks"));
    }

    private String riskText(AppInfo a) {
        List<String> reasons = new ArrayList<>();
        if (a.accessibility) reasons.add("acessibilidade ativa");
        if (a.admin) reasons.add("administrador do dispositivo");
        if (sideloaded(a.installer)) reasons.add("origem externa/desconhecida: " + a.installer);
        if (!a.permissions.isEmpty()) reasons.add("permissões sensíveis: " + String.join(", ", a.permissions));
        return "Pacote: " + a.pkg + ". Sinais: " + String.join("; ", reasons) + ". É um indicador para revisão, não confirmação de malware.";
    }

    private String shortPerm(String p) {
        int i = p.lastIndexOf('.');
        return i >= 0 ? p.substring(i + 1) : p;
    }

    private void card(String heading, String body, boolean result) {
        LinearLayout c = new LinearLayout(this);
        c.setOrientation(LinearLayout.VERTICAL);
        c.setPadding(dp(16), dp(15), dp(16), dp(15));
        c.setBackgroundColor(Color.WHITE);
        c.setElevation(dp(2));
        if (result) c.setTag("result");
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, -2);
        lp.setMargins(0, dp(14), 0, 0);

        TextView h = txt(heading, 16, true);
        TextView b = txt(body, 14, false);
        b.setTextColor(Color.DKGRAY);
        b.setPadding(0, dp(7), 0, 0);
        c.addView(h); c.addView(b);
        root.addView(c, lp);
    }

    private TextView txt(String s, int sp, boolean bold) {
        TextView t = new TextView(this);
        t.setText(s); t.setTextSize(sp); t.setTextColor(Color.rgb(20,27,35));
        t.setLineSpacing(0, 1.12f);
        if (bold) t.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        return t;
    }

    private Button button(String s) {
        Button b = new Button(this);
        b.setText(s); b.setTextSize(15); b.setAllCaps(false);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, dp(52));
        lp.setMargins(0, dp(16), 0, 0);
        b.setLayoutParams(lp);
        return b;
    }

    private int dp(int v) { return (int)(v * getResources().getDisplayMetrics().density + 0.5f); }
    private String yesNo(boolean b) { return b ? "sim" : "não"; }

    static class Finding {
        String severity, title, detail;
        Finding(String s, String t, String d) { severity=s; title=t; detail=d; }
    }

    static class AppInfo {
        String label="", pkg="", version="", installer="";
        boolean system, accessibility, admin;
        int score;
        List<String> permissions = new ArrayList<>();
    }

    static class ScanResult {
        String manufacturer="", model="", androidVersion="", patch="", defaultKeyboard="";
        int sdk;
        boolean deviceSecure, vpn, devOptions, adb;
        List<String> rootHits = new ArrayList<>();
        List<String> accessibility = new ArrayList<>();
        List<String> admins = new ArrayList<>();
        List<AppInfo> apps = new ArrayList<>();
        List<Finding> findings = new ArrayList<>();
        JSONObject json;
    }
}
