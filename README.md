# tpay-demo

Production-ready Node.js balance monitor for an OpenClaw-controlled browser workflow.

## Features

- Configurable via `.env`
- Modular `src/` layout
- Local state persistence
- Threshold crossing alerts
- Basic structured logging
- Simple shell runner for cron/manual use

## Project structure

```text
.
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── scripts/
│   └── run-monitor.sh
├── src/
│   ├── balance.js
│   ├── config.js
│   ├── index.js
│   ├── logger.js
│   ├── openclaw.js
│   └── state.js
└── state/
```

## Setup

1. Copy `.env.example` to `.env`
2. Fill in your real values
3. Run the monitor

```bash
cp .env.example .env
npm run monitor
```

## Environment variables

- `USERNAME` - Username to match in browser snapshot output
- `THRESHOLD` - Numeric alert threshold
- `TARGET_TAB` - OpenClaw/Chrome target tab id
- `ALERT_CHANNEL` - Messaging channel, for example `telegram`
- `ALERT_TARGET` - Destination target, for example `@your_bot`
- `STATE_PATH` - Path for saved state file

## Run options

```bash
npm run monitor
# or
./scripts/run-monitor.sh
```

## How alerts work

The script sends a message only when the balance crosses the threshold:

- below -> above threshold = alert
- above -> below/equal threshold = recovery

## Notes

- `state/` is ignored by Git
- `.env` is ignored by Git
- Replace the example config values before production use
