# Geautomatiseerd e-mailen naar shelters

De e-mailadressen van alle shelters staan in `data/`. Gebruik deze voor link-uitwisseling of andere campagnes.

## Bestanden

| Bestand | Gebruik |
|---------|---------|
| `data/shelter-emails.txt` | Eén e-mail per regel – voor BCC of simpele mail merge |
| `data/shelter-emails.csv` | Naam, e-mail, locatie – voor gepersonaliseerde mail merge |

## Lijst opnieuw genereren

Na wijzigingen in de shelters-pagina:

```bash
node scripts/export-shelter-emails.mjs
```

---

## Methode 1: Gmail (handmatig / BCC)

1. Open Gmail en maak een nieuw bericht
2. Kopieer alle adressen uit `data/shelter-emails.txt`
3. Plak ze in het **BCC**-veld (niet in Aan – dan ziet niemand elkaars adres)
4. Schrijf je bericht en verstuur

**Let op:** Gmail heeft een limiet van ca. 500 ontvangers per dag. Splits de lijst indien nodig.

---

## Methode 2: Gmail + Google Sheets (mail merge)

1. Upload `data/shelter-emails.csv` naar Google Sheets
2. Installeer de add-on **Yet Another Mail Merge** of **Mail Merge for Gmail**
3. Schrijf een template met placeholders, bijv.:
   - `{{name}}` voor de organisatienaam
   - `{{email}}` voor het e-mailadres
   - `{{location}}` voor de locatie
4. Laat de add-on de mails per ontvanger versturen (met pauzes om spamfilters te vermijden)

---

## Methode 3: Mailchimp / Brevo (Sendinblue)

1. Maak een account bij [Mailchimp](https://mailchimp.com) of [Brevo](https://brevo.com)
2. Importeer `data/shelter-emails.csv` als contacten
3. Maak een campagne en gebruik merge tags voor personalisatie
4. Verstuur in batches (bijv. 50 per dag) om spamrisico te beperken

---

## Methode 4: Python-script (volledig geautomatiseerd)

Voor grotere campagnes kun je een script gebruiken met SMTP of een API:

```python
import csv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time

with open("data/shelter-emails.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        msg = MIMEMultipart()
        msg["Subject"] = f"Link-uitwisseling: Saved Souls Foundation ↔ {row['name']}"
        msg["From"] = "info@savedsouls-foundation.org"
        msg["To"] = row["email"]
        
        body = f"""Beste team van {row['name']},

[Je bericht hier - zie docs/email-link-uitwisseling.md voor template]

Met vriendelijke groet,
Saved Souls Foundation
"""
        msg.attach(MIMEText(body, "plain"))
        
        with smtplib.SMTP("smtp.jouw-provider.nl", 587) as server:
            server.starttls()
            server.login("jouw@email.nl", "wachtwoord")
            server.send_message(msg)
        
        time.sleep(5)  # Pauze tussen mails (anti-spam)
```

---

## Aanbevelingen

1. **Verstuur niet alles tegelijk** – 10–20 mails per uur voorkomt spamfilters
2. **Personaliseer** – gebruik de naam van het asiel in de aanhef
3. **Test eerst** – stuur eerst naar jezelf of een testadres
4. **Bewaar een kopie** – noteer wanneer je welke asielen hebt gemaild
5. **GDPR** – je mag deze organisaties benaderen voor zakelijke communicatie (link-uitwisseling); vermeld een uitschrijfmogelijkheid als je een nieuwsbrief start
