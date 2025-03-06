import sys
import json
import cv2
import numpy as np
from ultralytics import YOLO
import os

print("🚀 Script Started")  # ✅ Debugging print

# Load YOLO Model
try:
    print("📥 Loading YOLOv8 Model...")
    model = YOLO("yolov8n.pt")
    print("✅ Model Loaded Successfully!")
except Exception as e:
    print(json.dumps({"error": f"Failed to load YOLO model: {str(e)}"}))
    sys.exit(1)

def detect_objects(image_path):
    print(f"📸 Processing Image: {image_path}")

    img = cv2.imread(image_path)
    if img is None:
        print(json.dumps({"error": "Failed to load image"}))
        sys.exit(1)

    print("🔍 Running YOLO detection...")
    results = model(img)  # Run YOLO inference
    print("✅ Detection Complete!")

    # Extract detected object names
    object_names = set()
    for result in results:
        for box in result.boxes:
            object_names.add(result.names[int(box.cls)])  # Extract class name

    return json.dumps({"objects_detected": list(object_names)})  # ✅ JSON Output

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)

    image_path = sys.argv[1]

    try:
        result = detect_objects(image_path)
        print(result)  # ✅ Ensure proper JSON output
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
