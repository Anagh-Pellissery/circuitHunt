# Circuit Hunt - End-to-End Testing Guide

Follow this step-by-step guide to manually verify the entire application flow from end to end. 

## 1. Registration & Balancing
- **Action**: Use two different Google accounts (ending in `@iiitkottayam.ac.in`) to register two teams at different times. 
- **Verify**: Confirm each team is immediately assigned a circuit and routed to the "Your Mission" screen.
- **Verify**: Check Firebase `/meta/circuitAssignmentCounts` across ~10 test registrations to ensure circuit assignments stay mathematically balanced.
- **Verify**: Confirm their starting balance precisely matches the `startingBalance` value configured in the Admin Dashboard at the exact moment they registered.

## 2. Pre-Game Lockout
- **State**: The Admin has **not** clicked "Start Global Clock".
- **Action**: Navigate to Home and scan an outpost QR code.
- **Verify**: The Market page loads but displays "The event hasn't started yet", blocking all transactions.
- **Verify**: Confirm registration is still fully functional while the game clock is not running.

## 3. Dynamic Starting Balance
- **Action**: As an Admin, edit the "Starting balance" in the dashboard.
- **Verify**: Check that teams registered *before* the edit keep their original balance.
- **Verify**: Register a new team and confirm they receive the *new* starting balance.

## 4. Starting the Global Clock
- **Action**: Admin clicks "Start Global Clock" and confirms the prompt.
- **Verify**: Confirm existing teams' balances are completely unchanged.
- **Verify**: Confirm the price windows begin ticking in the Market from Window 0.

## 5. Market Pricing & Transactions
- **Action**: Scan each of the 4 outpost QR codes using the Home screen in-app scanner.
- **Verify**: Cross-reference the "Buy" and "Swap" prices in the UI against the exact price tables in `PROJECT_CONTEXT.md` for the current 10-minute active window. Ensure math is flawless.

## 6. Global Inventory
- **Action**: Buy a component at Outpost 1. Scan Outpost 2.
- **Verify**: Confirm the component can be sold at Outpost 2 (assuming Outpost 2 stocks it) for the exact original purchase price.
- **Verify**: Confirm the component cannot be sold at Outpost 2 if Outpost 2 does not carry that component type.

## 7. URL Obfuscation
- **Action**: Complete a QR scan to enter the market.
- **Verify**: Confirm the browser address bar simply reads `/market` (no slugs, IDs, or tokens in the URL).
- **Action**: Open a new tab and manually type `/market`.
- **Verify**: Confirm you are instantly kicked back to the `/home` screen because no QR code was scanned into memory.

## 8. Circuit Completion
- **Action**: Buy or swap the final required component for your assigned circuit.
- **Verify**: Upon transaction success, you are instantly redirected to `/finished`.
- **Verify**: The UI locks you out of further trades.
- **Verify**: The Admin Leaderboard accurately reflects your "Finished" status and logs the exact finish time.

## 9. Single-Session Enforcement
- **Action**: Log into a team account on Browser A. Log into the same team account on Browser B.
- **Verify**: Browser A immediately receives an alert ("Session opened elsewhere") and is forcefully logged out.
- **Action**: Repeat the same dual-login test with the Admin Passcode on `/admin/login`.
- **Verify**: Confirm the first Admin tab is booted out.

## 10. Game End
- **Action**: Admin clicks "End Game".
- **Verify**: All ongoing transactions are blocked (Home/Market show "This event has ended").
- **Verify**: New registrations are entirely locked out.
