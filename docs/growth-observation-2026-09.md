# LCL and pallet observation: September 8–21, 2026

Keep the calculator interface, formula rules and search-title experiments stable
while observing the existing LCL chargeable-volume and pallet-loading tools.
Include their English, Dutch, German, French, Japanese and Chinese tool URLs.

## Evidence to collect

Use the authenticated `/api/analytics` report. `eventDaily`, `eventPageDaily`,
`pageDaily` and `sourceDaily` aggregate existing public records only. They do not
add tracking identifiers, collect calculator inputs, change the database schema,
or expose visitor hashes. Internal and historical-unclassified rows remain
excluded from these public breakdowns. Existing response fields remain compatible.

Persist daily public visits, opens, inputs, completed calculations, copy/share
events and known search-referring visits. Treat source attribution as evidence
of a referrer, not proof of a different human or a Search Console click.
The API reports a rolling 30-day UTC window. Never subtract totals across different
windows to infer growth. Daily anonymous hashes cannot measure cross-day retention.

## Reviews

- Week 1: September 8–14 UTC. Midpoint check on September 15 JST.
- Week 2: September 15–21 UTC. Final check on September 22 JST.
- At Japan midnight the preceding UTC day is incomplete. Mark that week pending
  and finish the review on the next midnight run after all seven UTC days close.

Internal evaluation targets for the two tools combined: at least 10 completed
calculations across at least 3 days in each week; at least 3 copy/share events and
10 explicitly search-referring page views over 14 days. Report each tool separately
so one spike does not mask a tool with no use. These are decision aids, not industry
benchmarks or evidence of willingness to pay.

If the signals persist, choose one small export or batch-calculation prototype
for feedback. If visits arrive without input, investigate one input-flow problem.
If visits themselves remain scarce, examine search queries and referring pages
before adding features. Do not infer retention, revenue or paying users from events.

The existing midnight monitor remains read-only against both live sites. It may
save local aggregate reports and charts. It must not automatically change pages,
search settings, DNS, advertisements or billing, or contact external users.

Local controller: `../monitoring/traffic_monitor.py`, with `focus-plan.json`,
`focus_observation.py` and regression tests in that monitoring directory.
