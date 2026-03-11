# Scope3 Take Home Assessment

### Set Up

This project uses Bun, to install it, run:

```bash
curl -fsSL https://bun.com/install | bash # for macOS, Linux, and WSL
```

Install dependencies with:

```bash
bun install
```

Set up your environment variables:

```bash
cp .env.example .env
```

Then edit `.env` and add your Scope3 API key:

```
SCOPE3_API_KEY=your_actual_api_key
```

Run the project with:

```bash
bun run dev
```

This will start a watcher that will automatically rebuild the project when changes are made. Bun should automatically source the environment variables from `.env` on startup.

You can test everything is working by running the following CURL command:

```bash
curl http://localhost:3000/emissions/day?domain=yahoo.com&date=2025-08-04
```

You should see this as the response:

```
{"totalEmissions":0.276799780070073,"domain":"yahoo.com","date":"2025-08-04"}
```

Please read the [Assessment](./ASSESSMENT.md) file for further instructions.
