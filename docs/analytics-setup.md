# Analytics setup

The shared page generator installs Google Tag Manager containers `GTM-KNC2VHRX` and `GTM-TCC9M3MR`, and Microsoft Clarity project `zaxdcq1io4` on Home and About Dhi.

Both Google IDs supplied by the owner are GTM containers. No GA4 measurement ID was supplied, so no direct GA4 configuration is invented. Configure and publish the Google tag in the intended GTM container. Avoid configuring the same GA4 page-view tag in both containers, which could duplicate measurements. Clarity is installed directly; do not install a second copy through GTM.

The shared data layer and gtag helper initialize once per page. GTM and Clarity load asynchronously. Build validation checks generated source and production pages; account-side tag publication and receipt of analytics data require verification after deployment.
