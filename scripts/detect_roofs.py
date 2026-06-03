"""Detect house roofs in the aerial neighborhood photo.

Roofs in this image are compact, low-saturation (gray) or warm-brown patches,
sitting amid green lawns/trees and surrounded by the light-gray road. We mask
for roof-like color, clean up with morphology, then keep blobs whose size and
shape look like a single roof (not the long thin road or tiny speckle)."""

import cv2
import numpy as np

SRC = "public/neighborhood.png"
img = cv2.imread(SRC)
H, W = img.shape[:2]
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
h, s, v = cv2.split(hsv)

# --- color masks -----------------------------------------------------------
# Gray roofs: low saturation, mid/high value (but the road is also gray, so we
# rely on shape later to drop it).
gray_roof = (s < 55) & (v > 70) & (v < 225)
# Warm brown/tan roofs: orange-ish hue, decent saturation.
brown_roof = ((h >= 5) & (h <= 28)) & (s > 45) & (v > 70)

mask = ((gray_roof | brown_roof).astype(np.uint8)) * 255

# Kill obvious vegetation (green) and pool (blue) just in case.
green = ((h >= 33) & (h <= 95) & (s > 40)).astype(np.uint8) * 255
blue = ((h >= 96) & (h <= 130) & (s > 60)).astype(np.uint8) * 255
mask[green > 0] = 0
mask[blue > 0] = 0

# --- morphology: close gaps within a roof, open to drop speckle -------------
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))

# --- connected components ---------------------------------------------------
n, labels, stats, centroids = cv2.connectedComponentsWithStats(mask, 8)

roofs = []
img_area = H * W
for i in range(1, n):
    x, y, w, hh, area = stats[i]
    if area < 0.0016 * img_area:      # too small (speckle / driveway)
        continue
    if area > 0.06 * img_area:        # too big (likely road run)
        continue
    ar = w / float(hh)
    if ar > 4.5 or ar < 0.22:         # too thin/long -> road
        continue
    extent = area / float(w * hh)
    if extent < 0.28:                 # too sparse -> road curve
        continue
    cx, cy = centroids[i]
    roofs.append((cx, cy, area))

roofs.sort(key=lambda r: -r[2])
print(f"detected {len(roofs)} roof candidates")

ann = img.copy()
out = []
for cx, cy, area in roofs:
    px, py = round(cx / W * 100, 1), round(cy / H * 100, 1)
    out.append((px, py))
    cv2.circle(ann, (int(cx), int(cy)), 16, (0, 215, 255), 3)
    cv2.circle(ann, (int(cx), int(cy)), 3, (0, 0, 255), -1)
    cv2.putText(ann, f"{px},{py}", (int(cx) + 12, int(cy) - 12),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 3)
    cv2.putText(ann, f"{px},{py}", (int(cx) + 12, int(cy) - 12),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

cv2.imwrite("scripts/roofs_annotated.png", ann)
cv2.imwrite("scripts/roofs_mask.png", mask)
print("coords (x%, y%):")
for p in out:
    print(f"  {{ x: {p[0]}, y: {p[1]} }},")
