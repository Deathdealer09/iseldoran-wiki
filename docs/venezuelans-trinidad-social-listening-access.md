# Venezuelans in Trinidad — Social Listening Study

## Access Requirements and Blocker Register

**Edition 1 Version 1**
5 September 2026
12:04

Author: KS Pierre
Creator: KS Pierre
Publisher: KS Pierre
Contributor: Claude

---

## 1. Status

**Study status: NOT STARTED — blocked at data collection.**

No comments were collected. No findings, percentages, quotations, or
demographic breakdowns exist for this study. Nothing in this document
should be read as a result.

Target sample was 5,000+ public comments (Facebook 1,500+, TikTok 2,000+,
Instagram 1,500+). Actual accessible sample: **0**.

---

## 2. Blocker — verified 5 September 2026

Every required host is refused by the environment's egress policy. The
gateway answers `403` to `CONNECT` before any request reaches the platform,
so this is a network policy denial, not a login wall, a CAPTCHA, or a
rate limit.

| Host | Needed for | Result |
|---|---|---|
| `www.facebook.com` | Public post and comment discovery | 403 CONNECT |
| `graph.facebook.com` | Meta API access | 403 CONNECT |
| `www.instagram.com` | Public post and caption discovery | 403 CONNECT |
| `www.tiktok.com` | Public video and comment discovery | 403 CONNECT |
| `open-api.tiktok.com` | TikTok API access | 403 CONNECT |

Verification method: direct `curl` probe of each host plus fetch attempts
through the research tooling. Proxy failure log recorded all five as
`connect_rejected`.

No platform credentials are configured in this environment either, so
lifting the network block alone is necessary but not sufficient.

---

## 3. What unblocking requires

Two independent things must both be in place.

### 3.1 Network allowlist

Add to the environment network allowlist:

```
www.facebook.com
graph.facebook.com
www.instagram.com
www.tiktok.com
open-api.tiktok.com
```

Set under the environment configuration for Claude Code on the web.
Documentation: https://code.claude.com/docs/en/claude-code-on-the-web

### 3.2 Authorized research credentials

Public scraping of these platforms is barred by their terms of service and
by the brief's own integrity rules. Collection must run through the
official research programmes.

**Facebook and Instagram — Meta Content Library API**

- All applications route through ICPSR. Meta grants the user interface;
  ICPSR grants the API.
- Eligibility: researchers affiliated with an academic institution, or a
  not-for-profit whose core activity is scientific or public-interest
  research. Commercial use is not eligible.
- Review time: roughly 2 to 6 weeks.
- Cost as of January 2026: free compute on SOMAR's Virtual Data Enclave
  ended 31 December 2025. SOMAR now charges USD 371 per research team per
  month of VDE access, plus a one-time USD 1,000 project-start fee for
  teams created in 2026 or later. The Meta Secure Research Environment
  offers free computation as the alternative.
- Note: the Content Library runs inside a secure enclave. Data may not be
  exported to this container, which changes where analysis has to happen.

**TikTok — Research API**

- Endpoint required: `POST /v2/research/video/comment/list/`, read-only,
  100 records per request.
- Eligibility: qualifying universities and non-profit academic
  institutions in the US, EEA, UK, Switzerland, and Brazil. Commercial use
  is not eligible.
- Requirements: demonstrable expertise in the research area, a defined
  research proposal, proportionality justification, and evidence of
  completed ethical review.
- Quota: 1,000 requests per day, up to 100,000 records per day across the
  APIs. The 2,000-comment TikTok target sits well inside one day's quota.

---

## 4. Consequences for study design

Three constraints follow from the access routes above and should be
settled before collection begins.

1. **Institutional affiliation is a gate, not a formality.** Both
   programmes require non-commercial academic or public-interest
   affiliation. Without it, neither application succeeds, and there is no
   compliant fallback that reaches the sample targets.

2. **Ethical review must precede the TikTok application.** It is an
   application requirement, not a later step.

3. **Enclave-bound analysis.** Meta Content Library data is analysed
   inside the secure environment. The master dataset for Facebook and
   Instagram will not be exportable in the CSV form the brief specifies;
   only aggregate outputs travel. TikTok data is less restricted. Plan for
   a split pipeline rather than one merged CSV.

---

## 5. What was NOT done

To be explicit, since the brief forbids fabrication:

- No comments were collected from any platform.
- No dataset, theme frequency table, sentiment analysis, cross-tab,
  quotation set, or infographic was produced.
- No substitute source was silently swapped in for social media data.

Published survey research on Venezuelan migrants in Trinidad and Tobago
does exist and is reachable from this environment (IOM Displacement
Tracking Matrix, n=1,323; a food-security study, n=433; healthcare access
studies; Migration Policy Institute analysis). That is a different source
class from social-media listening and was not used, because it was not
what this study asked for.

---

## CHANGE LOG

**Edition 1 Version 1**
5 September 2026

Changes:

- Document created
- Platform reachability verified and recorded
- Blocker register compiled with per-host results
- Network allowlist requirements documented
- Meta Content Library access route and 2026 costs documented
- TikTok Research API access route, endpoint, and quotas documented
- Study design consequences identified
- Explicit non-fabrication statement recorded
