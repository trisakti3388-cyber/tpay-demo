# tpay-demo

A small balance-monitoring script for checking a user balance from an OpenClaw-controlled browser tab and sending an alert when it crosses a threshold.

## What it does

- Focuses a target browser tab
- Captures a browser snapshot
- Parses the balance for a configured username
- Stores previous state locally
- Sends an alert when the balance crosses above or back below the threshold

## Requirements

- Node.js
- OpenClaw CLI available in PATH
- A connected browser profile/tab that contains the target page
- A messaging target configured for alerts

## Configuration

Set these values in the script before use:

- `USERNAME`
- `THRESHOLD`
- `TARGET_TAB`
- `ALERT_CHANNEL`
- `ALERT_TARGET`

## Run

```bash
node balance-monitor.js
```

## Notes

This repo intentionally excludes local state files and private environment-specific identifiers.
