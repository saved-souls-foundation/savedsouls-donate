# Deployment – Live zetten

## Build voor productie

```bash
npm run build
```

De build maakt een geoptimaliseerde versie in de map `.next/`.

## Lokaal testen (productie-build)

```bash
npm run build
npm run start
```

Open http://localhost:3000

## Live deployen

### Optie 1: Plesk / eigen server

1. **Build lokaal of op de server:**
   ```bash
   npm run build
   ```

2. **Bestanden uploaden:**
   - `.next/` (gehele map)
   - `public/` (gehele map, inclusief `logos/`)
   - `package.json`, `package-lock.json`
   - `next.config.ts`, `i18n/`, `messages/`, etc.

3. **Op de server:**
   ```bash
   npm install --production
   npm run start
   ```

4. **Process manager (aanbevolen):** gebruik PM2 of systemd zodat de app blijft draaien:
   ```bash
   pm2 start npm --name "savedsouls" -- start
   pm2 save
   pm2 startup
   ```

### Optie 2: Vercel

1. Koppel de Git-repository aan Vercel
2. Vercel bouwt en deployt automatisch bij elke push
3. Zet environment variables (zoals Mollie API keys) in het Vercel-dashboard

### Optie 3: Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Controle na deployment

- [ ] https://jouw-domein.nl/nl/shelters laadt correct
- [ ] Logo’s worden getoond
- [ ] Donaties (Mollie) werken
- [ ] Contactformulier werkt
