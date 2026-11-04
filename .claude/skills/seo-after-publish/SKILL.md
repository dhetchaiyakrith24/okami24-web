---
name: seo-after-publish
description: What to do for Google after something changed on okami24.store — a new product, a new article, edited copy, a picture or price change, a moved or deleted page — and how to read Search Console's Page indexing reasons. Use it after a merge that a visitor can see, when the owner asks "Google เห็นหรือยัง", "ขอจัดทำดัชนี", "request indexing", "ทำไมหน้านี้ไม่ขึ้น Google", "หน้าไม่ติด index", and from the daily request run if the owner sets one up. It reads the list of pages Google has not read since they changed (scripts/gsc-unread.ts), requests those in the owner's Chrome only, stops at the daily quota and carries the rest. Not for rankings or copy work (skill seo-audit).
---

# After publish

The owner's table, from the SEO plan the owner approved on 05/11. Nothing else needs a request.

| What changed | What to do |
|---|---|
| New product · new article | Request it (it comes up on the list by itself as "never read") |
| Edited copy | Check the list. Request only if the page is on it: Google has not read it since the change |
| Picture · price | Nothing. Its sitemap date does not move, and it is never on the list for this |
| Moved or deleted page | A redirect to the nearest live page, in `next.config.ts` `redirects()`. No request. URLs are on the Do-not-touch list (HANDOFF §17): the round file must name the move |

Sitemap dates move only when what a reader gets on a page changes, so never "refresh" a date to attract Google: Google
trusts lastmod only while it stays accurate.

## The list

1. `git fetch origin gsc-data`
2. `npx tsx scripts/gsc-unread.ts` (its head explains the columns and `--limit`)

The first line says when Google's read dates were last checked (the `gsc-export` workflow, daily). Older than the script
warns about = run the workflow from GitHub Actions on main first, or the list is stale. Right after a merge, a new page is
on the list before the daily check has seen it: that is correct. A page's change reaches Google only once it is live, so
wait for the deploy (HANDOFF §17 "Render after a merge").

Pages the script says "could not be checked" stay off the list: do not request them on a guess.

## Requesting

Use the owner's Chrome (Claude in Chrome), logged in to Search Console. **Only pages on the list, in the list's order.**
Asking for a page Google has already read wastes the day's quota.

1. Open `https://search.google.com/search-console/inspect?resource_id=sc-domain%3Aokami24.store`
2. Click the top box, type the full URL, press Enter twice, wait about 15 seconds for the result.
3. Screenshots of this page can time out: use `find` to locate the buttons and text.
4. Click the request-indexing link, then wait up to 60 seconds for the dialog "ขอการจัดทำดัชนีแล้ว". Do not navigate away sooner.
5. Add a line `YYYY-MM-DD <url>` to `_incoming/seo-requests.log` in the main checkout (the head of `scripts/gsc-unread.ts`),
   so tomorrow's list holds that page back while Google gets to it.

**Stop at the daily quota.** Search Console says so in a dialog when the day's quota is used. Google does not publish the
number, so go by the dialog, not a count. Do not retry today. The rest stay on the list for tomorrow: nothing to carry by
hand. A request is a hint, not an order, and repeating it does not help.

A page not logged in, or a login page instead of Search Console = stop and tell the owner (TEAM_RULES 13.3 #2). Friday never
types a password.

## Reading why a page is not indexed

The `coverage` field in `inspection.json` on branch `gsc-data` carries the reason per URL in English
(`git show origin/gsc-data:gsc/latest/inspection.json`). The Page indexing report in Search Console shows the same reasons
in Thai and lags by days, so trust the per-URL field for today's state.

| Reason | What it means | What to do |
|---|---|---|
| Submitted and indexed · Indexed, not submitted in sitemap | On Google | Nothing. If it should be in the sitemap, look at why it is not |
| Excluded by 'noindex' tag | The page asked not to be indexed | Usually on purpose (tool pages, empty category or brand). Only a page in the sitemap with this is a bug |
| Page with redirect | An old URL pointing to a new one | Normal. Fix only if the sitemap lists it |
| Alternate page with proper canonical tag | A variant pointing to the main page | Normal |
| Duplicate, Google chose different canonical than user | Google thinks another page is the main one | Compare the two pages. Make this page's text its own, or point it at the other |
| Duplicate without user-selected canonical | Same, and the page names no main page | Check the page's canonical tag, then as above |
| Discovered - currently not indexed | Google knows the URL and has not come | Link to it from a page Google reads often. One request if it is on the list, then wait |
| Crawled - currently not indexed | Google read it and chose not to keep it | The page is too thin or too like another. A request will not change that: improve the page, then let it come up on the list |
| Soft 404 | It looks empty or like an error to Google | Check the live page has real content, fix it |
| Not found (404) | The URL is gone | Had visitors or links = redirect. Never had any = leave it |
| Server error (5xx) | Google hit an error, often during a deploy | Check the live page now. A one-off during a deploy needs nothing |
| Blocked by robots.txt | robots.txt stops Google | Only `/preview/` and `/api/` should be. Anything else is a bug |
| Redirect error | A loop or a chain too long | Fix the redirect |
| URL is unknown to Google | Google has never seen it | New page: request it. Old page: it has no links, add some |

Report what was requested in the owner's words: which pages, how many left for tomorrow. Whether the page then shows up on
Google is read later from the list, not promised (central §12 item 9).
