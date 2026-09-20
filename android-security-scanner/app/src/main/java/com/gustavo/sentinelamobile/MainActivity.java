package com.gustavo.sentinelamobile;

import android.Manifest;
import android.app.Activity;
import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.InstallSourceInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.content.pm.ServiceInfo;
import android.graphics.Typeface;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.VpnService;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.TextView;

import java.io.File;
import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends Activity {

    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private TextView resultView;
    private TextView scoreView;
    private ProgressBar progress;
    private Button scanButton;
    private Button shareButton;
    private String latestReport = "";

    private static final Set<String> SENSITIVE_PERMISSIONS = new HashSet<>(Arrays.asList(
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.CAMERA,
            Manifest.permission.READ_CONTACTS,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.READ_SMS,
            Manifest.permission.RECEIVE_SMS,
            Manifest.permission.SEND_SMS,
            Manifest.permission.READ_CALL_LOG,
            Manifest.permission.WRITE_CALL_LOG,
            Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.READ_CALENDAR,
            Manifest.permission.WRITE_CALENDAR
    ));

    private static final Set<String> TRUSTED_INSTALLERS = new HashSet<>(Arrays.asList(
            "com.android.vending",
            "com.sec.android.app.samsungapps",
            "com.huawei.appmarket",
            "com.xiaomi.mipicks",
            "com.amazon.venezia"
    ));

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(buildUi());
        scanButton.setOnClickListener(v -> runScan());
        shareButton.setOnClickListener(v -> shareReport());
        runScan();
    }

    private View buildUi() {
        int pad = dp(18);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(pad, pad, pad, pad);

        TextView title = new TextView(this);
        title.setText("Sentinela Mobile");
        title.setTextSize(28);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        root.addView(title);

        TextView subtitle = new TextView(this);
        subtitle.setText("Diagnóstico local de sinais de risco no Android. Não lê mensagens, senhas ou fotos.");
        subtitle.setTextSize(15);
        subtitle.setPadding(0, dp(6), 0, dp(14));
        root.addView(subtitle);

        scoreView = new TextView(this);
        scoreView.setText("Aguardando análise…");
        scoreView.setTextSize(20);
        scoreView.setTypeface(Typeface.DEFAULT_BOLD);
        scoreView.setPadding(0, 0, 0, dp(12));
        root.addView(scoreView);

        LinearLayout buttons = new LinearLayout(this);
        buttons.setOrientation(LinearLayout.HORIZONTAL);

        scanButton = new Button(this);
        scanButton.setText("Iniciar varredura");
        buttons.addView(scanButton, new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f));

        shareButton = new Button(this);
        shareButton.setText("Compartilhar relatório");
        shareButton.setEnabled(false);
        LinearLayout.LayoutParams shareParams = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f);
        shareParams.setMarginStart(dp(8));
        buttons.addView(shareButton, shareParams);

        root.addView(buttons);

        progress = new ProgressBar(this);
        progress.setIndeterminate(true);
        progress.setVisibility(View.GONE);
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        p.gravity = Gravity.CENTER_HORIZONTAL;
        p.topMargin = dp(10);
        root.addView(progress, p);

        ScrollView scroll = new ScrollView(this);
        resultView = new TextView(this);
        resultView.setTextSize(14);
        resultView.setTextIsSelectable(true);
        resultView.setPadding(0, dp(12), 0, dp(30));
        scroll.addView(resultView);
        root.addView(scroll, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, 0, 1f));

        return root;
    }

    private void runScan() {
        scanButton.setEnabled(false);
        shareButton.setEnabled(false);
        progress.setVisibility(View.VISIBLE);
        scoreView.setText("Analisando o aparelho…");
        resultView.setText("Coletando somente indicadores de segurança disponíveis ao próprio Android.");

        executor.submit(() -> {
            ScanResult result = scanDevice();
            latestReport = result.report;
            runOnUiThread(() -> {
                progress.setVisibility(View.GONE);
                scanButton.setEnabled(true);
                shareButton.setEnabled(true);
                scoreView.setText("Risco: " + result.level + " • " + result.score + "/100");
                resultView.setText(result.report);
            });
        });
    }

    private ScanResult scanDevice() {
        List<String> findings = new ArrayList<>();
        List<String> reviewApps = new ArrayList<>();
        List<String> accessibilityApps = new ArrayList<>();
        List<String> adminApps = new ArrayList<>();
        List<String> vpnApps = new ArrayList<>();
        List<String> installerApps = new ArrayList<>();

        int score = 0;

        boolean devOptions = readGlobalFlag(Settings.Global.DEVELOPMENT_SETTINGS_ENABLED);
        boolean adbEnabled = readGlobalFlag(Settings.Global.ADB_ENABLED);

        if (devOptions) {
            findings.add("ATENÇÃO • Opções do desenvolvedor estão ativadas.");
            score += 5;
        } else {
            findings.add("OK • Opções do desenvolvedor desativadas.");
        }

        if (adbEnabled) {
            findings.add("ALTO • Depuração ADB está ativada. Desative se não estiver usando.");
            score += 15;
        } else {
            findings.add("OK • Depuração ADB não detectada.");
        }

        List<String> rootSignals = rootSignals();
        if (!rootSignals.isEmpty()) {
            findings.add("ALTO • Foram encontrados indícios de root: " + TextUtils.join(", ", rootSignals) + ".");
            score += 30;
        } else {
            findings.add("OK • Nenhum indício básico de root encontrado.");
        }

        collectAccessibility(accessibilityApps);
        if (!accessibilityApps.isEmpty()) {
            findings.add("ATENÇÃO • Serviços de acessibilidade ativos: " + accessibilityApps.size() + ". Revise se reconhece todos.");
            score += Math.min(24, accessibilityApps.size() * 8);
        } else {
            findings.add("OK • Nenhum serviço de acessibilidade de terceiros identificado como ativo.");
        }

        collectDeviceAdmins(adminApps);
        if (!adminApps.isEmpty()) {
            findings.add("ATENÇÃO • Administradores do dispositivo ativos: " + adminApps.size() + ". Revise se reconhece todos.");
            score += Math.min(20, adminApps.size() * 10);
        } else {
            findings.add("OK • Nenhum administrador de dispositivo listado.");
        }

        boolean activeVpn = isVpnActive();
        collectVpnApps(vpnApps);
        if (activeVpn) {
            findings.add("INFO • Há uma VPN ativa agora. Isso pode ser legítimo; confirme se foi você quem ativou.");
            score += 3;
        } else {
            findings.add("OK • Nenhuma VPN ativa detectada no momento.");
        }

        PackageManager pm = getPackageManager();
        List<PackageInfo> packages;
        try {
            packages = pm.getInstalledPackages(PackageManager.GET_PERMISSIONS | PackageManager.GET_SERVICES);
        } catch (Throwable t) {
            packages = Collections.emptyList();
        }

        for (PackageInfo pi : packages) {
            if (pi.applicationInfo == null) continue;
            boolean system = (pi.applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0;
            if (system) continue;

            String label = safeLabel(pm, pi.applicationInfo);
            List<String> grantedSensitive = grantedSensitivePermissions(pi);
            boolean requestsInstaller = requestsPermission(pi, Manifest.permission.REQUEST_INSTALL_PACKAGES);
            boolean providesAccessibility = providesAccessibilityService(pi);
            String installer = installerOf(pm, pi.packageName);
            boolean unknownSource = installer == null || installer.trim().isEmpty();

            if (requestsInstaller) {
                installerApps.add(label + " (" + pi.packageName + ")");
            }

            boolean needsReview = false;
            List<String> reasons = new ArrayList<>();
            if (grantedSensitive.size() >= 5) {
                needsReview = true;
                reasons.add(grantedSensitive.size() + " permissões sensíveis concedidas");
            }
            if (unknownSource && grantedSensitive.size() >= 3) {
                needsReview = true;
                reasons.add("origem de instalação não identificada");
                score += 4;
            }
            if (installer != null && !TRUSTED_INSTALLERS.contains(installer) && grantedSensitive.size() >= 4) {
                needsReview = true;
                reasons.add("instalador: " + installer);
            }
            if (requestsInstaller && grantedSensitive.size() >= 2) {
                needsReview = true;
                reasons.add("pode solicitar instalação de APKs");
                score += 3;
            }
            if (providesAccessibility && enabledAccessibilityPackage(pi.packageName)) {
                needsReview = true;
                reasons.add("serviço de acessibilidade habilitado");
            }

            if (needsReview) {
                reviewApps.add(label + " • " + pi.packageName + " • " + TextUtils.join("; ", reasons));
            }
        }

        if (!installerApps.isEmpty()) {
            findings.add("INFO • " + installerApps.size() + " app(s) declaram capacidade de solicitar instalação de outros pacotes.");
        }

        score = Math.min(100, score);
        String level = score >= 45 ? "ALTO" : score >= 20 ? "ATENÇÃO" : "BAIXO";

        Comparator<String> sorter = String.CASE_INSENSITIVE_ORDER;
        accessibilityApps.sort(sorter);
        adminApps.sort(sorter);
        vpnApps.sort(sorter);
        installerApps.sort(sorter);
        reviewApps.sort(sorter);

        StringBuilder r = new StringBuilder();
        r.append("SENTINELA MOBILE — RELATÓRIO LOCAL\n");
        r.append(DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.MEDIUM, Locale.getDefault()).format(new Date())).append("\n\n");
        r.append("Aparelho: ").append(Build.MANUFACTURER).append(" ").append(Build.MODEL).append("\n");
        r.append("Android: ").append(Build.VERSION.RELEASE).append(" (API ").append(Build.VERSION.SDK_INT).append(")\n");
        r.append("Classificação: ").append(level).append(" — ").append(score).append("/100\n\n");

        r.append("RESUMO\n");
        for (String f : findings) r.append("• ").append(f).append("\n");

        appendSection(r, "SERVIÇOS DE ACESSIBILIDADE ATIVOS", accessibilityApps);
        appendSection(r, "ADMINISTRADORES DO DISPOSITIVO", adminApps);
        appendSection(r, "APPS COM SERVIÇO VPN", vpnApps);
        appendSection(r, "APPS QUE PODEM SOLICITAR INSTALAÇÃO DE APK", installerApps);
        appendSection(r, "APPS PARA REVISÃO MANUAL", reviewApps);

        r.append("\nCOMO INTERPRETAR\n");
        r.append("• Este relatório não prova que o celular foi clonado.\n");
        r.append("• Acessibilidade, administrador, VPN, ADB e root podem ser legítimos, mas merecem confirmação do dono do aparelho.\n");
        r.append("• Em 'Apps para revisão manual', confirme se o usuário reconhece o app, sua origem e por que ele possui essas permissões.\n");
        r.append("• Se houver item desconhecido com acessibilidade ou administrador ativo, remova o acesso antes de desinstalar o app.\n");
        r.append("• Para suspeita de conta clonada, também revise sessões conectadas dentro do WhatsApp, Google, Apple, Instagram e e-mail; isso não é visível de forma confiável para um APK comum.\n\n");
        r.append("PRIVACIDADE\n");
        r.append("A varredura é local. O app não lê mensagens, senhas, fotos ou conteúdo privado de outros aplicativos e não envia o relatório automaticamente para servidor.");

        return new ScanResult(score, level, r.toString());
    }

    private void collectAccessibility(List<String> out) {
        String raw;
        try {
            raw = Settings.Secure.getString(getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);
        } catch (Throwable t) {
            return;
        }
        if (raw == null || raw.trim().isEmpty()) return;

        PackageManager pm = getPackageManager();
        for (String item : raw.split(":")) {
            ComponentName c = ComponentName.unflattenFromString(item);
            if (c == null) continue;
            String pkg = c.getPackageName();
            if (pkg.equals(getPackageName())) continue;
            out.add(appLabelByPackage(pm, pkg) + " (" + pkg + ")");
        }
    }

    private boolean enabledAccessibilityPackage(String pkg) {
        String raw = Settings.Secure.getString(getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);
        if (raw == null) return false;
        for (String item : raw.split(":")) {
            ComponentName c = ComponentName.unflattenFromString(item);
            if (c != null && pkg.equals(c.getPackageName())) return true;
        }
        return false;
    }

    private void collectDeviceAdmins(List<String> out) {
        try {
            DevicePolicyManager dpm = (DevicePolicyManager) getSystemService(Context.DEVICE_POLICY_SERVICE);
            List<ComponentName> admins = dpm.getActiveAdmins();
            if (admins == null) return;
            PackageManager pm = getPackageManager();
            for (ComponentName c : admins) {
                String pkg = c.getPackageName();
                out.add(appLabelByPackage(pm, pkg) + " (" + pkg + ")");
            }
        } catch (Throwable ignored) {
        }
    }

    private void collectVpnApps(List<String> out) {
        try {
            Intent vpnIntent = new Intent(VpnService.SERVICE_INTERFACE);
            List<ResolveInfo> services = getPackageManager().queryIntentServices(vpnIntent, PackageManager.MATCH_ALL);
            Set<String> seen = new HashSet<>();
            for (ResolveInfo ri : services) {
                ServiceInfo si = ri.serviceInfo;
                if (si == null) continue;
                if (!seen.add(si.packageName)) continue;
                out.add(appLabelByPackage(getPackageManager(), si.packageName) + " (" + si.packageName + ")");
            }
        } catch (Throwable ignored) {
        }
    }

    private boolean isVpnActive() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            Network n = cm.getActiveNetwork();
            if (n == null) return false;
            NetworkCapabilities caps = cm.getNetworkCapabilities(n);
            return caps != null && caps.hasTransport(NetworkCapabilities.TRANSPORT_VPN);
        } catch (Throwable t) {
            return false;
        }
    }

    private boolean readGlobalFlag(String key) {
        try {
            return Settings.Global.getInt(getContentResolver(), key, 0) == 1;
        } catch (Throwable t) {
            return false;
        }
    }

    private List<String> rootSignals() {
        List<String> signals = new ArrayList<>();
        if (Build.TAGS != null && Build.TAGS.contains("test-keys")) signals.add("build test-keys");

        String[] paths = {
                "/system/bin/su", "/system/xbin/su", "/sbin/su",
                "/system/app/Superuser.apk", "/system/app/Magisk.apk",
                "/data/adb/magisk", "/data/local/su"
        };
        for (String p : paths) {
            try {
                if (new File(p).exists()) signals.add(p);
            } catch (Throwable ignored) {
            }
        }
        return signals;
    }

    private List<String> grantedSensitivePermissions(PackageInfo pi) {
        List<String> result = new ArrayList<>();
        if (pi.requestedPermissions == null || pi.requestedPermissionsFlags == null) return result;
        for (int i = 0; i < pi.requestedPermissions.length; i++) {
            String p = pi.requestedPermissions[i];
            if (!SENSITIVE_PERMISSIONS.contains(p)) continue;
            if ((pi.requestedPermissionsFlags[i] & PackageInfo.REQUESTED_PERMISSION_GRANTED) != 0) {
                result.add(shortPermission(p));
            }
        }
        return result;
    }

    private boolean requestsPermission(PackageInfo pi, String permission) {
        if (pi.requestedPermissions == null) return false;
        for (String p : pi.requestedPermissions) {
            if (permission.equals(p)) return true;
        }
        return false;
    }

    private boolean providesAccessibilityService(PackageInfo pi) {
        if (pi.services == null) return false;
        for (ServiceInfo s : pi.services) {
            if (Manifest.permission.BIND_ACCESSIBILITY_SERVICE.equals(s.permission)) return true;
        }
        return false;
    }

    private String installerOf(PackageManager pm, String pkg) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                InstallSourceInfo info = pm.getInstallSourceInfo(pkg);
                return info.getInstallingPackageName();
            }
            return pm.getInstallerPackageName(pkg);
        } catch (Throwable t) {
            return null;
        }
    }

    private String appLabelByPackage(PackageManager pm, String pkg) {
        try {
            ApplicationInfo ai = pm.getApplicationInfo(pkg, 0);
            return safeLabel(pm, ai);
        } catch (Throwable t) {
            return pkg;
        }
    }

    private String safeLabel(PackageManager pm, ApplicationInfo ai) {
        try {
            CharSequence cs = pm.getApplicationLabel(ai);
            return cs == null ? ai.packageName : cs.toString();
        } catch (Throwable t) {
            return ai.packageName;
        }
    }

    private String shortPermission(String p) {
        int idx = p.lastIndexOf('.');
        return idx >= 0 ? p.substring(idx + 1) : p;
    }

    private void appendSection(StringBuilder r, String title, List<String> items) {
        r.append("\n").append(title).append("\n");
        if (items.isEmpty()) {
            r.append("• Nenhum item listado.\n");
            return;
        }
        for (String item : items) r.append("• ").append(item).append("\n");
    }

    private void shareReport() {
        if (latestReport == null || latestReport.trim().isEmpty()) return;
        Intent share = new Intent(Intent.ACTION_SEND);
        share.setType("text/plain");
        share.putExtra(Intent.EXTRA_SUBJECT, "Relatório Sentinela Mobile");
        share.putExtra(Intent.EXTRA_TEXT, latestReport);
        startActivity(Intent.createChooser(share, "Compartilhar relatório"));
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    @Override
    protected void onDestroy() {
        executor.shutdownNow();
        super.onDestroy();
    }

    private static class ScanResult {
        final int score;
        final String level;
        final String report;

        ScanResult(int score, String level, String report) {
            this.score = score;
            this.level = level;
            this.report = report;
        }
    }
}
