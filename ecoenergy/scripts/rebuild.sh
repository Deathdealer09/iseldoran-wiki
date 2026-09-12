#!/bin/sh
# Full deterministic rebuild. Each step regenerates from scratch, so the chain is
# idempotent and safe to re-run.
set -e
D=$(dirname "$0")
python3 "$D/seed_data.py"
python3 "$D/seed_pricing.py"
python3 "$D/merge_upload.py"
python3 "$D/build_workbook.py"
python3 "$D/generate_reports.py"
