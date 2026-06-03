"""Overlay candidate roof coordinates on the aerial photo for visual validation.
Coords are (x%, y%) of the 1152x840 image. Edit CANDS and re-run to nudge."""
import cv2, sys

CANDS = [
    (7, 18), (21, 23), (47, 20), (62, 23), (75, 38),
    (16, 42), (43, 50), (40, 74), (70, 60), (32, 90),
    (66, 87), (6, 89),
]
img = cv2.imread("public/neighborhood.png")
H, W = img.shape[:2]
for i, (px, py) in enumerate(CANDS):
    x, y = int(px/100*W), int(py/100*H)
    cv2.circle(img, (x, y), 18, (0, 215, 255), 3)
    cv2.circle(img, (x, y), 3, (0, 0, 255), -1)
    t = str(i+1)
    cv2.putText(img, t, (x-6, y+6), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,0,0), 4)
    cv2.putText(img, t, (x-6, y+6), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 1)
cv2.imwrite("scripts/check.png", img)
print("wrote scripts/check.png with", len(CANDS), "markers")
