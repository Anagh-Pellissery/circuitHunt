## 0. Final decisions (confirmed with you — this replaces the old assumptions list)
1. **Registration is always open.** There's no "lobby" phase blocking signups. Any team can sign in with Google and register at any time (as long as the event isn't marked "ended" by admin). The moment they submit their team form, they're playing.
2. **Circuit assignment**: happens instantly on registration submit, picked to keep all 8 circuits as evenly assigned as possible (a running counter per circuit, new team gets whichever circuit currently has the fewest teams, random tie-break). It's fine for circuits to repeat across teams — equal distribution, not uniqueness. Shown to the team immediately in a "Your Mission" screen right after signup.
3. **Finishing**: unchanged — the instant a team simultaneously owns every component in their assigned circuit, they're locked out of further trades and see a "Circuit Complete 🎉" screen with their finish time.
4. **Admin auth**: a single shared passcode gates `/admin` — no per-organizer accounts needed.
5. **Selling**: a component can be sold at **any outpost that currently stocks that component** — not necessarily the outpost it was originally bought at. Sell price is always what the team originally paid for it (unaffected by that outpost's current price). If the outpost you're standing in doesn't stock that item at all, you can't sell it there.
6. **Single active session — for teams**: unchanged. Logging in on a new device/browser rewrites the team's `activeSessionId`; any older tab watching that field sees the mismatch and is force-logged-out ("session opened elsewhere").
7. **QR codes never expose a usable URL.** The QR encodes only the outpost's raw slug (plain text, not a link). The in-app scanner reads that slug, resolves it to an outpost in memory, and routes to a single generic `/market` page — the browser address bar never shows which outpost you're in, and there's nothing a student could screenshot, copy, or type in manually to reach a marketplace without scanning.
8. **The global price clock**: there's exactly one admin button, **"Start Global Clock."** It does one thing only — stamps `gameConfig.gameStartTimestamp` and flips `gameConfig.status` to `"running"`, which is what all the price-window math is based on. It has **no effect** on registration (already always open) or on any team's balance (already assigned at their own signup time). Before the clock is started, marketplaces are visible but transactions are blocked with a "the event hasn't started yet" message.
9. **Admin gets its own single-session lock too** — same mechanism as teams (a rewritten `activeSessionId` under `/adminSession`), so only one admin browser tab is "live" at a time; logging in elsewhere with the passcode kicks the previous one.
10. **Starting balance**: admin can edit it at any time from the dashboard. Whatever value it holds **at the moment a team registers** is what that team is credited — it is not retroactively applied to teams that already registered.

---
## 1. Final data (unchanged — from your price sheet and circuit table)
**9 components:** `temp_sensor`, `buzzer`, `potentiometer`, `capacitor`, `push_button`, `led`, `ultrasonic_sensor`, `photoresistor`, `resistor`

**4 outposts**, each component's 4-window price cycle:
| Outpost | Components carried (price by window 0/1/2/3) |
| --- | --- |
| **1** | temp_sensor 20-25-30-35 · buzzer 15-20-25-30 · potentiometer 10-15-20-25 · capacitor 5-10-15-20 · push_button 5-10-15-20 · led 5-10-15-20 |
| **2** | ultrasonic_sensor 40-45-50-35 · buzzer 20-25-30-15 · potentiometer 15-20-25-10 · photoresistor 15-20-25-10 · push_button 10-15-20-5 · led 10-15-20-5 · resistor 10-15-20-5 |
| **3** | ultrasonic_sensor 45-50-35-40 · temp_sensor 30-35-20-25 · potentiometer 20-25-10-15 · photoresistor 20-25-10-15 · capacitor 15-20-5-10 · led 15-20-5-10 · resistor 15-20-5-10 |
| **4** | ultrasonic_sensor 50-35-40-45 · temp_sensor 35-20-25-30 · buzzer 30-15-20-25 · photoresistor 25-10-15-20 · capacitor 20-5-10-15 · push_button 20-5-10-15 · resistor 20-5-10-15 |

**8 circuits (equal-count random assignment at signup):**
| Circuit | Required components |
| --- | --- |
| C1 | photoresistor, led, resistor |
| C2 | push_button, potentiometer, led, resistor |
| C3 | temp_sensor, buzzer, resistor |
| C4 | push_button, capacitor, buzzer |
| C5 | ultrasonic_sensor, led, resistor |
| C6 | ultrasonic_sensor, temp_sensor, buzzer |
| C7 | push_button, buzzer, photoresistor |
| C8 | led, resistor, buzzer |

Ready-to-paste seed JSON:
```json
{
  "components": {
    "temp_sensor": { "name": "Temperature Sensor" },
    "buzzer": { "name": "Buzzer" },
    "potentiometer": { "name": "Potentiometer" },
    "capacitor": { "name": "Capacitor" },
    "push_button": { "name": "Push Button" },
    "led": { "name": "LED" },
    "ultrasonic_sensor": { "name": "Ultrasonic Sensor" },
    "photoresistor": { "name": "Photoresistor" },
    "resistor": { "name": "Resistor" }
  },
  "outposts": {
    "outpost1": {
      "name": "Outpost 1",
      "slug": "REPLACE_WITH_UUID_1",
      "prices": {
        "temp_sensor": [20, 25, 30, 35],
        "buzzer": [15, 20, 25, 30],
        "potentiometer": [10, 15, 20, 25],
        "capacitor": [5, 10, 15, 20],
        "push_button": [5, 10, 15, 20],
        "led": [5, 10, 15, 20]
      }
    },
    "outpost2": {
      "name": "Outpost 2",
      "slug": "REPLACE_WITH_UUID_2",
      "prices": {
        "ultrasonic_sensor": [40, 45, 50, 35],
        "buzzer": [20, 25, 30, 15],
        "potentiometer": [15, 20, 25, 10],
        "photoresistor": [15, 20, 25, 10],
        "push_button": [10, 15, 20, 5],
        "led": [10, 15, 20, 5],
        "resistor": [10, 15, 20, 5]
      }
    },
    "outpost3": {
      "name": "Outpost 3",
      "slug": "REPLACE_WITH_UUID_3",
      "prices": {
        "ultrasonic_sensor": [45, 50, 35, 40],
        "temp_sensor": [30, 35, 20, 25],
        "potentiometer": [20, 25, 10, 15],
        "photoresistor": [20, 25, 10, 15],
        "capacitor": [15, 20, 5, 10],
        "led": [15, 20, 5, 10],
        "resistor": [15, 20, 5, 10]
      }
    },
    "outpost4": {
      "name": "Outpost 4",
      "slug": "REPLACE_WITH_UUID_4",
      "prices": {
        "ultrasonic_sensor": [50, 35, 40, 45],
        "temp_sensor": [35, 20, 25, 30],
        "buzzer": [30, 15, 20, 25],
        "photoresistor": [25, 10, 15, 20],
        "capacitor": [20, 5, 10, 15],
        "push_button": [20, 5, 10, 15],
        "resistor": [20, 5, 10, 15]
      }
    }
  },
  "circuits": {
    "c1": { "name": "Circuit 1", "required": ["photoresistor", "led", "resistor"] },
    "c2": { "name": "Circuit 2", "required": ["push_button", "potentiometer", "led", "resistor"] },
    "c3": { "name": "Circuit 3", "required": ["temp_sensor", "buzzer", "resistor"] },
    "c4": { "name": "Circuit 4", "required": ["push_button", "capacitor", "buzzer"] },
    "c5": { "name": "Circuit 5", "required": ["ultrasonic_sensor", "led", "resistor"] },
    "c6": { "name": "Circuit 6", "required": ["ultrasonic_sensor", "temp_sensor", "buzzer"] },
    "c7": { "name": "Circuit 7", "required": ["push_button", "buzzer", "photoresistor"] },
    "c8": { "name": "Circuit 8", "required": ["led", "resistor", "buzzer"] }
  },
  "meta": {
    "circuitAssignmentCounts": {
      "c1": 0, "c2": 0, "c3": 0, "c4": 0, "c5": 0, "c6": 0, "c7": 0, "c8": 0
    }
  },
  "gameConfig": {
    "status": "not_started",
    "startingBalance": 200,
    "gameStartTimestamp": null
  }
}
```
## 2. Firebase RTDB schema (v2)
```
/components/{componentId}                → { name }
/outposts/{outpostId}                    → { name, slug, prices: { componentId: [p0,p1,p2,p3] } }
/circuits/{circuitId}                    → { name, required: [componentId,...] }
/meta/circuitAssignmentCounts/{id}       → number  (used only to balance random assignment)

/gameConfig
    status                                → "not_started" | "running" | "ended"
    startingBalance                       → number, editable any time; applied to a team at its own registration moment
    gameStartTimestamp                    → server timestamp | null, set exactly once by "Start Global Clock"

/adminSession
    activeSessionId                       → random string, rewritten on every admin passcode login

/teams/{leaderUid}                        ← teamId IS the leader's Google UID (enforces 1 team/account)
    teamName
    leaderName
    leaderEmail
    members                               → [name1, name2, name3]
    circuitId                             → assigned at registration
    balance                               → set to gameConfig.startingBalance at registration time
    status                                → "playing" | "finished"
    finishedAt                            → timestamp | null
    activeSessionId                       → random string, rewritten on every login
    createdAt
    inventory/{componentId}               → { owned: bool, boughtPrice: number, outpostId: string }
    transactions/{txId}                   → { type: "buy"|"sell"|"swap", outpostId, componentId,
                                              amount, oldPrice?, newPrice?, balanceAfter, timestamp }
```
Notes:
- `inventory` only needs entries for components ever owned; missing = not owned.
- Registration is blocked only when `gameConfig.status == "ended"`.
- The outpost `slug` is now a **plain value encoded directly in the QR** (not part of a URL) — see Module 4/5.