#!/usr/bin/python3

import socket
import threading

import requests

threads = []
mongoStich = "none"

def listen():
    global threads

    connection = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    connection.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEPORT, 1)
    connection.bind(('0.0.0.0', 9090))
    
    while True:
        connection.listen(10)
    
        conn, addr = connection.accept()
        t = threading.Thread(target=update_userdata, args=(conn, addr))
        t.daemon = True
        t.start()

    connection.close()

def update_userdata(conn, addr):
    print("Connected by ", addr)
    while 1:
        data = conn.recv(4096)
        if not data:
            break
        # NEWDATA<>unique_id<>start_time<>end_time<>center_x<>center_y<>offset_x<>offset_y<>\0

        tag, uid, start_time, end_time, center_x, center_y, offset_x, offset_y, _ = data.decode('utf_8').split('<>')
        print(tag, uid, start_time, end_time, center_x, center_y, offset_x, offset_y)
        
        if tag != "NEWDATA":
            print("invalid data")
            break
        
        data = {
            "uid": uid,
            "start_time": start_time,
            "end_time": end_time,
            "center_x": center_x,
            "center_y": center_y,
            "offset_x": offset_x,
            "offset_y": offset_y
        }
        
        global mongoStich
        r = requests.post(mongoStich, data=data);
        print(r.status_code, r.reason)
        

if __name__ == '__main__':
    try:
        print("Listenning on 127.0.0.1 at port 9090")
        listen()
    except KeyboardInterrupt:
        exit()

