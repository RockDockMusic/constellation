# Constellation

One sky. Everyone adds a star. An on-chain AI decides whether your star truly connects to the last one, and the chain of light grows.

## What hangs in the sky

A constellation here is not a picture. It is a chain of short lines, written one at a time by different hands, where every line must follow from the one before it. The first star sets a theme and a direction. Each star after it is a continuation: an answer, a consequence, a next breath. Read top to bottom and a constellation is a single thread that many people wrote without ever meeting.

The sky holds many constellations at once. Any of them can be extended by anyone. None of them belong to one author.

## How a star is judged

When you cast the next star, you are not judged alone. You are judged against the tail, the current last star. An AI called the Stargazer reads the theme, that previous line, and your new one, and rules how strongly the two connect:

- **FORGED**: a clear, meaningful, on-theme continuation. The star ignites at full brightness and joins the chain.
- **FRAYED**: a thin or only-tangential link that still holds. The star joins, but dimly.
- **SNAPPED**: a line that ignores the previous star, contradicts it, or drifts off theme. The star flares and fades. It does not join, and the current streak of unbroken links resets to zero.

Each ruling also carries a resonance from 0 to 100, the strength of the link. The chain keeps a running momentum: how many stars in a row have held without a snap, and the best streak it ever reached.

## Why the sky lives on-chain

A judge of meaning has to be a language model; only an AI can tell a real continuation from a non-sequitur. But a language model alone is a black box you would have to trust. GenLayer removes the trust. The Stargazer runs inside the contract, and its ruling is settled by consensus: every validator independently re-reads the link and must agree on the verdict exactly, and on the resonance within a tolerance. The note it writes is free prose and is never compared. The equivalence check is a custom validator handed to `gl.vm.run_nondet_unsafe`, never `strict_eq`, which would demand identical wording from every validator and stall the chain.

Determinism guards the rest: code, not the model, decides that a FORGED or FRAYED star is appended and a SNAPPED one is refused, clamps the resonance into the band its verdict implies, advances the momentum, and seals a constellation once it reaches eighty stars. The model proposes the link; the chain decides what becomes canon.

## The instruments

| Method | Kind | What it does |
| --- | --- | --- |
| `found_constellation(theme, first_star)` | write, no AI | open a new chain with its seed star |
| `add_star(chart_id, text)` | write, AI consensus | cast the next star; the Stargazer rules the link |
| `get_constellations(start)` | view | every chain, 20 at a time, newest first |
| `get_constellation(id)` | view | one chain: theme, length, momentum, tail, last attempt |
| `get_stars(id, start)` | view | the chain itself, in order, 20 stars at a time |
| `get_stats()` | view | totals: chains, stars, attempts |

No server, no database, no deposits. Every star and every ruling is contract storage; the page is a static star-map that reads the sky and writes one star at a time.

## What you see

No banner, no pitch. The map fills the screen and it is the live chain: stars placed along a drawn path, joined by lines of light, bright where a link is strong and dim where it frayed. Pick a star to read it. Pick a different constellation, or chart a new one with a seed line. When you cast a star, the screen holds while the Stargazer reads (a consensus round runs one to five minutes), shows the verdict it is leaning toward, then either ignites your star into the map or lets it flare and fade.

Built with Next.js (static export), framer-motion, genlayer-js, and entirely hand-drawn SVG. Type set in Spectral, Inter Tight, and Red Hat Mono. A deep-space palette of starlight and forged gold over indigo. No stock images; the sky is drawn.

## Chart your own

```bash
genvm-lint lint contracts/contract.py
gltest tests/integration/ -v -s --network studionet   # the link ruling, gasless

cd frontend
npm install
npm run dev      # open the sky locally
npm run build    # static export to out/
```

A browser wallet on GenLayer Bradbury Testnet and a little faucet GEN cover the fees. There is nothing to stake.

## Coordinates

- The sky: https://rockdockmusic.github.io/constellation/
- Contract: `0xA945A4217c58D04128C4378BD5C08ed3dF3575B3`
- Explorer: https://explorer-bradbury.genlayer.com/address/0xA945A4217c58D04128C4378BD5C08ed3dF3575B3
- First light: `0xa219cc0646d6a903d5ce6a859277ba0bd54bcd969fd0e35e6142bea5cbebfecd`
- Faucet: https://testnet-faucet.genlayer.foundation/

The first star is waiting to be cast. After that, the sky is a conversation.
