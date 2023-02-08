# Extract text from image

import cv2
import pytesseract

pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'

img = cv2.imread('yardim.jpg')
# text = pytesseract.image_to_string(img)

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
gray, img_bin = cv2.threshold(gray,128,255,cv2.THRESH_BINARY | cv2.THRESH_OTSU)
gray = cv2.bitwise_not(img_bin)

kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 1))

dilation = cv2.dilate(gray, kernel, iterations=1)
erosion = cv2.erode(dilation, kernel, iterations=1)

out_below = pytesseract.image_to_string(erosion)

print("OUTPUT:", out_below)
