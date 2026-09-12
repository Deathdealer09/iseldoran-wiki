#!/usr/bin/env python3
"""
Cycle 3, 2026-09-12. Social publication via the Metricool kerron.pierre5 brand.

Records the scheduled post and what the Metricool surfaces actually returned.
The post is SCHEDULED and confirmed by the tool, not yet published, and is
recorded that way.
"""

import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data")
load = lambda n: json.load(open(os.path.join(DATA, n)))
save = lambda n, o: json.dump(o, open(os.path.join(DATA, n), "w"), indent=2)

comms = load("communications.json")
comms.append(dict(
    datetime="2026-09-12 (scheduled for 2026-09-14 11:00 AST)",
    prospect_id="BROADCAST",
    prospect="Public audience, kerron.pierre5 brand (Facebook, LinkedIn, Threads)",
    channel="Social, via Metricool",
    direction="Outbound",
    recipient="kerron.pierre5 brand followers",
    message_type="Wholesale aggregate supply offer, scheduled post",
    material="Pitrun; 3/8 gravel; 3/4 gravel; sharp sand; plastering sand; backfill; sandfill",
    volume="",
    price_quoted="No figure published. Positioning only: about 10% under market.",
    discount="Yes. Up to 30%, stated as subject to quantity and terms.",
    response="NOT YET PUBLISHED. Scheduled, awaiting the publication time.",
    followup="2026-09-15",
    next_action="After publication at 2026-09-14 11:00 AST, check delivery on all three networks and "
                "route any inbound enquiry into the pipeline as a new prospect.",
    logged_by="Metricool MCP. Post id 374817136, uuid 5571315352575427490. Tool confirmed status "
              "PENDING on facebook, linkedin and threads with autoPublish true. SCHEDULED, NOT SENT.",
))
save("communications.json", comms)

# What the Metricool surfaces actually returned this cycle.
intel = load("market_intel.json")
intel.append(dict(
    headline="Metricool competitor tracking returned no data",
    detail="The competitors connector was queried for the kerron.pierre5 brand over 2026-08-13 to "
           "2026-09-12 for Facebook competitor screen name, display name, followers and posts. It "
           "returned an empty result set, because no competitors are configured on the brand.",
    implication="Metricool's only third-party data surface is competitor tracking, and it is empty. "
                "Adding rival aggregate sellers as competitors would turn it into a genuine "
                "monitoring channel. It still cannot search for prospects or prices.",
    source="Metricool MCP getAnalyticsDataByMetrics, brand 6856731",
    verified="2026-09-12"))
intel.append(dict(
    headline="Best-time-to-post data reflects the wrong audience",
    detail="Metricool returned Facebook best-time data for the kerron.pierre5 brand. The strongest "
           "hours sit around 10:00 to 12:00 Europe/Madrid, which is 04:00 to 06:00 in Trinidad. The "
           "brand's timezone is set to Europe/Madrid and its audience is the existing personal and "
           "Iseldoran Sagas following, not Trinidad construction buyers.",
    implication="The engagement peaks are not a guide for a Trinidad B2B audience. The post was "
                "instead scheduled at 17:00 Madrid, which is 11:00 Trinidad, the strongest hour in "
                "the data that still falls inside Trinidad business hours. Set the brand timezone to "
                "America/Port_of_Spain if EcoEnergy will keep using it.",
    source="Metricool MCP getBestTimeToPostByNetwork, brand 6856731",
    verified="2026-09-12"))
save("market_intel.json", intel)
print("communications logged:", len(comms))
print("market intel items   :", len(intel))
