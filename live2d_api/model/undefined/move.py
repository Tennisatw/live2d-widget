import colorsys
import os

import numpy as np
from PIL import Image


# Opening the image and converting
# it to RGB color mode
# IMAGE_PATH => Path to the image


def move(path_in, path_out):
    img = Image.open(path_in).convert('RGBA')
    img_arr = np.array(img)

    hair1 = (400, 650, 0, 400)
    hair2 = (0, 300, 400, 650)
    hair3 = (300, 710, 700, 840)
    eye1 = (530, 600, 600, 730)
    eye2 = (800, 860, 600, 660)
    wing = (650, 850, 0, 350)

    for item in [hair1, hair2, hair3]:
        for x in range(item[0], item[1]):
            for y in range(item[2], item[3]):
                h, s, v = colorsys.rgb_to_hsv(img_arr[x, y][0] / 255., img_arr[x, y][1] / 255., img_arr[x, y][2] / 255.)
                if 0 < h < 0.25:
                    if v > 0.5:
                        r, g, b = colorsys.hsv_to_rgb(h + 0.55, s, v - 0.2)
                        img_arr[x, y] = [r * 255, g * 255, b * 255, img_arr[x, y][3]]

    for item in [eye1, eye2]:
        for x in range(item[0], item[1]):
            for y in range(item[2], item[3]):
                h, s, v = colorsys.rgb_to_hsv(img_arr[x, y][0] / 255., img_arr[x, y][1] / 255., img_arr[x, y][2] / 255.)
                r, g, b = colorsys.hsv_to_rgb(h + 0.15, s + 0.1, v - 0.1)
                img_arr[x, y] = [r * 255, g * 255, b * 255, img_arr[x, y][3]]

    for item in [wing]:
        for x in range(item[0], item[1]):
            for y in range(item[2], item[3]):
                img_arr[x, y][3] = 0

    
    img = Image.fromarray(img_arr)
    # width, height = img.size
    # new_width = width // 2
    # new_height = height // 2

    # img = img.resize((new_width, new_height))
    # img.show()
    img.save(path_out)


path_in = r"C:\Users\wqw\Downloads\live2d_api-1.0.1\model\Potion-Maker\Tia\textures"
path_out = r"C:\Users\wqw\Downloads\live2d_api-1.0.1\model\Potion-Maker\Tia\textures2"

for root, ds, fs in os.walk(path_in):
    for f in fs:
        move(path_in + '\\' + f, path_out + '\\' + f)
