# LINE Messaging API – Setup

Line-berichten komen binnen via de webhook en verschijnen in de e-mailassistent met een **💬 Line**-badge.

## 1. LINE Developers Console

1. Ga naar [LINE Developers Console](https://developers.line.biz/console/).
2. Maak een **Provider** aan (of kies een bestaande).
3. Maak een **Messaging API-kanaal** aan (niet LINE Login).
4. Noteer:
   - **Channel secret** (tab “Basic settings”) → dit wordt `LINE_CHANNEL_SECRET`.
   - **Channel access token** (tab “Messaging API”, lange en korte token) → dit wordt `LINE_CHANNEL_ACCESS_TOKEN`.
5. Onder **Messaging API**:
   - **Webhook URL**: `https://<jouw-domein>/api/webhooks/line`  
     (bijv. `https://www.savedsouls-foundation.com/api/webhooks/line`).
   - Zet **Use webhook** op **Enabled**.
   - **Webhook “Verify”** mag falen tot de route live staat; daarna zou die groen moeten zijn.
6. Optioneel: onder **Messaging API** kun je **Auto-reply messages** uitzetten zodat alleen jouw bot antwoordt.

## 2. Vercel environment variables

Voeg in Vercel → Project → Settings → Environment Variables toe:

| Naam | Waarde | Opmerking |
|------|--------|-----------|
| `LINE_CHANNEL_SECRET` | Channel secret uit de Console | Verplicht voor webhook-verificatie. |
| `LINE_CHANNEL_ACCESS_TOKEN` | Channel access token (long-lived) | Nodig voor later “antwoord via Line” vanuit het dashboard. |

Redeploy na het toevoegen van de variabelen.

## 3. Wat er nu werkt

- **Webhook** `POST /api/webhooks/line`: ontvangt Line-berichten, verifieert handtekening, slaat ze op in `incoming_emails` met `bron: 'line'`.
- In de **e-mailassistent** krijgen deze rijen de badge **💬 Line**.

## 4. Later: antwoord via Line

Om vanuit het dashboard rechtstreeks via Line te antwoorden is nog nodig:

- Opslaan van `reply_token` of `line_user_id` per inkomend Line-bericht (bijv. extra kolom of JSON in een bestaande kolom).
- Een API-route die met `LINE_CHANNEL_ACCESS_TOKEN` de Line Messaging API aanroept (reply of push message) en die vanuit de e-mailassistent wordt gebruikt.

Die stappen kunnen in een volgende iteratie worden toegevoegd.
