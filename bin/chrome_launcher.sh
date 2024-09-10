#!/bin/bash

# Download Extension
extension_setup() {
  ps_analysis_tool_version=v0.10.1
  extension_dir="/var/tmp"
  cd $extension_dir
  if [ ! -d $extension_dir/ps-analysis-tool-$ps_analysis_tool_version ]; then
    mkdir -p $extension_dir/ps-analysis-tool-$ps_analysis_tool_version
    curl -L -O -s  https://github.com/GoogleChromeLabs/ps-analysis-tool/releases/download/$ps_analysis_tool_version/extension-$ps_analysis_tool_version.zip
    unzip -qo extension-$ps_analysis_tool_version.zip -d $extension_dir/ps-analysis-tool-$ps_analysis_tool_version
  fi
  cd -
}

# Detect OS
if [[ "$(uname)" == "Darwin" ]]; then
  # Loads Chrome with a temporary profile that is deleted after Chrome is closed
  launch_chrome() {
      local CHROME_PATH="/Applications/Google Chrome.app"
      local DATA_DIR="$(mktemp -d '/tmp/chrome_data_dir.XXXXXXXXXX')"
      open -W -na "${CHROME_PATH}" --args \
          --disable-sync \
          --no-default-browser-check \
          --no-first-run \
          --start-maximized \
          --user-data-dir="${DATA_DIR}" \
          --silent-debugger-extension-api \
          "$@" "https://example.com/?psat_cdp=on&psat_multitab=on" >/dev/null 2>&1 && rm -rf "${DATA_DIR}" &
  }
elif [[ "$(uname)" == "Linux" ]]; then
  # Loads Chrome with a temporary profile that is deleted after Chrome is closed
  launch_chrome() {
    local CHROME="google-chrome"
    local DATA_DIR="$(mktemp -d '/tmp/chrome_data_dir.XXXXXXXXXX')"
    "${CHROME}" \
        --disable-sync \
        --no-default-browser-check \
        --no-first-run \
        --start-maximized \
        --user-data-dir="${DATA_DIR}" \
        --silent-debugger-extension-api \
        "$@" "https://example.com/?psat_cdp=on&psat_multitab=on" >/dev/null 2>&1 && rm -rf "${DATA_DIR}" &
    }
fi

# Launch default chrome
chrome-default() {
  launch_chrome \
    --install-autogenerated-theme='255,51,51'
}

# Launch default chrome with 3rd Party Cookie Phaseout
chrome-3pcd() {
  launch_chrome \
    --install-autogenerated-theme='150,220,150' \
    --test-third-party-cookie-phaseout \
    --enable-features="FirstPartySets,StorageAccessAPI,StorageAccessAPIForOriginExtension,PageInfoCookiesSubpage,PrivacySandboxFirstPartySetsUI,TpcdMetadataGrants,TpcdSupportSettings,TpcdHeuristicsGrants:TpcdReadHeuristicsGrants/true/TpcdWritePopupCurrentInteractionHeuristicsGrants/30d/TpcdBackfillPopupHeuristicsGrants/30d/TpcdPopupHeuristicEnableForIframeInitiator/all/TpcdWriteRedirectHeuristicGrants/15m/TpcdRedirectHeuristicRequireABAFlow/true/TpcdRedirectHeuristicRequireCurrentInteraction/true"
}

# Launch default chrome with Privacy Sandbox extension
chrome-default-ps() {
  extension_setup
  launch_chrome \
    --install-autogenerated-theme='255,51,51' \
    --load-extension="$extension_dir/ps-analysis-tool-$ps_analysis_tool_version/extension/"
}

# Launch default chrome with 3rd Party Cookie Phaseout with Privacy Sandbox extension
chrome-3pcd-ps() {
  extension_setup
  launch_chrome \
    --install-autogenerated-theme='150,220,150' \
    --test-third-party-cookie-phaseout \
    --load-extension="$extension_dir/ps-analysis-tool-$ps_analysis_tool_version/extension" \
    --enable-features="FirstPartySets,StorageAccessAPI,StorageAccessAPIForOriginExtension,PageInfoCookiesSubpage,PrivacySandboxFirstPartySetsUI,TpcdMetadataGrants,TpcdSupportSettings,TpcdHeuristicsGrants:TpcdReadHeuristicsGrants/true/TpcdWritePopupCurrentInteractionHeuristicsGrants/30d/TpcdBackfillPopupHeuristicsGrants/30d/TpcdPopupHeuristicEnableForIframeInitiator/all/TpcdWriteRedirectHeuristicGrants/15m/TpcdRedirectHeuristicRequireABAFlow/true/TpcdRedirectHeuristicRequireCurrentInteraction/true"
}

# Launch default chrome with Partitioned Cookies
chrome-chip() {
  launch_chrome \
    --partitioned-cookies=true
}

# Launch Chrome with 3rd Party Cookie Phaseout with demo domains specified as related websites
chrome-rws() {
  launch_chrome \
    --install-autogenerated-theme='150,220,150' \
    --test-third-party-cookie-phaseout \
    --use-related-website-set="{\"primary\": \"https://domain-aaa.com\", \"associatedSites\": [\"https://domain-bbb.com\", \"https://domain-ccc.com\"]}" \
    --enable-features="FirstPartySets,StorageAccessAPI,StorageAccessAPIForOriginExtension,PageInfoCookiesSubpage,PrivacySandboxFirstPartySetsUI,TpcdMetadataGrants,TpcdSupportSettings,TpcdHeuristicsGrants:TpcdReadHeuristicsGrants/true/TpcdWritePopupCurrentInteractionHeuristicsGrants/30d/TpcdBackfillPopupHeuristicsGrants/30d/TpcdPopupHeuristicEnableForIframeInitiator/all/TpcdWriteRedirectHeuristicGrants/15m/TpcdRedirectHeuristicRequireABAFlow/true/TpcdRedirectHeuristicRequireCurrentInteraction/true"
}

# Launch Chrome with 3rd Party Cookie Phaseout with demo domains specified as related websites with Privacy Sandbox extension
chrome-rws-ps() {
  extension_setup
  launch_chrome \
    --install-autogenerated-theme='150,220,150' \
    --test-third-party-cookie-phaseout \
    --use-related-website-set="{\"primary\": \"https://domain-aaa.com\", \"associatedSites\": [\"https://domain-bbb.com\", \"https://domain-ccc.com\"]}" \
    --load-extension="$extension_dir/ps-analysis-tool-$ps_analysis_tool_version/extension" \
    --enable-features="FirstPartySets,StorageAccessAPI,StorageAccessAPIForOriginExtension,PageInfoCookiesSubpage,PrivacySandboxFirstPartySetsUI,TpcdMetadataGrants,TpcdSupportSettings,TpcdHeuristicsGrants:TpcdReadHeuristicsGrants/true/TpcdWritePopupCurrentInteractionHeuristicsGrants/30d/TpcdBackfillPopupHeuristicsGrants/30d/TpcdPopupHeuristicEnableForIframeInitiator/all/TpcdWriteRedirectHeuristicGrants/15m/TpcdRedirectHeuristicRequireABAFlow/true/TpcdRedirectHeuristicRequireCurrentInteraction/true"
}

# Launch Private Advertising Testing Chrome
chrome-pat() {
  launch_chrome \
    --install-autogenerated-theme='0,53,102' \
    --test-third-party-cookie-phaseout \
    --enable-features="PrivacySandboxAdsAPIs,PrivacySandboxAdsAPIsOverride" \
    --privacy-sandbox-enrollment-overrides="https://psat-pat-demos-dsp.dev,https://psat-pat-demos-dsp-a.dev,https://psat-pat-demos-dsp-b.dev,https://psat-pat-demos-dsp-c.dev,https://psat-pat-demos-dsp-d.dev,https://psat-pat-demos-ssp.dev,https://psat-pat-demos-ssp-a.dev,https://psat-pat-demos-ssp-b.dev,https://psat-pat-demos-ssp-c.dev,https://psat-pat-demos-ssp-d.dev,https://psat-pat-demos-ad-server.dev" \
    --enable-privacy-sandbox-ads-apis
}

# Launch Private Advertising Testing Chrome with Privacy Sandbox extension
chrome-pat-ps() {
  extension_setup
  launch_chrome \
    --install-autogenerated-theme='0,53,102' \
    --load-extension="$extension_dir/ps-analysis-tool-$ps_analysis_tool_version/extension" \
    --test-third-party-cookie-phaseout \
    --enable-features="PrivacySandboxAdsAPIs,PrivacySandboxAdsAPIsOverride" \
    --privacy-sandbox-enrollment-overrides="https://psat-pat-demos-dsp.dev,https://psat-pat-demos-dsp-a.dev,https://psat-pat-demos-dsp-b.dev,https://psat-pat-demos-dsp-c.dev,https://psat-pat-demos-dsp-d.dev,https://psat-pat-demos-ssp.dev,https://psat-pat-demos-ssp-a.dev,https://psat-pat-demos-ssp-b.dev,https://psat-pat-demos-ssp-c.dev,https://psat-pat-demos-ssp-d.dev,https://psat-pat-demos-ad-server.dev" \
    --enable-privacy-sandbox-ads-apis
}
