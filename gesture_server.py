import cv2
import mediapipe as mp
import numpy as np
from collections import deque
import time
import json
import sys
import logging
import base64

logging.getLogger('mediapipe').setLevel(logging.ERROR)
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.9, min_tracking_confidence=0.8)

TIP_IDS = [4, 8, 12, 16, 20]
PIP_IDS = [2, 6, 10, 14, 18]
MCP_IDS = [1, 5, 9, 13, 17]
WRIST = 0

gesture_history = deque(maxlen=3)
last_gesture = None  

def calculate_distance(p1, p2):
    return np.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2 + (p1.z - p2.z)**2)

def normalize_distance(landmarks, dist):
    wrist = landmarks.landmark[WRIST]
    middle_mcp = landmarks.landmark[MCP_IDS[2]]
    hand_size = calculate_distance(wrist, middle_mcp)
    return dist / hand_size if hand_size > 0 else dist

def get_hand_orientation(landmarks):
    wrist = landmarks.landmark[WRIST]
    middle_mcp = landmarks.landmark[MCP_IDS[2]]
    vector = np.array([middle_mcp.x - wrist.x, middle_mcp.y - wrist.y])
    vertical = np.array([0, -1])
    angle = calculate_angle(wrist, middle_mcp, landmarks.landmark[MCP_IDS[2]])
    return np.degrees(np.arccos(np.dot(vector, vertical) / (np.linalg.norm(vector) or 1)))

def calculate_angle(p1, p2, p3):
    v1 = np.array([p1.x - p2.x, p1.y - p2.y, p1.z - p2.z])
    v2 = np.array([p3.x - p2.x, p3.y - p2.y, p3.z - p2.z])
    norm_v1, norm_v2 = np.linalg.norm(v1), np.linalg.norm(v2)
    if norm_v1 == 0 or norm_v2 == 0:
        return 0
    cosine_angle = np.dot(v1, v2) / (norm_v1 * norm_v2)
    return np.degrees(np.arccos(np.clip(cosine_angle, -1.0, 1.0)))   

def recognize_gesture(landmarks):
    thumb_tip, index_tip = landmarks.landmark[TIP_IDS[0]], landmarks.landmark[TIP_IDS[1]]
    middle_tip, ring_tip = landmarks.landmark[TIP_IDS[2]], landmarks.landmark[TIP_IDS[3]]
    pinky_tip = landmarks.landmark[TIP_IDS[4]]

    thumb_pip, index_pip = landmarks.landmark[PIP_IDS[0]], landmarks.landmark[PIP_IDS[1]]
    middle_pip, ring_pip = landmarks.landmark[PIP_IDS[2]], landmarks.landmark[PIP_IDS[3]]
    pinky_pip = landmarks.landmark[PIP_IDS[4]]

    thumb_mcp = landmarks.landmark[MCP_IDS[0]]
    index_mcp = landmarks.landmark[MCP_IDS[1]]
    middle_mcp = landmarks.landmark[MCP_IDS[2]]
    ring_mcp = landmarks.landmark[MCP_IDS[3]]
    pinky_mcp = landmarks.landmark[MCP_IDS[4]]

    orientation = get_hand_orientation(landmarks)

    thumb_up, thumb_conf = is_finger_extended(thumb_tip, thumb_pip, thumb_mcp, orientation)
    index_up, index_conf = is_finger_extended(index_tip, index_pip, index_mcp, orientation)
    middle_up, middle_conf = is_finger_extended(middle_tip, middle_pip, middle_mcp, orientation)
    ring_up, ring_conf = is_finger_extended(ring_tip, ring_pip, ring_mcp, orientation)
    pinky_up, pinky_conf = is_finger_extended(pinky_tip, pinky_pip, pinky_mcp, orientation)

    thumb_index_dist = normalize_distance(landmarks, calculate_distance(thumb_tip, index_tip))
    thumb_middle_dist = normalize_distance(landmarks, calculate_distance(thumb_tip, middle_tip))
    index_curvature = calculate_angle(index_tip, index_pip, index_mcp)

    gestures = {
        "Thumbs Up": (thumb_up and not any([index_up, middle_up, ring_up, pinky_up]), thumb_conf),
        "Fist": (not any([thumb_up, index_up, middle_up, ring_up, pinky_up]), 0.95),
        "Peace Sign": (index_up and middle_up and not any([thumb_up, ring_up, pinky_up]), (index_conf + middle_conf) / 2),
        "Pointing": (index_up and not any([thumb_up, middle_up, ring_up, pinky_up]) and index_curvature > 120, index_conf),
        "Open Hand": (all([thumb_up, index_up, middle_up, ring_up, pinky_up]), (thumb_conf + index_conf + middle_conf + ring_conf + pinky_conf) / 5),
        "L Shape": (thumb_up and index_up and not any([middle_up, ring_up, pinky_up]) and thumb_middle_dist > 0.1, (thumb_conf + index_conf) / 2),
        "Three Fingers": (index_up and middle_up and ring_up and not any([thumb_up, pinky_up]), (index_conf + middle_conf + ring_conf) / 3),
        "Shaka": (thumb_up and pinky_up and not any([index_up, middle_up, ring_up]), (thumb_conf + pinky_conf) / 2),
        "Four Fingers": (index_up and middle_up and ring_up and pinky_up and not thumb_up, (index_conf + middle_conf + ring_conf + pinky_conf) / 4),
        "One Finger": (pinky_up and not any([thumb_up, index_up, middle_up, ring_up]), pinky_conf)
    }

    for gesture, (condition, conf) in gestures.items():
        if condition:
            return gesture, min(0.95, max(0.5, conf))
    return "Unknown", 0.0

def is_finger_extended(tip, pip, mcp, orientation):
    angle = calculate_angle(tip, pip, mcp)
    tip_y_adjusted = tip.y + np.sin(np.radians(orientation)) * 0.1
    is_extended = tip_y_adjusted < pip.y and angle > 110
    confidence = min(1.0, max(0.0, (angle - 90) / 90)) if is_extended else 0.0
    return is_extended, confidence

def smooth_gesture(current_gesture, confidence):
    global last_gesture
    gesture_history.append((current_gesture, confidence))
    if len(gesture_history) < 2:
        return current_gesture, confidence
    gesture_counts = {}
    total_conf = 0
    for gest, conf in gesture_history:
        gesture_counts[gest] = gesture_counts.get(gest, 0) + conf
        total_conf += conf
    if not gesture_counts or total_conf == 0:
        last_gesture = "Unknown"
        return "Unknown", 0.0
    smoothed_gesture = max(gesture_counts, key=gesture_counts.get)
    smoothed_conf = gesture_counts[smoothed_gesture] / total_conf
    

    if smoothed_gesture != last_gesture:
        gesture_history.clear()
        gesture_history.append((smoothed_gesture, smoothed_conf))
        last_gesture = smoothed_gesture
    
    return smoothed_gesture, smoothed_conf

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Could not open webcam.", file=sys.stderr)
    sys.exit(1)

width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

frame_count = 0
start_time = time.time()

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture frame.", file=sys.stderr)
        break

    frame = cv2.flip(frame, 1)
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(image)

    frame_count += 1
    elapsed_time = time.time() - start_time
    fps = frame_count / elapsed_time if elapsed_time > 0 else 0

    _, buffer = cv2.imencode('.jpg', frame)
    frame_base64 = base64.b64encode(buffer).decode('utf-8')

    gesture_data = {"gesture": "Unknown", "confidence": 0.0, "fps": fps, "frame": frame_base64}
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            for lm in hand_landmarks.landmark:
                lm.x *= width
                lm.y *= height
                lm.z *= width
            gesture, confidence = recognize_gesture(hand_landmarks)
            smoothed_gesture, smoothed_conf = smooth_gesture(gesture, confidence)
            gesture_data = {"gesture": smoothed_gesture, "confidence": smoothed_conf, "fps": fps, "frame": frame_base64}
    else:
        gesture_history.clear()
        last_gesture = "Unknown"

    sys.stdout.write(json.dumps(gesture_data) + '\n')
    sys.stdout.flush()
    time.sleep(0.033)

cap.release()
hands.close()