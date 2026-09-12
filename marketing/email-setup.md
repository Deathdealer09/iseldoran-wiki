# Email Setup — Connecting the List (MailerLite)

The wiki's signup box (`The Imperial Dispatch`) is live and collecting emails **into your inbox** today via FormSubmit. That's fine for a trickle, but it can't send automated sequences. This is how to switch it to **MailerLite** (free up to 1,000 subscribers, best fit for authors) so the welcome + launch sequences can actually fire.

Everything below is a **one-file, three-constant** change in `IseldoranSagasWiki.jsx` — no backend, no build tooling beyond the existing `npm run build:wiki`.

## 1. Create the account & group (5 min)
1. Go to **mailerlite.com** → sign up (free plan).
2. Verify your sender email/domain when prompted (required before you can send).
3. **Subscribers → Groups → Create group** → name it `Imperial Dispatch`.

## 2. Build the embedded form (3 min)
1. **Forms → Embedded forms → Create embedded form** → assign it to the `Imperial Dispatch` group.
2. Design is irrelevant — the wiki has its own form UI. Just finish the form.
3. Click **Install / Get the code** → choose the **plain HTML** option (not "website builder").
4. In the `<form ... action="...">` snippet, **copy the action URL**. It looks like:
   ```
   https://assets.mailerlite.com/jsonp/123456/forms/7890123/subscribe
   ```

## 3. Wire it into the wiki (1 min)
In `IseldoranSagasWiki.jsx`, near the top (`NEWSLETTER CONFIG` block), set the three constants:
```js
const NEWSLETTER_ACTION = "https://assets.mailerlite.com/jsonp/<ACCOUNT_ID>/forms/<FORM_ID>/subscribe";
const NEWSLETTER_EMAIL_FIELD = "fields[email]";
const NEWSLETTER_MODE = "no-cors";
```
Then rebuild: `npm run build:wiki` and commit. The signup box now writes straight into MailerLite. (The component already handles MailerLite's opaque response — a completed submit shows the "Welcome to the archive" confirmation.)

> **Why `no-cors`:** MailerLite's embedded endpoint doesn't return CORS headers, so the browser can't read the response. The component treats a completed POST as success. Trade-off: the form can't distinguish a genuine failure (e.g. a hard-bounced request) from success — acceptable for a signup box. If you ever want true success/error handling, use the MailerLite API via a tiny serverless proxy instead.

## 4. Turn on double opt-in & load the sequences
1. In MailerLite: **Settings → Subscribe settings → enable Double opt-in** (protects your sender reputation).
2. **Automations → Create automation** → trigger: *when a subscriber joins the `Imperial Dispatch` group*.
3. Build the steps from **`marketing/email-welcome-sequence.md`** (the evergreen welcome flow new signups get).
4. For a book launch, load **`marketing/email-launch-sequence.md`** as a separate campaign/automation timed to your launch date.

## 5. Test
Submit your own email on the live wiki → confirm the opt-in email arrives → confirm you land in the `Imperial Dispatch` group → confirm the welcome automation starts.

---

### Quick reference — provider field names
| Provider | `NEWSLETTER_EMAIL_FIELD` | `NEWSLETTER_MODE` |
|---|---|---|
| FormSubmit (current) | `email` | `cors` |
| **MailerLite (embedded)** | `fields[email]` | `no-cors` |
| Buttondown | `email` | `cors` |
| Kit / ConvertKit | `email_address` | `cors` |
| Mailchimp | `EMAIL` | `cors` |

*Sequences ready to load: `marketing/email-welcome-sequence.md`, `marketing/email-launch-sequence.md`.*
