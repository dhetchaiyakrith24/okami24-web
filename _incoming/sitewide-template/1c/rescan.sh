#!/bin/bash
# build the branch head, start 3412, then the after-scans of batch 1c (one Chrome job at a time)
D=_incoming/sitewide-template/1c
node scripts/test-server.js build > $D/build-after2.log 2>&1 || { echo BUILD-FAIL; exit 1; }
node scripts/test-server.js start >> $D/build-after2.log 2>&1
rm -rf $D/vt-after2; mkdir -p $D/vt-after2
node scripts/visible-text.js scan --base http://localhost:3412 --out $D/vt-after2 /products/caliburn-g4-pro /products/caliburn-g4-pro-koko /products/caliburn-g4 /products/caliburn-g5 /brands/uwell 2> $D/vt-after2/scan.log | tail -1
node scripts/visible-text.js diff $D/vt-before $D/vt-after2 $D/vt-diff2 --before-base http://localhost:3412 --after-base http://localhost:3412 2>&1 | tail -2
node scripts/page-text-length.js $D/vt-after2 --facts $D/facts.json 2>&1 | grep "products/caliburn-g4-pro"
node scripts/wordbreak-scan.js --out $D/wb-after2 /products/caliburn-g4-pro /products/caliburn-g4-pro-koko > $D/wb-after2.md 2>&1
grep "^## " $D/wb-after2.md
bash $D/shots.sh after
echo RESCAN-DONE
