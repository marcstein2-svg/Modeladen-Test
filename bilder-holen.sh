#!/usr/bin/env bash
# Optional: lädt die Fotos von der bisherigen WordPress-Seite hierher
#
# Aufruf im Projektordner:   bash bilder-holen.sh
#
# Hinweise
# - Nur ausführen, solange die alte Seite noch online ist.
# - Dateinamen und Pfade stammen aus der alten Seite. Was nicht gefunden wird, meldet das Skript;
#   solche Bilder lassen sich von Hand aus der WordPress-Mediathek ergänzen.
# - Ist ImageMagick installiert (mogrify), werden die Bilder auf max. 1200 px verkleinert.
# - Nur die Bilder verwenden, an denen das Modehaus die Rechte hat.

set -u

BASE="https://www.schuetz-mode.de/wp-content/uploads/2016/02"
DEST="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$DEST"

holen() {
  local ziel="$1"; shift
  local name url
  for name in "$@"; do
    # 1. Originalgröße, 2. Vorschaugröße (400 px, nur Notlösung)
    for url in "$BASE/$name.jpg" "$BASE/$name-400x284.jpg"; do
      if curl -fsSL --retry 2 --max-time 60 -o "$DEST/$ziel" "$url"; then
        case "$url" in
          *-400x284.jpg) echo "KLEIN  $ziel  (nur Vorschaugröße gefunden: $url)" ;;
          *)             echo "OK     $ziel" ;;
        esac
        if command -v mogrify >/dev/null 2>&1; then
          mogrify -resize '1200x1200>' -quality 80 "$DEST/$ziel"
        fi
        return 0
      fi
    done
  done
  rm -f "$DEST/$ziel"
  echo "FEHLT  $ziel  – bitte von Hand ergänzen"
  return 1
}

# Mode
holen mode-1.jpg 2016FS_L1022196
holen mode-2.jpg 2016FS_L1022211
holen mode-3.jpg 2016FSL1022178
holen mode-4.jpg 2016FS_L1022193
holen mode-5.jpg 2016FSM_L1022192
holen mode-6.jpg 2016FS_L1022219

# Betten
holen betten-derby-1.jpg          Derby_02
holen betten-derby-2.jpg          Derby_det_6
holen betten-oxford-1.jpg         Oxford
holen betten-oxford-2.jpg         Oxford_2_2
holen betten-basic-lindgruen.jpg  Boxspring-Basic-lindgruen
holen betten-basic-milieu.jpg     Boxspring-Basic-2-Milieu
holen betten-step5-paris.jpg      Step_5_Paris_rot__Milieu2-1 Step_5_Paris_rot__Milieu2
holen betten-step5-luzern.jpg     Step_5_Luzern_braun

echo
echo "Fertig. Bilder liegen in: $DEST"
