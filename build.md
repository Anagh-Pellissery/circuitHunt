<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}</style><style>:root{color-scheme:light dark;--md-bg:#fff;--md-text:rgba(0,0,0,.8);--md-muted:rgba(0,0,0,.6);--md-fill:rgba(0,0,0,.04);--md-fill-strong:rgba(0,0,0,.06);--md-rule:rgba(0,0,0,.1);--md-rule-strong:rgba(0,0,0,.16);--md-link:hsl(210 100% 45%)}@media (prefers-color-scheme:dark){:root:where(:not([data-theme="light"])){--md-bg:#0d0d0d;--md-text:rgba(255,255,255,.85);--md-muted:rgba(255,255,255,.6);--md-fill:rgba(255,255,255,.06);--md-fill-strong:rgba(255,255,255,.09);--md-rule:rgba(255,255,255,.14);--md-rule-strong:rgba(255,255,255,.22);--md-link:hsl(210 100% 72%)}}:root[data-theme="dark"]{color-scheme:dark;--md-bg:#0d0d0d;--md-text:rgba(255,255,255,.85);--md-muted:rgba(255,255,255,.6);--md-fill:rgba(255,255,255,.06);--md-fill-strong:rgba(255,255,255,.09);--md-rule:rgba(255,255,255,.14);--md-rule-strong:rgba(255,255,255,.22);--md-link:hsl(210 100% 72%)}:root[data-theme="light"]{color-scheme:light}@media print{:root,:root[data-theme="dark"]{color-scheme:light;--md-bg:#fff;--md-text:rgba(0,0,0,.8);--md-muted:rgba(0,0,0,.6);--md-fill:rgba(0,0,0,.04);--md-fill-strong:rgba(0,0,0,.06);--md-rule:rgba(0,0,0,.1);--md-rule-strong:rgba(0,0,0,.16);--md-link:hsl(210 100% 45%)}}body{background:var(--md-bg);color:var(--md-text);max-width:720px;margin:0 auto;padding:32px;display:flex;flex-direction:column;gap:10px;font:14px/1.55 -apple-system,BlinkMacSystemFont,'SF Pro','Segoe UI',sans-serif;overflow-wrap:break-word}body>:first-child{margin-top:0}h1,h2,h3,h4,h5,h6{margin:6px 0 0;line-height:1.25;font-weight:600;text-wrap:balance}h1{font-size:1.35em}h2{font-size:1.15em;color:var(--md-muted)}h3,h4,h5,h6{font-size:1em}p,ul,ol,blockquote,table,pre,hr{margin:0}strong{font-weight:600}a{color:var(--md-link);text-decoration:none}a:hover{text-decoration:underline}ul,ol{display:flex;flex-direction:column;gap:6px;padding-left:22px}ul{list-style:disc}ol{list-style:decimal}:is(li,td,th)>*+:is(p,ul,ol,blockquote){margin-top:6px}blockquote{display:flex;flex-direction:column;gap:10px;border-left:2px solid var(--md-rule);padding-left:10px;color:var(--md-muted)}:not(pre)>code{background:var(--md-fill);padding:1px 3px;border-radius:4px;font:.92em 'SF Mono',ui-monospace,Menlo,Consolas,monospace}a>code{background:none;color:inherit}pre{background:var(--md-fill);padding:10px 12px;border-radius:6px;overflow-x:auto;font:12px/1.5 'SF Mono',ui-monospace,Menlo,Consolas,monospace;margin-block:4px}pre code{background:none;padding:0;font:inherit}table{width:100%;border-collapse:separate;border-spacing:2px;font:inherit}th,td{padding:6px 8px;border-radius:3px;text-align:left;vertical-align:top}th{background:var(--md-fill-strong);font-weight:600}td{background:var(--md-fill)}:is(th,td) :not(pre)>code{background:transparent}hr{border:0;border-top:1px solid var(--md-rule-strong);margin-block:10px}img{max-width:100%;height:auto;border-radius:4px}</style>
</head><body>
<h1>&quot;Circuit Hunt&quot; — Build Plan &amp; Modular Agent Prompts (v2)</h1>
<p>v2 changes from your latest round of feedback: registration is now always open (no lobby gate), circuits are assigned instantly at signup with balanced distribution, the admin &quot;Start&quot; button now only starts the global price clock (nothing else), sell works at any outpost that stocks the item (not just the one it was bought at), the QR code never exposes a usable URL, and admin gets its own single-session lock. Full detail below.</p>
<hr>
<h2>0. Final decisions (confirmed with you — this replaces the old assumptions list)</h2>
<ol>
<li><strong>Registration is always open.</strong> There's no &quot;lobby&quot; phase blocking signups. Any team can sign in with Google and register at any time (as long as the event isn't marked &quot;ended&quot; by admin). The moment they submit their team form, they're playing.</li>
<li><strong>Circuit assignment</strong>: happens instantly on registration submit, picked to keep all 8 circuits as evenly assigned as possible (a running counter per circuit, new team gets whichever circuit currently has the fewest teams, random tie-break). It's fine for circuits to repeat across teams — equal distribution, not uniqueness. Shown to the team immediately in a &quot;Your Mission&quot; screen right after signup.</li>
<li><strong>Finishing</strong>: unchanged — the instant a team simultaneously owns every component in their assigned circuit, they're locked out of further trades and see a &quot;Circuit Complete 🎉&quot; screen with their finish time.</li>
<li><strong>Admin auth</strong>: a single shared passcode gates <code>/admin</code> — no per-organizer accounts needed.</li>
<li><strong>Selling</strong>: a component can be sold at <strong>any outpost that currently stocks that component</strong> — not necessarily the outpost it was originally bought at. Sell price is always what the team originally paid for it (unaffected by that outpost's current price). If the outpost you're standing in doesn't stock that item at all, you can't sell it there.</li>
<li><strong>Single active session — for teams</strong>: unchanged. Logging in on a new device/browser rewrites the team's <code>activeSessionId</code>; any older tab watching that field sees the mismatch and is force-logged-out (&quot;session opened elsewhere&quot;).</li>
<li><strong>QR codes never expose a usable URL.</strong> The QR encodes only the outpost's raw slug (plain text, not a link). The in-app scanner reads that slug, resolves it to an outpost in memory, and routes to a single generic <code>/market</code> page — the browser address bar never shows which outpost you're in, and there's nothing a student could screenshot, copy, or type in manually to reach a marketplace without scanning.</li>
<li><strong>The global price clock</strong>: there's exactly one admin button, <strong>&quot;Start Global Clock.&quot;</strong> It does one thing only — stamps <code>gameConfig.gameStartTimestamp</code> and flips <code>gameConfig.status</code> to <code>&quot;running&quot;</code>, which is what all the price-window math is based on. It has <strong>no effect</strong> on registration (already always open) or on any team's balance (already assigned at their own signup time). Before the clock is started, marketplaces are visible but transactions are blocked with a &quot;the event hasn't started yet&quot; message.</li>
<li><strong>Admin gets its own single-session lock too</strong> — same mechanism as teams (a rewritten <code>activeSessionId</code> under <code>/adminSession</code>), so only one admin browser tab is &quot;live&quot; at a time; logging in elsewhere with the passcode kicks the previous one.</li>
<li><strong>Starting balance</strong>: admin can edit it at any time from the dashboard. Whatever value it holds <strong>at the moment a team registers</strong> is what that team is credited — it is not retroactively applied to teams that already registered.</li>
</ol>
<hr>
<h2>1. Final data (unchanged — from your price sheet and circuit table)</h2>
<p><strong>9 components:</strong> <code>temp_sensor</code>, <code>buzzer</code>, <code>potentiometer</code>, <code>capacitor</code>, <code>push_button</code>, <code>led</code>, <code>ultrasonic_sensor</code>, <code>photoresistor</code>, <code>resistor</code></p>
<p><strong>4 outposts</strong>, each component's 4-window price cycle:</p>
<table>
<thead>
<tr>
<th>Outpost</th>
<th>Components carried (price by window 0/1/2/3)</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>1</strong></td>
<td>temp_sensor 20-25-30-35 · buzzer 15-20-25-30 · potentiometer 10-15-20-25 · capacitor 5-10-15-20 · push_button 5-10-15-20 · led 5-10-15-20</td>
</tr>
<tr>
<td><strong>2</strong></td>
<td>ultrasonic_sensor 40-45-50-35 · buzzer 20-25-30-15 · potentiometer 15-20-25-10 · photoresistor 15-20-25-10 · push_button 10-15-20-5 · led 10-15-20-5 · resistor 10-15-20-5</td>
</tr>
<tr>
<td><strong>3</strong></td>
<td>ultrasonic_sensor 45-50-35-40 · temp_sensor 30-35-20-25 · potentiometer 20-25-10-15 · photoresistor 20-25-10-15 · capacitor 15-20-5-10 · led 15-20-5-10 · resistor 15-20-5-10</td>
</tr>
<tr>
<td><strong>4</strong></td>
<td>ultrasonic_sensor 50-35-40-45 · temp_sensor 35-20-25-30 · buzzer 30-15-20-25 · photoresistor 25-10-15-20 · capacitor 20-5-10-15 · push_button 20-5-10-15 · resistor 20-5-10-15</td>
</tr>
</tbody>
</table>
<p><strong>8 circuits (equal-count random assignment at signup):</strong></p>
<table>
<thead>
<tr>
<th>Circuit</th>
<th>Required components</th>
</tr>
</thead>
<tbody>
<tr>
<td>C1</td>
<td>photoresistor, led, resistor</td>
</tr>
<tr>
<td>C2</td>
<td>push_button, potentiometer, led, resistor</td>
</tr>
<tr>
<td>C3</td>
<td>temp_sensor, buzzer, resistor</td>
</tr>
<tr>
<td>C4</td>
<td>push_button, capacitor, buzzer</td>
</tr>
<tr>
<td>C5</td>
<td>ultrasonic_sensor, led, resistor</td>
</tr>
<tr>
<td>C6</td>
<td>ultrasonic_sensor, temp_sensor, buzzer</td>
</tr>
<tr>
<td>C7</td>
<td>push_button, buzzer, photoresistor</td>
</tr>
<tr>
<td>C8</td>
<td>led, resistor, buzzer</td>
</tr>
</tbody>
</table>
<p>Ready-to-paste seed JSON:</p>
<pre><code class="language-json">{
  &#34;components&#34;: {
    &#34;temp_sensor&#34;: { &#34;name&#34;: &#34;Temperature Sensor&#34; },
    &#34;buzzer&#34;: { &#34;name&#34;: &#34;Buzzer&#34; },
    &#34;potentiometer&#34;: { &#34;name&#34;: &#34;Potentiometer&#34; },
    &#34;capacitor&#34;: { &#34;name&#34;: &#34;Capacitor&#34; },
    &#34;push_button&#34;: { &#34;name&#34;: &#34;Push Button&#34; },
    &#34;led&#34;: { &#34;name&#34;: &#34;LED&#34; },
    &#34;ultrasonic_sensor&#34;: { &#34;name&#34;: &#34;Ultrasonic Sensor&#34; },
    &#34;photoresistor&#34;: { &#34;name&#34;: &#34;Photoresistor&#34; },
    &#34;resistor&#34;: { &#34;name&#34;: &#34;Resistor&#34; }
  },
  &#34;outposts&#34;: {
    &#34;outpost1&#34;: {
      &#34;name&#34;: &#34;Outpost 1&#34;,
      &#34;slug&#34;: &#34;REPLACE_WITH_UUID_1&#34;,
      &#34;prices&#34;: {
        &#34;temp_sensor&#34;: [20, 25, 30, 35],
        &#34;buzzer&#34;: [15, 20, 25, 30],
        &#34;potentiometer&#34;: [10, 15, 20, 25],
        &#34;capacitor&#34;: [5, 10, 15, 20],
        &#34;push_button&#34;: [5, 10, 15, 20],
        &#34;led&#34;: [5, 10, 15, 20]
      }
    },
    &#34;outpost2&#34;: {
      &#34;name&#34;: &#34;Outpost 2&#34;,
      &#34;slug&#34;: &#34;REPLACE_WITH_UUID_2&#34;,
      &#34;prices&#34;: {
        &#34;ultrasonic_sensor&#34;: [40, 45, 50, 35],
        &#34;buzzer&#34;: [20, 25, 30, 15],
        &#34;potentiometer&#34;: [15, 20, 25, 10],
        &#34;photoresistor&#34;: [15, 20, 25, 10],
        &#34;push_button&#34;: [10, 15, 20, 5],
        &#34;led&#34;: [10, 15, 20, 5],
        &#34;resistor&#34;: [10, 15, 20, 5]
      }
    },
    &#34;outpost3&#34;: {
      &#34;name&#34;: &#34;Outpost 3&#34;,
      &#34;slug&#34;: &#34;REPLACE_WITH_UUID_3&#34;,
      &#34;prices&#34;: {
        &#34;ultrasonic_sensor&#34;: [45, 50, 35, 40],
        &#34;temp_sensor&#34;: [30, 35, 20, 25],
        &#34;potentiometer&#34;: [20, 25, 10, 15],
        &#34;photoresistor&#34;: [20, 25, 10, 15],
        &#34;capacitor&#34;: [15, 20, 5, 10],
        &#34;led&#34;: [15, 20, 5, 10],
        &#34;resistor&#34;: [15, 20, 5, 10]
      }
    },
    &#34;outpost4&#34;: {
      &#34;name&#34;: &#34;Outpost 4&#34;,
      &#34;slug&#34;: &#34;REPLACE_WITH_UUID_4&#34;,
      &#34;prices&#34;: {
        &#34;ultrasonic_sensor&#34;: [50, 35, 40, 45],
        &#34;temp_sensor&#34;: [35, 20, 25, 30],
        &#34;buzzer&#34;: [30, 15, 20, 25],
        &#34;photoresistor&#34;: [25, 10, 15, 20],
        &#34;capacitor&#34;: [20, 5, 10, 15],
        &#34;push_button&#34;: [20, 5, 10, 15],
        &#34;resistor&#34;: [20, 5, 10, 15]
      }
    }
  },
  &#34;circuits&#34;: {
    &#34;c1&#34;: { &#34;name&#34;: &#34;Circuit 1&#34;, &#34;required&#34;: [&#34;photoresistor&#34;, &#34;led&#34;, &#34;resistor&#34;] },
    &#34;c2&#34;: { &#34;name&#34;: &#34;Circuit 2&#34;, &#34;required&#34;: [&#34;push_button&#34;, &#34;potentiometer&#34;, &#34;led&#34;, &#34;resistor&#34;] },
    &#34;c3&#34;: { &#34;name&#34;: &#34;Circuit 3&#34;, &#34;required&#34;: [&#34;temp_sensor&#34;, &#34;buzzer&#34;, &#34;resistor&#34;] },
    &#34;c4&#34;: { &#34;name&#34;: &#34;Circuit 4&#34;, &#34;required&#34;: [&#34;push_button&#34;, &#34;capacitor&#34;, &#34;buzzer&#34;] },
    &#34;c5&#34;: { &#34;name&#34;: &#34;Circuit 5&#34;, &#34;required&#34;: [&#34;ultrasonic_sensor&#34;, &#34;led&#34;, &#34;resistor&#34;] },
    &#34;c6&#34;: { &#34;name&#34;: &#34;Circuit 6&#34;, &#34;required&#34;: [&#34;ultrasonic_sensor&#34;, &#34;temp_sensor&#34;, &#34;buzzer&#34;] },
    &#34;c7&#34;: { &#34;name&#34;: &#34;Circuit 7&#34;, &#34;required&#34;: [&#34;push_button&#34;, &#34;buzzer&#34;, &#34;photoresistor&#34;] },
    &#34;c8&#34;: { &#34;name&#34;: &#34;Circuit 8&#34;, &#34;required&#34;: [&#34;led&#34;, &#34;resistor&#34;, &#34;buzzer&#34;] }
  },
  &#34;meta&#34;: {
    &#34;circuitAssignmentCounts&#34;: {
      &#34;c1&#34;: 0, &#34;c2&#34;: 0, &#34;c3&#34;: 0, &#34;c4&#34;: 0, &#34;c5&#34;: 0, &#34;c6&#34;: 0, &#34;c7&#34;: 0, &#34;c8&#34;: 0
    }
  },
  &#34;gameConfig&#34;: {
    &#34;status&#34;: &#34;not_started&#34;,
    &#34;startingBalance&#34;: 200,
    &#34;gameStartTimestamp&#34;: null
  }
}
</code></pre>
<h2>2. Firebase RTDB schema (v2)</h2>
<pre><code>/components/{componentId}                → { name }
/outposts/{outpostId}                    → { name, slug, prices: { componentId: [p0,p1,p2,p3] } }
/circuits/{circuitId}                    → { name, required: [componentId,...] }
/meta/circuitAssignmentCounts/{id}       → number  (used only to balance random assignment)

/gameConfig
    status                                → &#34;not_started&#34; | &#34;running&#34; | &#34;ended&#34;
    startingBalance                       → number, editable any time; applied to a team at its own registration moment
    gameStartTimestamp                    → server timestamp | null, set exactly once by &#34;Start Global Clock&#34;

/adminSession
    activeSessionId                       → random string, rewritten on every admin passcode login

/teams/{leaderUid}                        ← teamId IS the leader&#39;s Google UID (enforces 1 team/account)
    teamName
    leaderName
    leaderEmail
    members                               → [name1, name2, name3]
    circuitId                             → assigned at registration
    balance                               → set to gameConfig.startingBalance at registration time
    status                                → &#34;playing&#34; | &#34;finished&#34;
    finishedAt                            → timestamp | null
    activeSessionId                       → random string, rewritten on every login
    createdAt
    inventory/{componentId}               → { owned: bool, boughtPrice: number, outpostId: string }
    transactions/{txId}                   → { type: &#34;buy&#34;|&#34;sell&#34;|&#34;swap&#34;, outpostId, componentId,
                                              amount, oldPrice?, newPrice?, balanceAfter, timestamp }
</code></pre>
<p>Notes:</p>
<ul>
<li><code>inventory</code> only needs entries for components ever owned; missing = not owned.</li>
<li>Registration is blocked only when <code>gameConfig.status == &quot;ended&quot;</code>.</li>
<li>The outpost <code>slug</code> is now a <strong>plain value encoded directly in the QR</strong> (not part of a URL) — see Module 4/5.</li>
</ul>
<hr>
<h2>3. Environment / setup checklist (do this before Module 0)</h2>
<ol>
<li>Create a Firebase project → enable <strong>Authentication → Google</strong> provider → enable <strong>Realtime Database</strong> (start in test mode, tighten later per Module 7).</li>
<li>Note your Firebase web config (apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId).</li>
<li>Generate 4 random UUIDs (<code>uuidgen</code> or any UUID tool) — these become the raw values encoded in each outpost's QR code. Keep a private note mapping UUID → physical outpost location.</li>
<li>Decide the admin passcode string.</li>
<li>Node.js 18+ and npm installed.</li>
</ol>
<p><code>.env.local</code> (never commit):</p>
<pre><code>VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ALLOWED_EMAIL_DOMAIN=iiitkottayam.ac.in
VITE_ADMIN_PASSCODE=
</code></pre>
<p>(Note: <code>VITE_APP_BASE_URL</code> from v1 is no longer needed — QR codes no longer encode a URL.)</p>
<hr>
<h2>4. Modular prompts for Gemini / Antigravity</h2>
<p>Paste each block as its own task, in order. Tell the agent to re-read <code>PROJECT_CONTEXT.md</code> before every module.</p>
<h3>Module 0 — Bootstrap &amp; shared context</h3>
<pre><code>Create a new Vite + React (JavaScript) project called &#34;circuit-hunt&#34;.
Install: firebase, react-router-dom, qrcode.react, html5-qrcode.
Folder structure under src/:
  /lib        (firebase.js, gameLogic.js, priceEngine.js)
  /pages      (Login, Register, Mission, Home, Market, AdminLogin, AdminDashboard, AdminQrCodes, Finished)
  /components (shared UI bits)
  /context    (AuthContext, TeamContext, MarketContext)
  /hooks      (useSingleSession.js — a reusable hook, see Module 2)

Create PROJECT_CONTEXT.md at the repo root and paste into it, verbatim, sections
&#34;0. Final decisions&#34;, &#34;1. Final data&#34; and &#34;2. Firebase RTDB schema&#34; from this build plan.
Re-read this file before every future task on this repo — it is the single source of truth.

Create .env.local.example with blank values for:
VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_DATABASE_URL,
VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID,
VITE_FIREBASE_APP_ID, VITE_ALLOWED_EMAIL_DOMAIN, VITE_ADMIN_PASSCODE

This task is scaffolding only — no game logic yet.
</code></pre>
<h3>Module 1 — Firebase init, price engine, and seed script</h3>
<pre><code>Read PROJECT_CONTEXT.md first.

1. Create src/lib/firebase.js initializing the Firebase app, exporting `auth` and `db`
   (Realtime Database), reading config from import.meta.env.

2. Create src/lib/priceEngine.js:
   getActiveWindowIndex(gameStartTimestamp, now) -&gt; 0|1|2|3, computed as
   Math.floor((now - gameStartTimestamp) / (10*60*1000)) % 4, returning null if
   gameStartTimestamp is null or now &lt; gameStartTimestamp.
   getPrice(outpost, componentId, windowIndex) -&gt; outpost.prices[componentId][windowIndex],
   undefined if that outpost doesn&#39;t carry the component.

3. Create scripts/seed.js (Node script, run with `node scripts/seed.js`) using the Firebase
   Admin SDK (add firebase-admin as a dependency) that writes /components, /outposts,
   /circuits, /meta/circuitAssignmentCounts and /gameConfig exactly as given in
   PROJECT_CONTEXT.md&#39;s seed JSON. Read the 4 real outpost UUIDs from a local
   outpost-slugs.json file shaped like
   { &#34;outpost1&#34;: &#34;&lt;uuid&gt;&#34;, &#34;outpost2&#34;: &#34;&lt;uuid&gt;&#34;, &#34;outpost3&#34;: &#34;&lt;uuid&gt;&#34;, &#34;outpost4&#34;: &#34;&lt;uuid&gt;&#34; }.
   Print the database URL when done.

4. Add a README section on getting a service account key for firebase-admin and where to
   place it (add to .gitignore).

Write Vitest unit tests for priceEngine.js: correct window at t=0, t=9m59s, t=10m,
t=39m59s, t=40m (wraps to window 0), and null gameStartTimestamp.
</code></pre>
<h3>Module 2 — Auth, single-session hook, and always-open registration</h3>
<pre><code>Read PROJECT_CONTEXT.md first.

1. Build src/hooks/useSingleSession.js — a reusable hook taking (dbPath, isActive) that:
   - on activation, writes a fresh random sessionId to `${dbPath}/activeSessionId` and keeps
     it in a ref (not localStorage — sessionStorage or in-memory is fine).
   - subscribes to `${dbPath}/activeSessionId`; if the remote value ever differs from the
     one this instance wrote, calls a provided onKicked() callback.
   This hook will be used for both teams (Module 2/3) and admin (Module 6).

2. Build Google Sign-In (src/pages/Login.jsx) via Firebase Auth&#39;s GoogleAuthProvider. After
   sign-in, if the email doesn&#39;t end with &#34;@&#34; + import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN,
   sign out immediately and show &#34;Only @iiitkottayam.ac.in accounts can play.&#34;

3. On successful login, look up /teams/{uid}:
   - If it exists: call useSingleSession(&#39;/teams/&#39; + uid, true) and route to /home.
   - If it doesn&#39;t exist AND /gameConfig/status != &#34;ended&#34;: route to /register.
   - If it doesn&#39;t exist AND /gameConfig/status == &#34;ended&#34;: show &#34;This event has ended,
     registration is closed.&#34;
   (There is no &#34;lobby&#34; gate — registration is open the entire time the event is running
   or hasn&#39;t started the clock yet.)

4. Build src/pages/Register.jsx: Team Name, Leader Name (prefilled from Google profile
   displayName, editable), 3 teammate name fields. On submit, run an RTDB transaction that:
   - Reads /meta/circuitAssignmentCounts, finds the circuit(s) with the current minimum
     count, picks one at random among ties, increments its count.
   - Reads the current /gameConfig/startingBalance value.
   - Writes /teams/{uid} = { teamName, leaderName, leaderEmail, members: [...], circuitId,
     balance: startingBalance, status: &#34;playing&#34;, activeSessionId: fresh random id,
     createdAt: now }.
   Then route to /mission (a one-time &#34;Your Mission&#34; screen — Module 3 builds this).

5. Set Firebase Auth persistence to LOCAL so refresh/reopen naturally resumes login and
   TeamContext (built in Module 3) re-fetches game state — no manual localStorage handling
   of game data needed.

Manual QA checklist: wrong-domain login rejected; re-registering with the same Google
account resumes the existing team instead of creating a second one; circuit counts stay
roughly even after several test registrations; second-device login kicks the first tab.
</code></pre>
<h3>Module 3 — Mission screen and player home</h3>
<pre><code>Read PROJECT_CONTEXT.md first.

1. Build src/context/TeamContext.jsx: once logged in, subscribes in real time to
   /teams/{uid}, exposes { team, loading }.

2. Build src/pages/Mission.jsx, shown once immediately after registration: &#34;Your Mission:
   {circuit name}&#34; listing its required components, with a &#34;Let&#39;s go!&#34; button to /home.
   (If a logged-in user with an existing team navigates to /mission directly, just redirect
   to /home — this page is only for the moment right after signup.)

3. Build src/pages/Home.jsx, showing live data from /teams/{uid}, /circuits/{team.circuitId}
   and /gameConfig:
   - Team name, balance (₹).
   - &#34;Your Circuit: {name}&#34; with progress (&#34;2 / 3 collected&#34;) and each required component
     ticked if owned, greyed out if not.
   - A read-only list of ALL currently owned components with price paid for each (no
     actions here — buy/sell/swap only happen inside Market after a QR scan).
   - A &#34;Scan QR to enter a marketplace&#34; button opening the camera (html5-qrcode). On a
     successful scan, look up the scanned raw text against /outposts (matching the `slug`
     field), store the resolved outpost in MarketContext (built in Module 4), and navigate
     to the single generic route /market (no identifying info in the URL).
   - If /gameConfig/status != &#34;running&#34;: show a banner &#34;The marketplace opens once the
     event clock starts&#34; and disable the scan button. (This does not affect being able to
     view your team&#39;s balance/circuit — only blocks entering a marketplace.)
   - If team.status == &#34;finished&#34;: redirect to /finished.

4. Build src/pages/Finished.jsx: &#34;Circuit Complete! 🎉&#34;, final balance, finish time.
</code></pre>
<h3>Module 4 — Marketplace: generic route, buy, sell, swap</h3>
<pre><code>Read PROJECT_CONTEXT.md first.

1. Build src/context/MarketContext.jsx: holds the currently &#34;entered&#34; outpost (set by the
   QR scan on Home) in memory only — never in the URL, never persisted to localStorage. If a
   user lands on /market with no outpost set in this context (e.g. by navigating directly or
   refreshing), redirect to /home with a &#34;Scan a QR code to enter a marketplace&#34; message —
   this is the only way in.

2. Build src/pages/Market.jsx at the plain route /market (no slug parameter):
   - Read the outpost from MarketContext.
   - If /gameConfig/status != &#34;running&#34;, show &#34;The event hasn&#39;t started yet&#34; and block all
     actions.
   - If team.status == &#34;finished&#34;, redirect to /finished.
   - Compute the active window index via priceEngine.getActiveWindowIndex, refreshed every
     few seconds with a visible countdown to the next price change.

   Render two tabs:

   SELL TAB:
   - List every component in team.inventory where owned == true AND this outpost&#39;s
     `prices` object includes that component (i.e. this outpost currently stocks it) —
     items the team owns that this outpost doesn&#39;t stock are NOT sellable here.
   - Show the component name and the price the team originally paid.
   - Sell button: in an RTDB transaction, set inventory[componentId] = { owned: false },
     add boughtPrice to balance, log { type: &#34;sell&#34;, outpostId, componentId,
     amount: boughtPrice, balanceAfter, timestamp }.

   BUY / SWAP TAB:
   - List every component this outpost carries, each at its current price for the active
     window.
   - Not owned → &#34;Buy ₹{price}&#34; button. On click (guard balance &gt;= price): deduct price,
     set inventory[componentId] = { owned: true, boughtPrice: price, outpostId }, log a
     &#34;buy&#34; transaction, then run the circuit-completion check below.
   - Already owned → &#34;Swap&#34; button with a coloured delta vs boughtPrice:
       currentPrice &lt; boughtPrice → green &#34;+₹{boughtPrice-currentPrice}&#34;
       currentPrice &gt; boughtPrice → red &#34;-₹{currentPrice-boughtPrice}&#34;
       equal → neutral grey &#34;₹0&#34;
     On click, atomically: refund boughtPrice, charge currentPrice, update
     inventory[componentId] = { owned: true, boughtPrice: currentPrice, outpostId }, log a
     single &#34;swap&#34; transaction { oldPrice, newPrice: currentPrice,
     amount: currentPrice-boughtPrice, balanceAfter }. Guard: if currentPrice &gt; boughtPrice,
     balance must cover the difference.

   CIRCUIT COMPLETION CHECK (after every buy/swap): load /circuits/{team.circuitId}.required,
   check every required componentId has inventory[id].owned == true; if so, in the same
   write set team.status = &#34;finished&#34; and team.finishedAt = server timestamp, then navigate
   to /finished.

   Use runTransaction for every balance/inventory mutation to avoid double-click races.

3. Extract the swap-delta calculation and the circuit-completion check into pure, testable
   functions in src/lib/gameLogic.js. Write Vitest tests for both in isolation from Firebase.
</code></pre>
<h3>Module 5 — QR codes for the 4 physical outposts</h3>
<pre><code>Read PROJECT_CONTEXT.md first.

Build src/pages/AdminQrCodes.jsx (linked from the admin dashboard, passcode-gated) that
reads all 4 outposts from /outposts and renders, for each, a printable card containing:
- The outpost name (for the organizer&#39;s own reference only)
- A QR code (qrcode.react) encoding ONLY the outpost&#39;s raw `slug` value as plain text —
  NOT a URL, not a deep link, nothing openable by a phone&#39;s default camera app. It should
  only be meaningful when read by this app&#39;s own in-app scanner (Module 3&#39;s Home scan flow).
- Do NOT print the slug as visible/copyable text anywhere on the card — the only way to
  obtain it should be scanning with the app.

Add a &#34;Print&#34; button using window.print() with print-friendly CSS: one card per page, a
large QR code, no navigation chrome visible when printing.
</code></pre>
<h3>Module 6 — Admin dashboard</h3>
<pre><code>Read PROJECT_CONTEXT.md first.

1. Build src/pages/AdminLogin.jsx: a passcode input compared against
   import.meta.env.VITE_ADMIN_PASSCODE. On success, use the useSingleSession hook from
   Module 2 against &#39;/adminSession&#39; (so only one admin browser stays &#34;live&#34; — logging in
   elsewhere with the passcode kicks the previous admin tab with a &#34;logged in elsewhere&#34;
   message), set an isAdmin flag in sessionStorage, and route to /admin/dashboard. Guard
   /admin/dashboard and /admin/qrcodes on that flag.

2. Build src/pages/AdminDashboard.jsx, live from RTDB:
   - Current clock status (not_started / running / ended).
   - A single &#34;Start Global Clock&#34; button, enabled only while status == &#34;not_started&#34;. On
     click (with a confirmation dialog, irreversible): set /gameConfig/gameStartTimestamp =
     server timestamp and /gameConfig/status = &#34;running&#34;. This has NO effect on registration
     (already always open) or on any existing team&#39;s balance.
   - An editable &#34;Starting balance&#34; field bound to /gameConfig/startingBalance, editable at
     any time — changing it only affects teams that register AFTER the change.
   - A live team table: Team Name, Members, Assigned Circuit, Balance, Owned vs required
     components (progress), Status (playing/finished), Finish time if finished — sorted with
     finished teams first by finish time (live leaderboard).
   - Each row expandable to show that team&#39;s full transaction log (type, outpost,
     component, amount, balance after, timestamp), newest first.
   - An &#34;End Game&#34; button setting /gameConfig/status = &#34;ended&#34; — this blocks new
     registrations and all further transactions (Home/Market should show a &#34;This event has
     ended&#34; message once status is &#34;ended&#34;).

Manual QA checklist: Start Global Clock changes nothing about already-registered teams or
their balances; starting-balance edits only apply to teams registering afterward; a second
admin passcode login on another browser kicks the first tab.
</code></pre>
<h3>Module 7 — Firebase security rules</h3>
<pre><code>Read PROJECT_CONTEXT.md first.

Write database.rules.json:
- /components, /outposts, /circuits: readable by any authenticated user, not writable from
  the client (seeded only via the Admin SDK script in Module 1).
- /meta/circuitAssignmentCounts: readable and writable by any authenticated user (needed for
  the client-side balanced-assignment transaction at registration). Note in a comment this
  means a malicious client could tamper with the counters — accepted tradeoff for this
  low-stakes event.
- /gameConfig: readable by any authenticated user; writable by any authenticated user (the
  admin dashboard has no separate backend, so this is gated only by the passcode UI, not by
  database rules — note this tradeoff in a comment).
- /adminSession: readable/writable by any authenticated user (same tradeoff, noted).
- /teams/$uid: read/write allowed only when auth.uid == $uid — a team can only touch its own
  subtree. Note in a comment that the Admin Dashboard&#39;s need to read ALL teams means
  /teams read is actually opened to any authenticated user, which technically lets a
  logged-in player read (but not write) other teams&#39; data via devtools — accepted tradeoff
  for this event.

Deploy with `firebase deploy --only database`.
</code></pre>
<h3>Module 8 — End-to-end manual test script</h3>
<pre><code>Read PROJECT_CONTEXT.md first.

Write TESTING.md at the repo root with a step-by-step run-through:
1. Two different Google accounts register two teams at different times (not simultaneously)
   — confirm each is immediately assigned a circuit (check the assignment stays balanced
   across ~10 test registrations), sees the Mission screen right away, and has balance ==
   the current startingBalance value at the moment they registered.
2. Before admin clicks Start Global Clock: confirm Market pages are reachable via QR scan
   but show &#34;hasn&#39;t started yet&#34; and block all transactions; confirm registration still
   works fine at this stage too.
3. Admin edits starting balance, confirm it only affects teams registering after the edit,
   not teams already registered.
4. Admin clicks Start Global Clock — confirm existing teams&#39; balances are unchanged, and
   price windows begin ticking from window 0.
5. Scan each of the 4 outpost QR codes (using the in-app scanner only) and confirm buy/sell/
   swap math matches PROJECT_CONTEXT.md&#39;s price tables exactly at each of the 4 ten-minute
   windows.
6. Confirm a component bought at one outpost can be sold at a *different* outpost, as long
   as that outpost stocks the component, at the original purchase price — and cannot be sold
   at an outpost that doesn&#39;t stock it.
7. Confirm the browser address bar never shows an outpost-identifying URL at any point in
   the QR-scan → Market flow, and that navigating directly to /market without scanning
   redirects back to Home.
8. Trigger a circuit completion, confirm the team is locked out of further trades and
   appears on the admin leaderboard with a finish time.
9. Confirm a second login to the same team account on another browser kicks the first tab,
   and the same for a second admin passcode login.
10. Admin clicks End Game, confirm registration and all transactions are blocked afterward.
</code></pre>

</body></html>