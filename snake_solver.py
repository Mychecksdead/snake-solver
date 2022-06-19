from audioop import reverse
import cv2 as cv
import numpy as np
import pyautogui
import time as t
import keyboard

(x, y) = (0, 0)

(f_x, f_y) = (0, 0)

(l, r, u, d) = (0, 1, 2, 3)
# 0 left 1 right 2 down 3 up

field = []
parent = []
for i in range(40):
    field.append([0] * 40)
    parent.append([])
for i in range(40):
    for j in range(40):
        parent[i].append([-1, -1])
def detect_color(color=[0, 0, 0]):
    image = np.array(pyautogui.screenshot(region=(0, 0, 400, 400)))
    t = [[-1, -1]]
    for i in range(1, 400, 10):
        for j in range(1, 400, 10):
            if (image[i][j] == color).all():
                t.insert(0, [i//10, j//10])
    return t

def press(turn):
    if turn == l:
        pyautogui.press('left')
    elif turn == r:
        pyautogui.press('right')
    elif turn == u:
        pyautogui.press('up')
    else:
        pyautogui.press('down')

def f(num):
    return (num+40)%40

def pathfinder(start=[0, 0]):
    q = [start]
    arr = [[1, 0], [0, 1], [-1, 0], [0, -1]]
    field[start[0]][start[1]] = 1
    parent[start[0]][start[1]] = start
    while len(q):
        pos = q.pop(0)
        for i in arr:
            a = f(pos[0] + i[0])
            b = f(pos[1] + i[1])
            if field[a][b] == 0:
                field[a][b] = 1
                parent[a][b] = pos
                q.append([a, b])


f_x, f_y = detect_color([255, 0, 0])[0]

ok = 1

if f_x == -1:
    print("Something wrong")
    ok = 0

def main():
    global f_x, f_y
    white_part = detect_color([255, 255, 255])
    for a in white_part[:-1]:
        field[a[0]][a[1]] = 1
    pathfinder([f_x, f_y])
    #print(parent)
    while True:
        (x, y) = detect_color([0, 128, 0])[0]
        if parent[x][y][0] < x:
            press(u)
        elif parent[x][y][0] > x:
            press(d)
        elif parent[x][y][1] > y:
            press(r)
        elif parent[x][y][1] < y:
            press(l)

        if parent[x][y] == [x, y]:
            print("Next one!")
            for i in range(40):
                for j in range(40):
                    parent[i][j] = [-1, -1]
            f_x, f_y = detect_color([255, 0, 0])[0]
            if f_x == -1:
                print("Something wrong")
                return
            pathfinder([f_x, f_y])

            
        print(parent[x][y], x, y)
        if keyboard.is_pressed('q'):
            break
        t.sleep(0.000001)

if ok:
    main()