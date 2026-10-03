#!/bin/bash
# usage: shots.sh <tag before|after>  — full-page 390 + 1440 of the two 1c pages on the test server (scroll-and-wait)
T=$1; O=_incoming/sitewide-template/1c/shots
EV='(async()=>{const s=ms=>new Promise(r=>setTimeout(r,ms));for(let y=0;y<document.documentElement.scrollHeight;y+=500){scrollTo(0,y);await s(220)}await s(1200);scrollTo(0,0);await s(800);return document.documentElement.scrollHeight})()'
for p in caliburn-g4-pro caliburn-g4-pro-koko; do
  node scripts/shot.js $O/$p-390-$T.png http://localhost:3412/products/$p --ready --width 390 --max-height 16000 --dpr 1 --eval "$EV" 2>&1 | tail -1
  node scripts/shot.js $O/$p-1440-$T.png http://localhost:3412/products/$p --ready --desktop --width 1440 --max-height 16000 --dpr 1 --eval "$EV" 2>&1 | tail -1
done
