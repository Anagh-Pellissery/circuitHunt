# AGENT.md — Circuit Hunt: Single Source of Truth

**Read this file in full before doing anything if you are picking this project back up, stuck, unsure what to build next, or unsure how something should behave. This file alone should be enough to continue the project without any other context.**

---

## 1. What this project is

"Circuit Hunt" is a live campus event game for IIIT Kottayam students. Teams of 4 sign in with Google, get randomly assigned an electronics "circuit" (a small set of 3–4 components they need to collect), and then physically walk around campus to 4 "outposts" (shops). At each outpost they scan a QR code with their phone to open that outpost's marketplace, where they can buy components, sell components back, or swap a component they already own for a better price at that outpost. Prices at every outpost cycle through 4 fixed values every 10 minutes, looping forever. A team wins (finishes) the instant they simultaneously own every component required by their assigned circuit.

It is a React (Vite) + Firebase (Google Auth + Realtime Database) web app, run entirely client-side with no custom backend server — this is an accepted tradeoff because it's a low-stakes campus event, not a security-critical product.

---

## 2. The full game flow, end to end

**Player side:**
1. Player opens the site, signs in with Google. Only `@iiitkottayam.ac.in` emails are accepted (checked client-side after sign-in; wrong domain = signed out immediately with a message).
2. If this Google account has no team yet, and the event isn't `ended`, they land on a **Register** form: team name, their own name (prefilled from Google profile, editable), and 3 teammate names.
3. On submit: the team is instantly created, credited with whatever `startingBalance` is currently set in admin config, and assigned one of the 8 circuits — picked to keep circuit counts as even as possible across all teams (not purely random, and repeats across teams are fine).
4. They immediately see a **Mission** screen: "Your Mission: Circuit X" with its required components listed. Tap through to **Home**.
5. **Home** shows: team name, balance, their circuit's progress (e.g. "2/3 collected", ticks for owned required components), and a read-only list of everything they currently own with what they paid for it. There's a **"Scan QR"** button that opens the camera.
6. If the admin hasn't started the global clock yet, Home shows a banner ("marketplace opens once the event starts") and the scan button is disabled — but registration, viewing balance/circuit, etc. all still work fine at this stage.
7. Physically walking to an outpost and scanning its QR code (the *only* way in — there is no clickable/typed URL to a marketplace) takes them to **Market**.
8. **Market** has two tabs:
   - **Sell**: every component the team owns that *this particular outpost* currently stocks (owned components that outpost doesn't stock are not sellable here — go find an outpost that does). Selling always refunds exactly what they originally paid, removes the item.
   - **Buy / Swap**: every component this outpost carries at its current (window-based) price. Not owned → **Buy** button. Already owned → **Swap** button instead, with a green/red badge showing how much they'd gain/lose by selling at their old price and re-buying at the current price in one action.
9. After every buy or swap, the app checks: does the team now own every component in their assigned circuit? If yes → team is instantly locked (`status: "finished"`) and redirected to a **Finished** celebration screen. No more trading for them.

**Admin side:**
1. Admin goes to `/admin`, enters a shared passcode (no Google auth needed for admin).
2. **Admin Dashboard** shows: whether the global clock has started, a live table of every team (balance, circuit, progress, status, finish time) sorted with finished teams first, expandable transaction logs per team, an editable "starting balance" field (only affects teams that register *after* the edit), a single **"Start Global Clock"** button (enabled only before it's been started — this is the *only* thing that button does: it stamps the price-window start time, nothing else), and an **"End Game"** button (blocks further registration and all trading).
3. Admin can also open a **QR codes** page that renders the 4 printable QR cards (one per physical outpost) to put up at each location.

---

## 3. Ground-truth decisions (do not deviate from these without asking the human)

- Registration is **always open** — never gated by the game clock. There is no "lobby" phase.
- Circuit assignment happens **at registration**, balanced via a running per-circuit counter, not pure randomness. Repeats across teams are fine.
- Starting balance is credited **at the moment a team registers**, using whatever the admin's `startingBalance` config value is *right then*. It is never retroactively changed for already-registered teams.
- The "Start Global Clock" admin action affects **only** `gameConfig.gameStartTimestamp` / `gameConfig.status` — it must never touch registration behavior or any team's balance.
- Selling requires being physically in a marketplace (scanned QR), and the outpost you're in must currently stock that component — but it does **not** have to be the same outpost you originally bought it from. Sell price is always the team's own original purchase price for that item, never the current market price.
- Swap = sell (at original price) + immediately re-buy (at current price) of the **same component**, bundled as one UI action. It is never a trade between two different components.
- A team finishes the instant they simultaneously hold every required component of their assigned circuit — checked after every buy/swap. Once finished, they are locked out of all further trading.
- QR codes encode **only a raw slug value**, never a URL. The app's own camera scanner reads it, resolves it against `/outposts` in memory, and routes to a single generic `/market` page with nothing outpost-identifying ever appearing in the browser's address bar. Navigating to `/market` directly (without having scanned) must redirect back to Home.
- Both teams and the admin get a **single-active-session lock**: logging in fresh anywhere rewrites a `activeSessionId` field; any other open tab watching that field gets force-logged-out the moment it changes.
- Security rules are intentionally loose in places (documented in section 8) — this is accepted for a low-stakes campus event, not a bug.

---

## 4. Component / outpost / circuit data (ground truth — do not alter without the human's say-so)

**9 components:** `temp_sensor`, `buzzer`, `potentiometer`, `capacitor`, `push_button`, `led`, `ultrasonic_sensor`, `photoresistor`, `resistor`

**Outpost price tables** — 4 fixed prices per component per outpost, cycling every 10 minutes, looping after window 3 back to window 0:

| Outpost | Component: [window0, window1, window2, window3] |
|---|---|
| 1 | temp_sensor: [20,25,30,35] · buzzer: [15,20,25,30] · potentiometer: [10,15,20,25] · capacitor: [5,10,15,20] · push_button: [5,10,15,20] · led: [5,10,15,20] |
| 2 | ultrasonic_sensor: [40,45,50,35] · buzzer: [20,25,30,15] · potentiometer: [15,20,25,10] · photoresistor: [15,20,25,10] · push_button: [10,15,20,5] · led: [10,15,20,5] · resistor: [10,15,20,5] |
| 3 | ultrasonic_sensor: [45,50,35,40] · temp_sensor: [30,35,20,25] · potentiometer: [20,25,10,15] · photoresistor: [20,25,10,15] · capacitor: [15,20,5,10] · led: [15,20,5,10] · resistor: [15,20,5,10] |
| 4 | ultrasonic_sensor: [50,35,40,45] · temp_sensor: [35,20,25,30] · buzzer: [30,15,20,25] · photoresistor: [25,10,15,20] · capacitor: [20,5,10,15] · push_button: [20,5,10,15] · resistor: [20,5,10,15] |

Note: Outpost 1 only carries 6 of the 9 components (no ultrasonic_sensor, photoresistor, or resistor there) — this is intentional, not a data-entry gap.

**8 circuits:**

| Circuit | Required components |
|---|---|
| c1 | photoresistor, led, resistor |
| c2 | push_button, potentiometer, led, resistor |
| c3 | temp_sensor, buzzer, resistor |
| c4 | push_button, capacitor, buzzer |
| c5 | ultrasonic_sensor, led, resistor |
| c6 | ultrasonic_sensor, temp_sensor, buzzer |
| c7 | push_button, buzzer, photoresistor |
| c8 | led, resistor, buzzer |

Full seed JSON (paste-ready, used by `scripts/seed.js`):

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

---

## 5. Firebase Realtime Database schema (ground truth)

```
/components/{componentId}                → { name }
/outposts/{outpostId}                    → { name, slug, prices: { componentId: [p0,p1,p2,p3] } }
/circuits/{circuitId}                    → { name, required: [componentId,...] }
/meta/circuitAssignmentCounts/{id}       → number  (balances random circuit assignment)

/gameConfig
    status                                → "not_started" | "running" | "ended"
    startingBalance                       → number, editable any time; applied at each team's own registration moment
    gameStartTimestamp                    → server timestamp | null, set exactly once by "Start Global Clock"

/adminSession
    activeSessionId                       → random string, rewritten on every admin passcode login

/teams/{leaderUid}                        ← teamId IS the leader's Google UID (enforces 1 team per account)
    teamName
    leaderName
    leaderEmail
    members                               → [name1, name2, name3]
    circuitId
    balance
    status                                → "playing" | "finished"
    finishedAt                            → timestamp | null
    activeSessionId                       → random string, rewritten on every login
    createdAt
    inventory/{componentId}               → { owned: bool, boughtPrice: number, outpostId: string }
    transactions/{txId}                   → { type: "buy"|"sell"|"swap", outpostId, componentId,
                                              amount, oldPrice?, newPrice?, balanceAfter, timestamp }
```

`inventory` only ever needs entries for components a team has owned at least once — a missing entry means "never owned / currently not owned."

---

## 6. Core algorithms (pseudocode — implement exactly this)

**Active price window** (`src/lib/priceEngine.js`):
```
getActiveWindowIndex(gameStartTimestamp, now):
  if gameStartTimestamp is null or now < gameStartTimestamp: return null
  return floor((now - gameStartTimestamp) / (10 * 60 * 1000)) % 4

getPrice(outpost, componentId, windowIndex):
  return outpost.prices[componentId]?.[windowIndex]   // undefined if outpost doesn't stock it
```

**Balanced circuit assignment** (inside the registration transaction):
```
counts = read /meta/circuitAssignmentCounts
minCount = min(counts.values())
candidates = [id for id, count in counts if count == minCount]
chosen = random pick from candidates
increment /meta/circuitAssignmentCounts/{chosen}
```

**Swap delta** (`src/lib/gameLogic.js`, pure + unit tested):
```
getSwapDelta(boughtPrice, currentPrice):
  diff = boughtPrice - currentPrice
  if diff > 0: return { type: "gain", amount: diff }   // green
  if diff < 0: return { type: "loss", amount: -diff }  // red
  return { type: "neutral", amount: 0 }                // grey
```

**Circuit completion check** (`src/lib/gameLogic.js`, pure + unit tested):
```
isCircuitComplete(requiredComponentIds, inventory):
  return requiredComponentIds.every(id => inventory[id]?.owned === true)
```
Called after every successful buy/swap write. If true, in the same transaction set
`status: "finished"`, `finishedAt: serverTimestamp`.

**Single-session lock** (`src/hooks/useSingleSession.js`, reused for both teams and admin):
```
on activate(dbPath):
  sessionId = random string
  write dbPath + "/activeSessionId" = sessionId
  keep sessionId in a ref/sessionStorage (NOT localStorage, NOT persisted game data)
  subscribe to dbPath + "/activeSessionId":
    if remote value != sessionId: call onKicked() (force sign-out + message)
```

---

## 7. Page / route map

| Route | Purpose | Guard |
|---|---|---|
| `/login` | Google sign-in, domain check | none |
| `/register` | Team creation form | only if signed in AND no existing team AND event not ended |
| `/mission` | One-time "your circuit" reveal | only right after registration; else redirect to `/home` |
| `/home` | Balance, circuit progress, owned items, scan button | signed in + has a team; redirect to `/finished` if team is finished |
| `/market` | Buy/Sell/Swap, no slug in URL | only reachable via in-app QR scan (MarketContext must hold an outpost); else redirect to `/home` |
| `/finished` | Win screen | team.status == "finished" |
| `/admin` | Passcode login | none |
| `/admin/dashboard` | Live team table, start clock, end game | passcode session flag set |
| `/admin/qrcodes` | Printable QR cards | passcode session flag set |

---

## 8. Known, accepted tradeoffs (do not "fix" these without asking — they're intentional for a low-stakes event)

- Database rules allow any authenticated user to read all of `/teams` (needed for the admin table, since there's no real backend) — a curious player could technically read other teams' data via devtools, but cannot write to them.
- `/gameConfig`, `/adminSession`, and `/meta/circuitAssignmentCounts` are writable by any authenticated client — protected only by the admin passcode UI, not database rules.
- Admin auth is a single shared passcode, not per-organizer Google accounts.
- QR obscurity relies on the slug being un-guessable and never displayed anywhere in the app or on the printed card — not on cryptographic signing.

---

## 9. Tech stack & environment

- React (Vite, JavaScript) + `react-router-dom`
- Firebase Auth (Google provider) + Firebase Realtime Database
- `qrcode.react` (generating outpost QR codes) + `html5-qrcode` (in-app camera scanner)
- `firebase-admin` (Node, seed script only — never shipped to the browser)
- Vitest for unit tests on `priceEngine.js` and `gameLogic.js`

`.env.local` keys required:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ALLOWED_EMAIL_DOMAIN=iiitkottayam.ac.in
VITE_ADMIN_PASSCODE=
```
Plus a local (git-ignored) `outpost-slugs.json` with 4 real UUIDs for `scripts/seed.js`, and a Firebase service-account key for `firebase-admin` (also git-ignored).

---

## 10. Build order / module checklist

Work through these in order — each depends on the previous one existing. Check one off only once it actually runs, not just once code is written.

- [ ] **Module 0** — Vite scaffold, folder structure, this file placed at repo root, `.env.local.example`
- [ ] **Module 1** — `firebase.js`, `priceEngine.js` (+ tests), `scripts/seed.js`
- [ ] **Module 2** — `useSingleSession` hook, Google login + domain check, always-open registration with balanced circuit assignment
- [ ] **Module 3** — `TeamContext`, Mission screen, Home screen
- [ ] **Module 4** — `MarketContext`, Market page (sell/buy/swap), `gameLogic.js` (+ tests), circuit-completion check
- [ ] **Module 5** — Printable QR codes page (raw slug only, no visible URL/text)
- [ ] **Module 6** — Admin login (with its own single-session lock), Admin dashboard (Start Global Clock, starting balance, live leaderboard, End Game)
- [ ] **Module 7** — `database.rules.json`, deployed
- [ ] **Module 8** — `TESTING.md` manual QA script, run through it once end to end

If you (the agent) get interrupted mid-module: check this list, re-read whichever module's checklist item is unchecked, and resume there — don't restart earlier modules that are already checked off unless something here contradicts what's already built, in which case this file wins and existing code should be corrected to match it.

---

## 11. If something seems ambiguous or contradictory while building

1. Re-read sections 2 and 3 above first — most "what should happen here" questions are answered there.
2. If genuinely unresolved, don't guess silently — leave a `// TODO(ask-human):` comment describing the exact ambiguity and make the most conservative choice (the one that's easiest to change later) so the human can review and correct it.
3. Never weaken the domain-restricted login, the single-team-per-Google-account rule, or the QR-only-entry-to-market rule to "make something easier to test" — these are core to the game's integrity even though the event is low-stakes.
